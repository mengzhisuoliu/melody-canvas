export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatSelectOptions = (options: string[]) => {
  return options.map((item) => ({ label: item, value: item }));
};

/**
 * 根据给定的模板对象，提取源对象中对应的 value。
 * 如果源对象中缺失某个 key，则使用模板对象中该 key 的默认值。
 * @param {Partial<T>} source - 源对象，包含需要提取的值。
 * @param {T} defaults - 模板对象，包含默认值。
 */
export const pickValues = <T extends object>(source: Partial<T> | undefined, defaults: T) => {
  const result: Partial<T> = {};
  Object.keys(defaults).forEach((key) => {
    result[key as keyof T] = source?.[key as keyof T] ?? defaults[key as keyof T];
  });
  return result as T;
};
