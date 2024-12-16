export type TextOptions = {
  fill: string;
  fontWeight: 400 | 900;
  fontStyle: "normal" | "italic";
  fontFamily: string;
};

export type RadiusOptions = {
  tl: number;
  tr: number;
  bl: number;
  br: number;
};

export type ShadowOptions = {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
};
