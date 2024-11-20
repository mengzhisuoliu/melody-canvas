import { Canvas, FabricObject } from "fabric";
import { useEffect, useRef } from "react";

import { FABRIC_CONFIG } from "@/libs/common/constant";
import useCanvasStore from "@/stores/canvasStore";

import RightClickMenu from "./RightClickMenu";

/**
 * 视频预览区域
 */
const CanvasPreview: React.FC = () => {
  const { createCanvas, disposeCanvas, backdrop } = useCanvasStore();
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
    <div className="w-[70vw] h-[calc(70vw*9/16)] bg-black  border-2 border-emerald-500 dark:border-dark-50 absolute transform translate-y-[-50%] top-[calc(50%-16px)] right-7">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <RightClickMenu />
    </div>
  );
};

export default CanvasPreview;
