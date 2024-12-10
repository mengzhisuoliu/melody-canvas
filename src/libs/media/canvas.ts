import { Canvas } from "fabric";

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
      if (obj.id) {
        temp.set({ id: obj.id });
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
