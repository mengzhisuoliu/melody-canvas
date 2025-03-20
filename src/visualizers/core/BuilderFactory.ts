import { Canvas, Group } from "fabric";

import { cloneFabricObject, getObjectTransformations } from "@/libs/canvas";
import Builder from "./Builder";

type BuilderConstructor<T extends Builder> = new (...args: ConstructorParameters<typeof Builder>) => T;

const builderModules = import.meta.glob("@/visualizers/builder/*/index.ts");

/**
 * 管理画布上所有的音频可视化元素
 * - 负责直接操作 `Canvas`
 * - 负责统一给 `Builder` 设置标识符
 */
class BuilderFactory {
  private canvas: Canvas;

  private builderMap = new Map<string, BuilderConstructor<Builder>>();
  private builders: Builder[] = [];

  public constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.loadAllBuilders();
  }

  private async loadAllBuilders() {
    for (const path in builderModules) {
      const match = path.match(/\/builder\/([^/]+)\/index\.ts$/);
      const name = match?.[1];
      if (name) {
        const module = (await builderModules[path]()) as { default: BuilderConstructor<Builder> };
        const BuilderClass = module.default;
        this.builderMap.set(name, BuilderClass);
      }
    }
  }

  private getBuilderByGroup(vizGroup: Group) {
    return this.builders.find((builder) => builder.getId() === vizGroup.id);
  }

  public getCanvas() {
    return this.canvas;
  }

  public async clone(newCanvas: Canvas) {
    const factoryCopy = new BuilderFactory(newCanvas);

    // 克隆可视化元素
    this.builders.forEach(async (builder) => {
      const vizName = builder.name;
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

    const builderCopy = builder.clone();
    this.builders.push(builderCopy);

    const groupCopy = (await cloneFabricObject(vizGroup)) as Group;
    groupCopy.set({ id: builderCopy.getId() });
    builderCopy.updateGroup(groupCopy);

    this.canvas.add(groupCopy);
  }

  public async createBuilder(name: string) {
    if (!this.builderMap.has(name)) {
      await this.loadAllBuilders();
    }
    return this.builderMap.get(name)!;
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
