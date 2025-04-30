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

/**
 * 根据给定的模板对象，提取源对象中对应的 value
 * 如果源对象中缺失某个 key，则使用模板对象中该 key 的默认值
 * @param {Partial<T>} source - 源对象，包含需要提取的值
 * @param {T} defaults - 模板对象，包含默认值
 */
export const pickWithDefaults = <T extends object>(source: Partial<T> | undefined, defaults: T) => {
  const result: Partial<T> = {};
  Object.keys(defaults).forEach((key) => {
    result[key as keyof T] = source?.[key as keyof T] ?? defaults[key as keyof T];
  });
  return result as T;
};

/**
 * 检查传入的 font-family 是否在当前游览器可用
 */
export const checkFontAvailability = (font: string) => {
  const defaultFont = "Arial";
  if (font.toLowerCase() === defaultFont.toLowerCase()) return true;

  const testChar = "a";
  const canvasWidth = 100;
  const canvasHeight = 100;
  const fontSize = 100;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return false;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  context.textAlign = "center";
  context.fillStyle = "black";
  context.textBaseline = "middle";

  const getFontPixels = (font: string) => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.font = `${fontSize}px ${font}, ${defaultFont}`;
    context.fillText(testChar, canvasWidth / 2, canvasHeight / 2);

    const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
    return Array.from(imageData).filter((value) => value !== 0);
  };

  const defaultFontPixels = getFontPixels(defaultFont);
  const testFontPixels = getFontPixels(font);

  // 像素数据不同 -> 传入的字体被正确渲染 -> 存在可用字体
  return defaultFontPixels.join("") !== testFontPixels.join("");
};

/**
 * 归一化（将输入 values 映射到指定的 [min, max] 范围）
 */
export const normalize = (values: number[], min: number, max: number) => {
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // 避免除零错误
  if (maxVal === minVal) return values.map(() => min);

  return values.map((value) => ((value - minVal) / (maxVal - minVal)) * (max - min) + min);
};
