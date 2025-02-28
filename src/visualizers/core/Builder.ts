import { FabricObject, Group } from "fabric";
import { cloneDeep } from "lodash";

import { createGradientMap, getObjectTransformations } from "@/libs/canvas";
import FrequencyAnalyzer from "./FrequencyAnalyzer";

/**
 * 构造各种可视化元素
 * - 负责直接操作 `Group`
 * - 通用方法放在此类
 * - 具体实现放在子类
 */
abstract class Builder {
  protected id: string;

  protected count: number;

  protected color: string; // Hex or CSS linear-gradient
  protected colorMap: string[]; // 用于渐变色

  protected group: Group;
  protected analyzer: FrequencyAnalyzer;

  constructor(count: number, color: string) {
    this.id = this.generateId();

    this.count = count;

    this.color = color;
    this.colorMap = this.generateColorMap();

    this.group = new Group();
    this.analyzer = new FrequencyAnalyzer(count * 2);
  }

  public clone() {
    const builder = cloneDeep(this);
    builder.updateId();
    return builder;
  }

  private generateId() {
    return `${this.constructor.name}-${new Date().getTime()}`;
  }

  protected generateColorMap() {
    if (!this.color.includes("gradient")) {
      return new Array(this.count).fill(this.color);
    } else {
      return createGradientMap(this.color, this.count);
    }
  }

  public getId() {
    return this.id;
  }

  public updateId() {
    const newId = this.generateId();
    this.id = newId;
    this.group.set({ id: newId });
  }

  public getCount() {
    return this.count;
  }

  public updateCount(count: number) {
    if (!this.group.canvas) return;

    this.count = count;
    this.colorMap = this.generateColorMap();

    this.analyzer.updateFFTSize(count * 2);

    const origProps = getObjectTransformations(this.group);

    const scaledWidth = this.group.width * origProps.scaleX;
    const scaledHeight = this.group.height * origProps.scaleY;
    const elements = this.createElements(scaledWidth, scaledHeight);

    this.group.remove(...this.group.getObjects());
    this.group.add(...elements);

    this.group.set(origProps);
    this.group.setCoords();
  }

  public getColor() {
    return this.color;
  }

  public updateColor(color: string) {
    this.color = color;
    this.colorMap = this.generateColorMap();
    console.log(color)

    this.group.getObjects().forEach((obj, index) => {
      obj.set({ fill: this.colorMap[index] });
    });
  }

  public getGroup() {
    return this.group;
  }

  protected abstract createElements(groupWidth: number, groupHeight: number): FabricObject[];
  public abstract init(canvasWidth: number, canvasHeight: number): void;
  public abstract draw(buffer: AudioBuffer, time: number): void;
}

export default Builder;
