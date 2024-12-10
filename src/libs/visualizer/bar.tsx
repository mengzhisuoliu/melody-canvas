import { Group, Rect } from "fabric";

import { FFT_SIZE, STANDARD_LIMIT, SVG_WIDTH, SVG_STYLE } from "../common/constant";
import { getScaledHeight } from "../media/canvas";

export const svgBar = () => {
  const rectWidth = 30;
  const gap = 5; // 预留左右两侧间隔
  const totalRects = Math.floor((SVG_WIDTH + gap) / (rectWidth + gap));

  const totalWidth = totalRects * rectWidth + (totalRects - 1) * gap;
  const offsetX = (SVG_WIDTH - totalWidth) / 2; // 整体居中

  return (
    <g>
      {Array.from({ length: totalRects }, (_, i) => {
        const x = offsetX + i * (rectWidth + gap);

        const isFirstHalf = i < totalRects / 2;
        const height = `${30 + (isFirstHalf ? i * 5 : (totalRects - 1 - i) * 5)}%`; // 先低后高再低
        const y = isFirstHalf ? `${100 - (30 + i * 5)}%` : `${100 - (30 + (totalRects - 1 - i) * 5)}%`;

        return (
          <rect
            className={SVG_STYLE}
            key={i}
            width={rectWidth}
            height={height}
            x={x}
            y={y}
          />
        );
      })}
    </g>
  );
};

export const initBufferBar = (canvasWidth: number, canvasHeight: number) => {
  const rects: Rect[] = [];

  const bucketSize = FFT_SIZE / 2;
  const objHeight = getScaledHeight(STANDARD_LIMIT, canvasHeight);
  const objWidth = canvasWidth / bucketSize - 2;

  let x = 0;
  for (let i = 0; i < bucketSize; i++) {
    const rect = new Rect({
      left: x,
      width: objWidth,
      height: objHeight,
      fill: "#ffffff",
      originY: "bottom" // 使 top 属性成为 obj「底」到 canvas「顶」的距离
    });

    rects.push(rect);
    x += objWidth + 2;
  }

  const group = new Group(rects, {
    top: canvasHeight - objHeight // 矩形的底边与画布底部对齐
  });
  group.set({ subType: { category: "audio", variant: "bar" } });
  return group;
};

export const drawDynamicBar = (frequency: number[], targetGroup: Group) => {
  targetGroup.getObjects().forEach((rect, i) => {
    if (rect.type === "rect") {
      const objHeight = getScaledHeight(frequency[i], targetGroup.canvas!.getHeight());
      rect.set({
        height: objHeight
      });
    }
  });
};
