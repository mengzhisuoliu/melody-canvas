import { Gradient, type ColorStop } from "fabric";

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

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

const formatColorStops = (css: string) => {
  const allColorStops: ColorStop[] = [];

  const colorMatches = css.match(/(rgba?\([^)]+\))\s*(\d+%)/g);
  if (colorMatches) {
    colorMatches.forEach((input) => {
      const match = input.match(/^(rgba?\([^)]+\))\s*(\d+%)$/);
      if (match) {
        const color = match[1];
        const offset = match[2];

        const [r, g, b] = color.match(/\d+/g)!.map(Number);
        const hex = rgbToHex(r, g, b);

        const offsetDecimal = parseFloat(offset) / 100; // 百分比 -> 小数

        allColorStops.push({ color: hex, offset: offsetDecimal });
      }
    });
  }

  return allColorStops;
};

/**
 * @param css - E.g. `linear-gradient(45deg,rgba(131, 222, 196, 1) 0%,rgb(73, 106, 220) 100%)`
 */
export const createGradientFromCss = (css: string, canvasWidth: number, canvasHeight: number) => {
  const degMatch = css.match(/(\d+)deg/);
  const degree = degMatch ? parseInt(degMatch[1]) : 90;

  const gradient = new Gradient({
    type: "linear",
    coords: degreeToCoords(degree, canvasWidth, canvasHeight),
    colorStops: formatColorStops(css)
  });

  return gradient;
};
