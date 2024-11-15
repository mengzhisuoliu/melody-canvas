import { Circle, Group } from "fabric";

import { FFT_SIZE, SVG_WIDTH } from "@/libs/config";
import { SVG_STYLE } from "@/libs/style";
import { getScaledHeight } from ".";

export const svgWave = () => {
  const count = 25;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const padding = 30;
        const cx = padding + (i * (SVG_WIDTH - 2 * padding)) / (count - 1);
        const cy = 100 + 20 * Math.sin((i * Math.PI) / 4);
        return <circle className={SVG_STYLE} key={i} cx={cx} cy={cy} r="4" />;
      })}
    </>
  );
};

export const initBufferWave = (canvasWidth: number, canvasHeight: number) => {
  const circles: Circle[] = [];

  const bufferSize = FFT_SIZE / 2;
  const bucket = new Uint8Array(bufferSize);

  const amplitude = 127.5; // 波形幅度（高度）
  const frequency = (Math.PI * 8) / bufferSize; // 确保完整的 sin 波形周期

  for (let i = 0; i < bufferSize; i++) {
    bucket[i] = Math.sin(i * frequency) * amplitude + amplitude;
  }

  const radius = 3;
  const totalSpacing = canvasWidth - 2 * radius * bufferSize;
  const spacing = totalSpacing / (bufferSize - 1);

  let x = radius;
  for (let i = 0; i < bufferSize; i++) {
    const objHeight = getScaledHeight(bucket[i], canvasHeight);
    const circle = new Circle({
      left: x,
      top: objHeight,
      radius: radius,
      fill: "#ffffff"
    });
    circles.push(circle);
    x += 2 * radius + spacing;
  }

  const group = new Group(circles, {
    top: canvasHeight / 2
  });
  group.set({ id: "wave" });
  return group;
};

export const drawDynamicWave = (frequency: number[], targetGroup: Group) => {
  targetGroup.getObjects().forEach((circle, i) => {
    const objHeight = getScaledHeight(frequency[i], targetGroup.canvas!.getHeight());
    if (circle.type === "circle") {
      circle.set({
        // 物体的坐标是相对于当前所在 Group 原点
        // todo: check why -> 坐标换算 -> 0 对应 Group 的 Y 中点？
        top: targetGroup.height / 2 - objHeight
      });
    }
  });
};
