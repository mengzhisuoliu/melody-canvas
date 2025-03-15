/**
 * 中间高，两边低
 */
export default (freq: number[]) => {
  const length = freq.length;
  const mid = Math.floor(length / 2);

  const result = new Array(length);

  for (let i = 0; i < length; i++) {
    if (i <= mid) {
      result[i] = freq[mid - i];
    } else {
      result[i] = freq[i - mid - 1];
    }
  }

  return result;
};
