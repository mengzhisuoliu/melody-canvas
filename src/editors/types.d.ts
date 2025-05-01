export type TextOptions = {
  color: string;
  fontWeight: 400 | 900;
  fontStyle: "normal" | "italic";
  fontFamily?: string;
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
  color: string;
  shape: string;
  count: number;
};
