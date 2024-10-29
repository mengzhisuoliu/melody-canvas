import { Canvas, FabricObject } from "fabric";
import { useEffect, useRef } from "react";

import { FABRIC_CONFIG } from "@/libs/config";
import useCanvasStore from "@/stores/canvasStore";

/**
 * 视频预览区域
 */
const CanvasPreview: React.FC = () => {
  const { createCanvas, disposeCanvas } = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;
    const canvasParent = canvasEl.parentElement!;
    const instance = new Canvas(canvasEl, {
      width: canvasParent.clientWidth,
      height: canvasParent.clientHeight
    });

    Object.assign(FabricObject.ownDefaults, FABRIC_CONFIG);
    
    createCanvas(instance);

    return () => {
      disposeCanvas();
    };
  }, []);

  return (
    <div className="w-[70vw] h-[calc(70vw*9/16)] bg-dark-800 absolute transform translate-y-[-50%] top-[calc(50%-16px)] right-7">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default CanvasPreview;
