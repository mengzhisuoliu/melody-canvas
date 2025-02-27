import { Group } from "fabric";
import { cloneDeep } from "lodash";

import { createGradientMap } from "@/libs/canvas";
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

  protected color: string;
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

  private generateId(): string {
    return `${this.constructor.name}-${new Date().getTime()}`;
  }

  public clone(): Builder {
    const builder = cloneDeep(this);
    builder.updateId();
    return builder;
  }

  public getId(): string {
    return this.id;
  }

  public updateId() {
    const newId = this.generateId();
    this.id = newId;
    this.group.set({ id: newId });
  }

  public getCount(): number {
    return this.count;
  }

  public abstract updateCount(count: number): void;

  public getColor(): string {
    return this.color;
  }

  public updateColor(color: string) {
    this.color = color;
    this.colorMap = this.generateColorMap();

    this.group.getObjects().forEach((obj, index) => {
      obj.set({ fill: this.colorMap[index] });
    });
  }

  public getGroup(): Group {
    return this.group;
  }

  public abstract init(canvasHeight: number, canvasWidth: number): void;
  public abstract draw(buffer: AudioBuffer, time: number): void;

  protected generateColorMap() {
    if (!this.color.includes("gradient")) {
      return new Array(this.count).fill(this.color);
    } else {
      return createGradientMap(this.color, this.count);
    }
  }
}

export default Builder;
