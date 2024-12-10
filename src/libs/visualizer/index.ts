import { drawDynamicBar, initBufferBar, svgBar } from "./bar";
import { drawDynamicWave, initBufferWave, svgWave } from "./wave";

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
