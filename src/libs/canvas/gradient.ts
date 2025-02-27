import { Gradient, type ColorStop } from "fabric";
import chroma from "chroma-js";

const degreeToCoords = (degree: number, canvasWidth: number, canvasHeight: number) => {
  // 角度 -> 弧度
  const radians = (degree * Math.PI) / 180;

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const length = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) / 2;

  const x1 = centerX + Math.cos(radians) * length;
  const y1 = centerY + Math.sin(radians) * length;
  const x2 = centerX - Math.cos(radians) * length;
  const y2 = centerY - Math.sin(radians) * length;

  return { x1, y1, x2, y2 };
};

const formatColorStops = (colors: string[], stops: number[]) => {
  const colorStops: ColorStop[] = [];

  colors.forEach((color, index) => {
    const offset = stops[index];
    colorStops.push({ color, offset });
  });

  return colorStops;
};

/**
 * @param css - E.g. `linear-gradient(45deg,rgba(131, 222, 196, 1) 0%,rgb(73, 106, 220) 100%)`
 */
const parseGradient = (css: string) => {
  const regex = /(\d+)deg|rgba?\([^)]+\)|rgb\([^)]+\)|\d+%/g;
  const matches = css.match(regex);

  const degree = parseFloat(matches?.find((m) => m.includes("deg")) || "90");
  const colors = matches?.filter((m) => m.includes("rgb") || m.includes("rgba")) || [];
  const stops = matches?.filter((m) => m.includes("%")).map((s) => parseFloat(s) / 100) || [];

  return { degree, colors, stops };
};

/**
 * 基于 css 的 `linear-gradient  创建 Fabric `Gradient` 对象
 */
export const createGradient = (cssGradient: string, canvasWidth: number, canvasHeight: number) => {
  const { degree, colors, stops } = parseGradient(cssGradient);

  const gradient = new Gradient({
    type: "linear",
    coords: degreeToCoords(degree, canvasWidth, canvasHeight),
    colorStops: formatColorStops(colors, stops)
  });

  return gradient;
};

/**
 * 基于 css 的 `linear-gradient` 创建颜色数组
 */
export function createGradientMap(cssGradient: string, count: number) {
  const { colors, stops } = parseGradient(cssGradient);

  const gradient = chroma.scale(colors).domain(stops);

  const colorMap = [];
  for (let i = 0; i < count; i++) {
    const position = i / (count - 1);
    const color = gradient(position).hex();
    colorMap.push(color);
  }

  return colorMap;
}
