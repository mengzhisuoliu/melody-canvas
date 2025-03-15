import { Rect } from "fabric";

import { normalize } from "@/libs/common";
import Builder from "../../core/Builder";

/**
 * 柱状环形
 */
class BarCircle extends Builder {
  private readonly barHeight = 20;

  constructor(count: number, color: string) {
    super(count, color);
  }

  protected createElements(groupWidth: number, groupHeight: number) {
    const bars: Rect[] = [];
    const orbitRadius = (Math.min(groupWidth, groupHeight) - this.barHeight - 1) / 2;
    const barWidth = 10 - Math.log2(this.count);

    for (let i = 0; i < this.count; i++) {
      const angle = (i / this.count) * Math.PI * 2;
      const x = groupWidth / 2 + orbitRadius * Math.cos(angle);
      const y = groupHeight / 2 + orbitRadius * Math.sin(angle);
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
      originY: "center"
    });
  }

  public draw(buffer: AudioBuffer, time: number) {
    const frequency = this.analyzer?.getFrequency(buffer, time);
    if (!frequency) return;

    const MIN_SCALE = 0.5;
    const MAX_SCALE = 2.5;

    const objHeights = normalize(frequency, MIN_SCALE, MAX_SCALE);

    this.group.getObjects().forEach((bar, i) => {
      if (bar.type !== "rect") return;

      const freqIndex = Math.floor((i / this.count) * objHeights.length);
      const scale = objHeights[freqIndex];
      const newHeight = this.barHeight * scale;

      bar.set({
        height: newHeight
      });
    });
  }
}

export default BarCircle;
