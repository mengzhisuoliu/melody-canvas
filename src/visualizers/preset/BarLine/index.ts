import { Rect } from "fabric";

import { normalize } from "@/libs/common";
import Builder from "../../core/Builder";

/**
 * 柱状线形
 */
class BarLine extends Builder {
  constructor(count: number, color: string) {
    super(count, color);
  }

  protected createElements(groupWidth: number, groupHeight: number) {
    const rects: Rect[] = [];

    const objWidth = groupWidth / this.count - 2;

    let x = 0;
    for (let i = 0; i < this.count; i++) {
      const rect = new Rect({
        left: x,
        width: objWidth,
        height: groupHeight,
        fill: this.colorMap[i],
        originY: "bottom" // 使 top 属性成为 obj「底」到 Canvas「顶」的距离
      });

      rects.push(rect);
      x += objWidth + 2;
    }

    return rects;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    const groupHeight = canvasHeight / 4;

    const elements = this.createElements(canvasWidth, groupHeight);
    this.group.add(...elements);
    
    this.group.set({
      top: canvasHeight - groupHeight // Group 底部与画布底部对齐
    });
  }

  public draw(buffer: AudioBuffer, time: number) {
    const frequency = this.analyzer?.getFrequency(buffer, time);
    if (!frequency) return;

    const objHeights = normalize(frequency, 0, this.group.height);

    this.group?.getObjects().forEach((rect, i) => {
      const canvasHeight = this.group?.canvas?.getHeight();
      if (rect.type === "rect" && canvasHeight) {
        rect.set({
          height: objHeights[i]
        });
      }
    });
  }
}

export default BarLine;
