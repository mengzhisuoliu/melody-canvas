import { Canvas, Group } from "fabric";

import { cloneFabricObject, getObjectTransformations } from "@/libs/canvas";
import Builder from "./Builder";

type BuilderConstructor<T extends Builder> = new (count: number, color: string) => T;

/**
 * 管理画布上所有的音频可视化元素
 * - 负责直接操作 `Canvas`
 */
class BuilderFactory {
  private canvas: Canvas;

  // 存储已通过动态 import 的组件
  private builderMap = new Map<string, BuilderConstructor<Builder>>();
  private builders: Builder[] = [];

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
      const builderCopy = new BuilderClass(builder.getCount(), builder.getColor());

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

  public async createBuilder<T extends Builder>(descriptor: string) {
    const loadBuilder = async (descriptor: string) => {
      if (this.builderMap.has(descriptor)) {
        return this.builderMap.get(descriptor) as BuilderConstructor<T>;
      }

      const module = await import(`../preset/${descriptor}/index.ts`);
      const BuilderClass = module.default as BuilderConstructor<T>;
      this.builderMap.set(descriptor, BuilderClass);
      return BuilderClass;
    };

    const BuilderClass = await loadBuilder(descriptor);
    return BuilderClass;
  }

  public addBuilder(builder: Builder) {
    this.builders.push(builder);
    builder.init(this.canvas.height, this.canvas.width);

    const group = builder.getGroup();
    group.set({
      subType: "audio",
      id: builder.getId(),
      color: builder.getColor(),
      count: builder.getCount()
    });

    this.canvas.add(builder.getGroup());
  }

  public drawAll(buffer: AudioBuffer, time: number) {
    this.builders.forEach((builder) => builder.draw(buffer, time));
    this.canvas.renderAll();
  }

  public async updateBuilderType(vizGroup: Group, descriptor: string) {
    // 将原本的 Group 删除，直接创建新的
    const BuilderClass = await this.createBuilder(descriptor);

    const builder = new BuilderClass(vizGroup.count || 0, vizGroup.color || "");
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

  private getBuilderByGroup(vizGroup: Group) {
    return this.builders.find((builder) => builder.getId() === vizGroup.id);
  }
}

export default BuilderFactory;
