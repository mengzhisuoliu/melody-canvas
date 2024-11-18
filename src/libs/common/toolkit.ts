import { Canvas } from "fabric";

export const cloneCanvas = async (source: Canvas) => {
  const lowerCanvas = document.createElement("canvas");
  lowerCanvas.width = source.getWidth();
  lowerCanvas.height = source.getHeight();

  lowerCanvas.classList.add("temp_canvas");
  lowerCanvas.style.display = "none";

  const copy = new Canvas(lowerCanvas);

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
