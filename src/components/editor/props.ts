import { checkFontAvailability } from "@/libs/common";
import type { RadiusOptions, ShadowOptions, TextOptions, VizOptions } from "./types";

export const OBJECT_CONFIG = {
  left: 50,
  top: 50
};

/* ----- TextManager ------ */
export const FONT_LIST = [
  // 无衬线 sans-serif
  "Arial",
  "Impact",
  "Comic Sans MS",
  // 衬线 serif
  "FangSong",
  "STZhongsong",
  "Times New Roman",
  // 等宽 monospace
  "Courier New"
].filter((font) => checkFontAvailability(font));

export const DEFAULT_TEXT: TextOptions = {
  fill: "#ffffff",
  fontWeight: 400,
  fontStyle: "normal",
  fontFamily: "Arial"
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
export const DEFAULT_VIZ_OPTIONS: VizOptions = { color: "#ffffff", count: 64 };
