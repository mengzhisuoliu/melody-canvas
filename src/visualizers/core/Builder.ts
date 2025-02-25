import { Group } from "fabric";
import { cloneDeep } from "lodash";

import FrequencyAnalyzer from "./FrequencyAnalyzer";

/**
 * 构造各种可视化元素
 * - 负责直接操作 `Group`
 * - 通用方法放在此类
 * - 具体实现放在子类
 */
abstract class Builder {
  public id: string;
  public count: number;
  public fill: string;
  public group: Group;
  public analyzer: FrequencyAnalyzer;

  constructor(count: number, fill: string) {
    this.id = this.generateId();

    this.count = count;
    this.fill = fill;

    this.group = new Group();
    this.group.set({ subType: "audio", id: this.id });

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

  public getFill(): string {
    return this.fill;
  }

  public updateFill(fill: string) {
    this.fill = fill;
    this.group.getObjects().forEach((obj) => {
      obj.set({ fill });
    });
  }

  public getGroup(): Group {
    return this.group;
  }

  public abstract init(canvasHeight: number, canvasWidth: number): void;
  public abstract draw(buffer: AudioBuffer, time: number): void;
}

export default Builder;
