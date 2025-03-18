import { Circle } from "fabric";

import { normalize } from "@/libs/common";
import Builder from "../../core/Builder";

/**
 * 点状线形
 */
class DotLine extends Builder {
  public get name() {
    return "DotLine";
  }

  constructor(count: number, color: string, shape: string) {
    super(count, color, shape);
  }

  protected createElements(groupWidth: number, groupHeight: number) {
    const frequency = (Math.PI * 8) / this.count;
    const circles: Circle[] = [];

    const radius = 3;
    const padding = 2;
    const totalSpacing = groupWidth - padding * radius * this.count;
    const spacing = totalSpacing / (this.count - 1);

    // 相同的 count 会生成相同的 sinValues
    const sinValues: number[] = [];
    for (let i = 0; i < this.count; i++) {
      sinValues.push(Math.sin(i * frequency));
    }
    const normSin = normalize(sinValues, 0, 1);

    let x = 0;
    for (let i = 0; i < this.count; i++) {
      // 但是具体的 y 坐标需要根据 Group 的高度来计算
      // 这里的减数 (diameter + control stroke width) 是为了避免图形超出 Group 边界
      const y = (groupHeight - radius * 2 - 1) * normSin[i];

      const circle = new Circle({
        left: x,
        top: y,
        radius: radius,
        fill: this.colorMap[i],
        originY: "top"
      });

      circles.push(circle);
      x += 2 * radius + spacing;
    }

    return circles;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    const groupHeight = canvasHeight / 4;

    const elements = this.createElements(canvasWidth, groupHeight);
    this.group.add(...elements);

    this.group.set({
      top: groupHeight // 此时的 top 是相对于 Canvas 顶部
    });
  }

  protected draw(frequency: number[]) {
    const objHeights = normalize(frequency, 0, this.group.height);

    this.group.getObjects().forEach((circle, i) => {
      if (circle.type !== "circle") return;
      circle.set({
        top: this.group.height / 2 - objHeights[i] // 此时的 top 是相对于 Group 顶部
      });
    });
  }
}

export default DotLine;
