import { Canvas, FabricObject } from "fabric";
import { useEffect, useRef, useState } from "react";

import { THEME_COLOR } from "@/libs/common/config";
import useCanvasStore from "@/stores/canvasStore";

import RightClickMenu from "./RightClickMenu";

/**
 * 视频预览区域
 */
const CanvasPreview: React.FC = () => {
  const { createCanvas, disposeCanvas, canvasInstance, backdrop } = useCanvasStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasRatio, setCanvasRatio] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const instance = new Canvas(canvasRef.current, {
      selectionColor: "rgba(83, 172, 142, 0.2)"
    });

    Object.assign(FabricObject.ownDefaults, {
      borderColor: THEME_COLOR,
      cornerColor: THEME_COLOR
    });

    createCanvas(instance);

    return () => disposeCanvas();
  }, []);

  useEffect(() => {
    if (!canvasInstance) return;
    canvasInstance.backgroundColor = backdrop.color;
    canvasInstance.renderAll();
  }, [canvasInstance, backdrop.color]);

  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasInstance?.lowerCanvasEl) return;

      const [width, height] = backdrop.ratio.split(":").map(Number);
      setCanvasRatio({ width, height });

      let canvasWidth = containerRef.current!.clientWidth;
      let canvasHeight = containerRef.current!.clientHeight;

      // 视频编码器要求：H264 only supports even sized frames
      canvasWidth = canvasWidth % 2 === 0 ? canvasWidth : canvasWidth - 1;
      canvasHeight = canvasHeight % 2 === 0 ? canvasHeight : canvasHeight - 1;

      canvasInstance.setDimensions({
        width: canvasWidth,
        height: canvasHeight
      });
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef!.current!);
    return () => observer.disconnect();
  }, [canvasInstance, backdrop.ratio]);

  return (
    <div
      ref={containerRef}
      className="absolute bg-black border-2 border-emerald-500 dark:border-dark-50 flex-center"
      style={{
        transform: "translate(-50%, -50%)",
        left: "calc(50% + 12.5vw)",
        top: "50%",
        width: `calc(60vh * ${canvasRatio.width} / ${canvasRatio.height})`,
        height: "60vh"
      }}
    >
      <canvas ref={canvasRef}></canvas>
      <RightClickMenu />
    </div>
  );
};

export default CanvasPreview;
