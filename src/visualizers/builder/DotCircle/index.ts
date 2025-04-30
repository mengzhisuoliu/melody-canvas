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

  /* 小圆点的初始半径，根据元素数量调整，元素越多半径越小，避免重叠 */
  private dotRadius = 8 - Math.log2(this.count);

  constructor(count: number, color: string, shape: string) {
    super(count, color, shape);
  }

  protected createElements(groupWidth: number, groupHeight: number) {
    const circles: Circle[] = [];
    const orbitRadius = this.calcOrbitRadius(groupWidth, groupHeight);

    for (let i = 0; i < this.count; i++) {
      const angle = this.calcAngle(i);

      /* 极坐标转笛卡尔坐标：x = r * cos(θ)，y = r * sin(θ) */
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

    this.group.set({
      top: canvasHeight / 2,
      left: canvasWidth / 2,
      originX: "center",
      originY: "center"
    });
  }

  protected draw(frequency: number[]) {
    const MIN_SCALE = 1;
    const MAX_SCALE = 2.25;
    const PADDING = 10;

    const objHeights = normalize(frequency, MIN_SCALE, MAX_SCALE);
    const orbitRadius = this.calcOrbitRadius(this.group.width, this.group.height) - PADDING;

    this.group.getObjects().forEach((circle, i) => {
      if (circle.type !== "circle") return;

      const angle = this.calcAngle(i);
      const x = orbitRadius * Math.cos(angle);
      const y = orbitRadius * Math.sin(angle);

      const freqIndex = Math.floor((i / this.count) * objHeights.length);
      const scaleValue = objHeights[freqIndex];

      const time = Date.now() / 200;
      const jitter = 0.15 * Math.sin(time + i); // 添加时间扰动
      const animatedScale = scaleValue + jitter;

      const opacity = Math.pow(scaleValue / MAX_SCALE, 1.5); // 非线性增强，高频更亮，低频更淡

      circle.set({
        left: x,
        top: y,
        radius: this.dotRadius * animatedScale,
        scaleX: animatedScale,
        scaleY: animatedScale,
        opacity
      });
    });
  }

  /* ----- 通用的计算逻辑 ----- */

  /**
   * 计算大圆半径（所有小圆点围绕形成的整体）
   */
  private calcOrbitRadius(groupWidth: number, groupHeight: number) {
    return (Math.min(groupWidth, groupHeight) - this.dotRadius * 2 - 1) / 2;
  }

  /**
   * 计算第 i 个元素在圆周上的角度（弧度制）
   * - 可以理解为大圆被均匀分成 `this.count` 份
   * - 所有小圆点均匀分布，范围为 [0, 2π)
   */
  private calcAngle(index: number) {
    return (index / this.count) * Math.PI * 2;
  }

  /* ------------------------- */
}

export default DotCircle;
