import { Circle } from "fabric";

import { normalize } from "@/libs/common";
import Builder from "../../core/Builder";

/**
 * 点状环形
 */
class DotCircle extends Builder {
  public get name() {
    return "DotCircle";
  }

  private dotRadius = 8 - Math.log2(this.count);

  constructor(count: number, color: string, shape: string) {
    super(count, color, shape);
  }

  protected createElements(groupWidth: number, groupHeight: number) {
    const circles: Circle[] = [];
    const orbitRadius = this.calcOrbitRadius(groupWidth, groupHeight);

    for (let i = 0; i < this.count; i++) {
      const angle = this.calcAngle(i);
      const x = groupWidth / 2 + orbitRadius * Math.cos(angle);
      const y = groupHeight / 2 + orbitRadius * Math.sin(angle);

      const circle = new Circle({
        left: x,
        top: y,
        radius: this.dotRadius,
        fill: this.colorMap[i],
        originX: "center",
        originY: "center"
      });

      circles.push(circle);
    }

    return circles;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    const groupSize = Math.min(canvasWidth, canvasHeight) / 2;

    const elements = this.createElements(groupSize, groupSize);
    this.group.add(...elements);

    // 水平垂直居中
    this.group.set({
      top: canvasHeight / 2,
      left: canvasWidth / 2,
      originX: "center",
      originY: "center"
    });
  }

  protected draw(frequency: number[]) {
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 2.25;
    const PADDING = 10;

    const objHeights = normalize(frequency, MIN_SCALE, MAX_SCALE);
    const orbitRadius = this.calcOrbitRadius(this.group.width, this.group.height) - PADDING;

    this.group.getObjects().forEach((circle, i) => {
      if (circle.type !== "circle") return;

      const angle = this.calcAngle(i);
      const freqIndex = Math.floor((i / this.count) * objHeights.length);
      const scaleValue = objHeights[freqIndex];

      const x = orbitRadius * Math.cos(angle);
      const y = orbitRadius * Math.sin(angle);

      circle.set({
        left: x,
        top: y,
        radius: this.dotRadius * scaleValue,
        scaleX: scaleValue,
        scaleY: scaleValue
      });
    });
  }

  /* ----- 通用的计算逻辑 ----- */
  private calcOrbitRadius(groupWidth: number, groupHeight: number) {
    return (Math.min(groupWidth, groupHeight) - this.dotRadius * 2 - 1) / 2;
  }

  private calcAngle(index: number) {
    return (index / this.count) * Math.PI * 2;
  }
  /* ------------------------- */
}

export default DotCircle;
