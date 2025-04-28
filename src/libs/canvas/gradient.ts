import chroma from "chroma-js";
import { Gradient, type ColorStop } from "fabric";

const DIRECTION_MAP: Record<string, number> = {
  "to top": 0,
  "to right": 90,
  "to bottom": 180,
  "to left": 270,
  "to top right": 45,
  "to right top": 45,
  "to bottom right": 135,
  "to right bottom": 135,
  "to bottom left": 225,
  "to left bottom": 225,
  "to top left": 315,
  "to left top": 315
};

export const GRADIENT_PRESET = [
  "linear-gradient(to right, #d7d2cc 0%, #304352 100%)",
  "linear-gradient(to right, #fddb92 0%, #d1fdff 100%)",
  "linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)",
  "linear-gradient(to right, #69EACB 0%, #d883ff 100%)",
  "linear-gradient(to right, #9CECFB 0%, #0052D4 100%)",
  "linear-gradient(to right, #BA5370 0%, #F4E2D8 100%)"
];

/**
 * @param css - E.g. `linear-gradient(45deg,rgba(131, 222, 196, 1) 0%,rgb(73, 106, 220) 100%)`
 */
const parseGradient = (css: string) => {
  const regex = /(\d+)deg|to\s+\w+(?:\s+\w+)?|rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\d+%/g;
  const cssMatches = css.match(regex);

  let degree = 180;
  const degMatch = cssMatches?.find((m) => m.includes("deg"));

  if (degMatch) {
    degree = parseFloat(degMatch.replace("deg", ""));
  } else {
    const direction = cssMatches?.find((m) => m.startsWith("to "));
    direction && (degree = DIRECTION_MAP[direction]);
  }

  const colors = cssMatches?.filter((m) => m.includes("rgb") || m.includes("rgba")) || [];
  const stops = cssMatches?.filter((m) => m.includes("%")).map((s) => parseFloat(s) / 100) || [];

  return { degree, colors, stops };
};

const degreeToCoords = (degree: number, objWidth: number, objHeight: number) => {
  // 角度 -> 弧度
  const radians = ((degree - 270) * Math.PI) / 180;

  const centerX = objWidth / 2;
  const centerY = objHeight / 2;
  const length = Math.sqrt(objWidth * objWidth + objHeight * objHeight) / 2;

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
 * 基于 css 的 `linear-gradient` 创建 Fabric `Gradient` 对象
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
export const createGradientMap = (cssGradient: string, count: number) => {
  const { colors, stops } = parseGradient(cssGradient);

  const gradient = chroma.scale(colors).domain(stops);

  const colorMap = [];
  for (let i = 0; i < count; i++) {
    const position = i / (count - 1);
    const color = gradient(position).hex();
    colorMap.push(color);
  }

  return colorMap;
};
