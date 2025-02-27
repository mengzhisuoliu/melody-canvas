import { Rect } from "fabric";

import { getObjectTransformations, getScaledHeight } from "@/libs/canvas";
import Builder from "../../core/Builder";

class FlatBar extends Builder {
  constructor(count: number, color: string) {
    super(count, color);
  }

  private createElement(groupWidth: number, groupHeight: number) {
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

  public init(canvasHeight: number, canvasWidth: number) {
    const groupHeight = canvasHeight / 4;
    const elements = this.createElement(canvasWidth, groupHeight);
    this.group.add(...elements);

    this.group.set({
      top: canvasHeight - groupHeight // 矩形的底边与画布底部对齐
    });
  }

  public draw(buffer: AudioBuffer, time: number) {
    const frequency = this.analyzer?.getFrequency(buffer, time);
    if (!frequency) return;

    this.group?.getObjects().forEach((rect, i) => {
      const canvasHeight = this.group?.canvas?.getHeight();
      if (rect.type === "rect" && canvasHeight) {
        const objHeight = getScaledHeight(frequency[i], canvasHeight);
        rect.set({
          height: objHeight
        });
      }
    });
  }

  public updateCount(count: number) {
    if (!this.group.canvas) return;

    this.count = count;
    this.analyzer.updateFFTSize(count * 2);

    const origProps = getObjectTransformations(this.group);
    const element = this.createElement(this.group.width * origProps.scaleX, this.group.height * origProps.scaleY);

    this.group.remove(...this.group.getObjects());
    this.group.add(...element);

    this.group.set(origProps);
    this.group.setCoords();
  }
}

export default FlatBar;
