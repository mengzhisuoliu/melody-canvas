import { checkAvailableFonts } from "@/libs/common";
import { DEFAULT_SHAPE } from "@/visualizers";
import type { RadiusOptions, ShadowOptions, TextOptions, VizOptions } from "./types";

export const OBJECT_CONFIG = {
  left: 50,
  top: 50
};

/* ----- TextManager ------ */
const FONT_LIST = [
  // 无衬线 sans-serif
  "Arial",
  "Impact",
  "Comic Sans MS",
  "Hanzipen SC",
  // 衬线 serif
  "FangSong",
  "STSong",
  "STZhongsong",
  "Times New Roman",
  // 等宽 monospace
  "Courier New"
];

export const AVAILABLE_FONTS = checkAvailableFonts(FONT_LIST);

export const DEFAULT_TEXT: TextOptions = {
  color: "#ffffff",
  fontWeight: 400,
  fontStyle: "normal",
};

/* ----- ImageProcessor ------ */
export const RADIUS_INPUT = [
  { key: "tl", icon: "i-tabler:radius-top-left" },
  { key: "tr", icon: "i-tabler:radius-top-right" },
  { key: "bl", icon: "i-tabler:radius-bottom-left" },
  { key: "br", icon: "i-tabler:radius-bottom-right" }
];

export const DEFAULT_RADIUS: RadiusOptions = { tl: 0, tr: 0, bl: 0, br: 0 };
export const DEFAULT_SHADOW: ShadowOptions = { color: "#ffffff", blur: 0, offsetX: 0, offsetY: 0 };

/* ----- AudioVisualizer ------ */
export const DEFAULT_VIZ_OPTIONS: VizOptions = { color: "#ffffff", shape: DEFAULT_SHAPE, count: 64 };
