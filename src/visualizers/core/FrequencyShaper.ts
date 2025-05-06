import * as shaperList from "../shaper";

type ShaperFunc = (frequency: number[]) => number[];

/**
 * - `frequency[]` 较小位置对应低频，较大位置对应高频
 * - 大多数音频的能量集中在「低中频」，高频能量少
 * - 因此默认生成的频率数据整体呈递减趋势
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
