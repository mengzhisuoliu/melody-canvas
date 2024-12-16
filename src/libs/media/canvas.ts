import { Canvas, FabricObject, Path, TSimplePathData } from "fabric";
import { RadiusOptions } from "@/components/editor/types";
import { STANDARD_LIMIT } from "../common/config";

export const getScaledHeight = (objHeight: number, canvasHeight: number) => {
  return ((objHeight / STANDARD_LIMIT) * canvasHeight) / 4;
};

export const cloneCanvas = async (source: Canvas) => {
  const lowerCanvas = document.createElement("canvas");
  lowerCanvas.classList.add("temp_canvas");
  lowerCanvas.style.display = "none";

  const newCanvas = new Canvas(lowerCanvas, {
    width: source.width,
    height: source.height,
    backgroundColor: source.backgroundColor
  });

  await Promise.all(
    source.getObjects().map(async (object) => {
      const obj = await cloneFabricObject(object);
      newCanvas.add(obj);
    })
  );

  const upperCanvas = newCanvas.upperCanvasEl;
  upperCanvas.classList.add("temp_canvas");
  upperCanvas.style.display = "none";

  document.body.appendChild(lowerCanvas);
  document.body.appendChild(upperCanvas);

  return newCanvas;
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
