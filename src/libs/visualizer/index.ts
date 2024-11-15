import { initBufferBar, svgBar, drawDynamicBar } from "./bar";
import { initBufferWave, svgWave, drawDynamicWave } from "./wave";

export const getScaledHeight = (objHeight: number, canvasHeight: number) => {
  return ((objHeight / 255) * canvasHeight) / 4;
};

export const VISUAL_MAP = {
  bar: {
    svg: svgBar,
    init: initBufferBar,
    draw: drawDynamicBar
  },
  wave: {
    svg: svgWave,
    init: initBufferWave,
    draw: drawDynamicWave
  }
};

export type VisualType = keyof typeof VISUAL_MAP;
