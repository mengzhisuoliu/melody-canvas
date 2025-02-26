import { Circle } from "fabric";

import { NORMALIZATION_FACTOR } from "@/libs/common/config";
import { getObjectTransformations, getScaledHeight } from "@/libs/media/canvas";

import Builder from "../../core/Builder";

class PointLine extends Builder {
  constructor(count: number, color: string) {
    super(count, color);
  }

  private createElements(groupWidth: number, scaledY: number) {
    const amplitude = NORMALIZATION_FACTOR / 4;
    const frequency = (Math.PI * 8) / this.count;
    const heights = new Uint8Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const scaledIndex = i / scaledY;
      // 加上振幅以确保高度为正数
      heights[i] = Math.sin(scaledIndex * frequency) * amplitude + amplitude;
    }

    const circles: Circle[] = [];

    const radius = 3;
    const totalSpacing = groupWidth - 2 * radius * this.count;
    const spacing = totalSpacing / (this.count - 1);

    let x = 0;
    for (let i = 0; i < this.count; i++) {
      const circle = new Circle({
        left: x,
        top: heights[i] * scaledY,
        radius: radius,
        fill: this.fill,
        originY: "bottom"
      });
      circles.push(circle);
      x += 2 * radius + spacing;
    }

    return circles;
  }

  public init(canvasHeight: number, canvasWidth: number) {
    const circles = this.createElements(canvasWidth, 1);
    this.group.add(...circles);
    this.group.set({
      top: canvasHeight / 4 - this.group.height / 2 // 此时的 top 是相对于 Canvas 顶部
    });
  }

  public draw(buffer: AudioBuffer, time: number) {
    const frequency = this.analyzer?.getFrequency(buffer, time);
    if (!frequency || !this.group) return;

    this.group.getObjects().forEach((circle, i) => {
      if (circle.type !== "circle") return;

      const canvasHeight = this.group.canvas?.getHeight();
      if (!canvasHeight) return;

      const objHeight = getScaledHeight(frequency[i], canvasHeight);
      circle.set({
        top: this.group.height / 2 - objHeight // 此时的 top 是相对于 Group 顶部
      });
    });
  }

  public updateCount(count: number) {
    if (!this.group.canvas) return;

    this.count = count;
    this.analyzer.updateFFTSize(count * 2);

    const origProps = getObjectTransformations(this.group);
    const elements = this.createElements(this.group.width * origProps.scaleX, origProps.scaleY);

    // 移除原有内容 -> 整体替换
    this.group.remove(...this.group.getObjects());
    this.group.add(...elements);

    // 确保原有位置和尺寸等不变
    this.group.set(origProps);
    this.group.setCoords();
  }
}

export default PointLine;
