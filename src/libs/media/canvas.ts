import { FabricObject, Path, TSimplePathData } from "fabric";

import { RadiusOptions } from "@/components/editor/types";
import { NORMALIZATION_FACTOR } from "../common/config";

export const getScaledHeight = (objHeight: number, containerHeight: number) => {
  return ((objHeight / NORMALIZATION_FACTOR) * containerHeight) / 4;
};

export const cloneFabricObject = async (source: FabricObject) => {
  const newObject = await source.clone();
  if (source.subType) {
    newObject.set({ subType: source.subType });
  }
  return newObject;
};

/**
 * @see https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
 */
export const createPathByRadius = (width: number, height: number, radius: RadiusOptions) => {
  const { tl, tr, bl, br } = radius;

  const pathData = `
      M ${tl} 0 
      L ${width - tr} 0 
      Q ${width} 0 ${width} ${tr} 
      L ${width} ${height - br} 
      Q ${width} ${height} ${width - br} ${height} 
      L ${bl} ${height} 
      Q 0 ${height} 0 ${height - bl} 
      L 0 ${tl} 
      Q 0 0 ${tl} 0
      Z
    `;

  return new Path(pathData, {
    left: -width / 2,
    top: -height / 2
  });
};

/**
 * @param path - 嵌套数组 [`[command, _, _, _?, _?]`]
 * 每个子数组按顺序对应 `createPathByRadius` 中 `pathData` 的一行路径命令
 * - `command`: 'M'、'L'、'Q' 等
 * - `_`: x 与 y 坐标
 * - `_?`: 只在使用贝塞尔曲线时出现
 */
export const extractRadiusFromPath = (path: TSimplePathData, width: number, height: number) => {
  const tl = path[0]?.[1] ?? 0;
  const tr = width - (path[1]?.[1] ?? 0);
  const br = height - (path[3]?.[2] ?? 0);
  const bl = path[5]?.[1] ?? 0;

  return { tl, tr, bl, br };
};
