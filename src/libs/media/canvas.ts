import { Canvas } from "fabric";
import { RadiusOptions } from "@/components/editor/types";
import { STANDARD_LIMIT } from "../common/constant";

export const getScaledHeight = (objHeight: number, canvasHeight: number) => {
  return ((objHeight / STANDARD_LIMIT) * canvasHeight) / 4;
};

export const cloneCanvas = async (source: Canvas) => {
  const lowerCanvas = document.createElement("canvas");
  lowerCanvas.classList.add("temp_canvas");
  lowerCanvas.style.display = "none";

  const copy = new Canvas(lowerCanvas, {
    width: source.width,
    height: source.height,
    backgroundColor: source.backgroundColor
  });

  await Promise.all(
    source.getObjects().map(async (obj) => {
      const temp = await obj.clone();
      if (obj.subType) {
        temp.set({ subType: obj.subType });
      }
      copy.add(temp);
    })
  );

  const upperCanvas = copy.upperCanvasEl;
  upperCanvas.classList.add("temp_canvas");
  upperCanvas.style.display = "none";

  document.body.appendChild(lowerCanvas);
  document.body.appendChild(upperCanvas);

  return copy;
};

export const createRoundedPath = (width: number, height: number, radius: RadiusOptions) => {
  const { tl, tr, bl, br } = radius;
  return `
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
};
