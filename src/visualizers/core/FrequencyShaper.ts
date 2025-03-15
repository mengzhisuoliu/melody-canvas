import * as shaperList from "../shaper";

type ShaperFunc = (frequency: number[]) => number[];

/**
 * - frequency[]` 较小位置对应低频，较大位置对应高频
 * - 大多数音频会偏向「低中频」，高频部分能量少
 * - 从而累积在前面部分
 * - 因此默认的数组数据整体递减
 */
export const DEFAULT_SHAPE = "Slope";

export const shaperMap: Record<string, ShaperFunc> = {
  [DEFAULT_SHAPE]: (freq) => freq,
  ...shaperList
};

export const applyShaper = (type: string, frequency: number[]) => {
  if (!shaperMap[type]) {
    console.warn(`Shaper type '${type}' not found, applying default.`);
    return shaperMap[DEFAULT_SHAPE](frequency);
  }

  return shaperMap[type](frequency);
};
