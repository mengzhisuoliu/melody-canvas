import { Canvas, Group } from "fabric";

import { cloneFabricObject, getObjectTransformations } from "@/libs/canvas";
import Builder from "./Builder";

type BuilderConstructor<T extends Builder> = new (...args: ConstructorParameters<typeof Builder>) => T;

/**
 * 管理画布上所有的音频可视化元素
 * - 负责直接操作 `Canvas`
 * - 负责统一给 `Builder` 设置标识符
 */
class BuilderFactory {
  private canvas: Canvas;

  // 存储已通过动态 import 的组件
  private builderMap = new Map<string, BuilderConstructor<Builder>>();
  private builders: Builder[] = [];

  private getBuilderByGroup(vizGroup: Group) {
    return this.builders.find((builder) => builder.getId() === vizGroup.id);
  }

  public constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public getCanvas() {
    return this.canvas;
  }

  public async clone(newCanvas: Canvas) {
    const factoryCopy = new BuilderFactory(newCanvas);

    // 克隆可视化元素
    this.builders.forEach(async (builder) => {
      const vizName = builder.constructor.name;
      const BuilderClass = await factoryCopy.createBuilder(vizName);
      const builderCopy = new BuilderClass(builder.getCount(), builder.getColor(), builder.getShape());

      // 先初始化 Group
      factoryCopy.addBuilder(builderCopy);

      // 再确保原有属性不变
      const origProps = getObjectTransformations(builder.getGroup()!);
      const groupCopy = builderCopy.getGroup();
      groupCopy.set(origProps);
    });

    // 克隆画布上的其它元素
    await Promise.all(
      this.canvas.getObjects().map(async (object) => {
        if (object.subType === "audio") return;
        const objCopy = await cloneFabricObject(object);
        newCanvas.add(objCopy);
      })
    );

    return factoryCopy;
  }

  public async cloneBuilder(vizGroup: Group) {
    const builder = this.getBuilderByGroup(vizGroup);
    if (!builder) return;
    this.addBuilder(builder.clone());
  }

  public async createBuilder<T extends Builder>(name: string) {
    const loadBuilder = async (name: string) => {
      if (this.builderMap.has(name)) {
        return this.builderMap.get(name) as BuilderConstructor<T>;
      }

      const module = await import(`../preset/${name}/index.ts`);
      const BuilderClass = module.default as BuilderConstructor<T>;
      this.builderMap.set(name, BuilderClass);
      return BuilderClass;
    };

    const BuilderClass = await loadBuilder(name);
    return BuilderClass;
  }

  public addBuilder(builder: Builder) {
    this.builders.push(builder);
    builder.init(this.canvas.width, this.canvas.height);

    const group = builder.getGroup();
    group.set({
      subType: "audio",
      id: builder.getId(),
      color: builder.getColor(),
      count: builder.getCount(),
      shape: builder.getShape()
    });

    this.canvas.add(builder.getGroup());
  }

  public drawAll(buffer: AudioBuffer, time: number) {
    this.builders.forEach((builder) => builder.prepareDraw(buffer, time));
    this.canvas.requestRenderAll();
  }

  public async updateBuilderType(vizGroup: Group, name: string) {
    // 将原本的 Group 删除，直接创建新的
    const BuilderClass = await this.createBuilder(name);

    const { count, color, shape } = vizGroup;
    const builder = new BuilderClass(count!, color!, shape!);

    this.addBuilder(builder);

    const group = builder.getGroup();
    const origProps = getObjectTransformations(vizGroup);
    group.set(origProps);

    this.canvas.remove(vizGroup);
    this.canvas.setActiveObject(group);
  }

  public updateBuilderCount(vizGroup: Group, count: number) {
    this.getBuilderByGroup(vizGroup)?.updateCount(count);
    vizGroup.set({ count });
    this.canvas.requestRenderAll();
  }

  public updateBuilderColor(vizGroup: Group, color: string) {
    this.getBuilderByGroup(vizGroup)?.updateColor(color);
    vizGroup.set({ color });
    this.canvas.requestRenderAll();
  }

  public updateBuilderShape(vizGroup: Group, shape: string) {
    this.getBuilderByGroup(vizGroup)?.updateShape(shape);
    vizGroup.set({ shape });
  }
}

export default BuilderFactory;
