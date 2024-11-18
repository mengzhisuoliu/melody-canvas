import { drawDynamicBar, initBufferBar, svgBar } from "./bar";
import { drawDynamicWave, initBufferWave, svgWave } from "./wave";

import { STANDARD_LIMIT } from "../common/constant";

export const getScaledHeight = (objHeight: number, canvasHeight: number) => {
  return ((objHeight / STANDARD_LIMIT) * canvasHeight) / 4;
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
