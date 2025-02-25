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

// 可以直接 set 给 fabric 对象的属性
export type VizOptions = {
  fill: string;
  count: number;
};

// 需要额外处理的属性
export type VizOptionsExtra = {
  fill: string;
  count: number;
};
