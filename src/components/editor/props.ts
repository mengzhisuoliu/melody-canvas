import { TextOptions } from "./types";

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
  "宋体",
  "Times New Roman",
  // 等宽 monospace
  "Consolas",
  "Courier New"
].filter((font) => document.fonts.check(`12px "${font}"`));

export const DEFAULT_TEXT: TextOptions = {
  fill: "#ffffff",
  fontWeight: 400,
  fontStyle: "normal",
  fontFamily: "Arial"
};
