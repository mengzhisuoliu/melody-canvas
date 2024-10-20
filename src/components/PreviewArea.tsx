import { Canvas, FabricObject } from "fabric";
import { useEffect, useRef } from "react";

import { FABRIC_CONFIG } from "@/libs/config";
import useCanvasStore from "@/stores/canvasStore";

interface PreviewAreaProps {}

const PreviewArea: React.FC<PreviewAreaProps> = () => {
  const { createFabric, disposeFabric } = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasEl = canvasRef.current;
    const instance = new Canvas(canvasEl, {
      width: canvasEl.parentElement!.clientWidth,
      height: canvasEl.parentElement!.clientHeight
    });
    
    Object.assign(FabricObject.ownDefaults, FABRIC_CONFIG);

    createFabric(instance);

    return () => {
      disposeFabric();
    };
  }, []);

  return (
    <div className="w-[70vw] h-[calc(70vw*9/16)] bg-dark-800 absolute transform translate-y-[-50%] top-[calc(50%-16px)] right-7">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default PreviewArea;
