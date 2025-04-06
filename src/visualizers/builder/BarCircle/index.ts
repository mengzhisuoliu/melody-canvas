import { Rect } from "fabric";

import { normalize } from "@/libs/common";
import Builder from "../../core/Builder";

/**
 * 柱状环形
 */
class BarCircle extends Builder {
  public get name() {
    return "BarCircle";
  }

  private readonly barHeight = 25;
  private readonly groupPadding = 20;

  constructor(count: number, color: string, shape: string) {
    super(count, color, shape);
  }

  protected createElements(groupWidth: number, groupHeight: number) {
    const bars: Rect[] = [];
    const orbitRadius = (Math.min(groupWidth, groupHeight) - this.barHeight - 1) / 2;
    const barWidth = 10 - Math.log2(this.count);

    for (let i = 0; i < this.count; i++) {
      const angle = (i / this.count) * Math.PI * 2;

      const x = groupWidth / 2 + orbitRadius * Math.cos(angle);
      const y = groupHeight / 2 + orbitRadius * Math.sin(angle);

      /* 比 DotCircle 多出来的一个步骤 -> 小圆点没有方向性，而矩形有明确的朝向，需要旋转 */
      const rotationAngle = (angle * 180) / Math.PI + 90;

      const bar = new Rect({
        left: x,
        top: y - this.barHeight / 2,
        width: barWidth,
        height: this.barHeight,
        fill: this.colorMap[i],
        originX: "center",
        originY: "center",
        angle: rotationAngle
      });

      bars.push(bar);
    }

    return bars;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    const groupSize = Math.min(canvasWidth, canvasHeight) / 2;
    const elements = this.createElements(groupSize, groupSize);
    this.group.add(...elements);

    this.group.set({
      top: canvasHeight / 2,
      left: canvasWidth / 2,
      originX: "center",
      originY: "center",
      width: this.group.width + this.groupPadding,
      height: this.group.height + this.groupPadding
    });
  }

  protected draw(frequency: number[]) {
    const MIN_SCALE = 0.1;
    const MAX_SCALE = 2;

    const objHeights = normalize(frequency, MIN_SCALE, MAX_SCALE);

    this.group.getObjects().forEach((bar, i) => {
      if (bar.type !== "rect") return;

      const freqIndex = Math.floor((i / this.count) * objHeights.length);
      const scale = objHeights[freqIndex];
      const newHeight = this.barHeight * scale - this.groupPadding;

      bar.set({
        height: newHeight
      });
    });
  }
}

export default BarCircle;
