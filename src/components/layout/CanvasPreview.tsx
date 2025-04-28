import { Canvas, FabricObject } from "fabric";
import { useEffect, useRef, useState } from "react";

import { useMediaBreakpoint } from "@/hooks";
import { useCanvasStore } from "@/stores";

import { DEFAULT_BACKGROUND_COLOR, THEME_COLOR } from "@/libs/common";

import RightClickMenu from "./RightClickMenu";

/**
 * 视频预览区域
 */
const CanvasPreview: React.FC = () => {
  const isMobileOrTablet = useMediaBreakpoint("max-lg");
  const { createCanvas, disposeCanvas, canvasInstance, ratio } = useCanvasStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasRatio, setCanvasRatio] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const instance = new Canvas(canvasRef.current, {
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
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
    const updateDimensions = () => {
      if (!canvasInstance?.lowerCanvasEl) return;

      const [width, height] = ratio.split(":").map(Number);
      setCanvasRatio({ width, height });

      let canvasWidth = containerRef.current!.clientWidth;
      let canvasHeight = containerRef.current!.clientHeight;

      // 视频编码器要求：H264 only supports even sized frames
      canvasWidth = canvasWidth % 2 === 0 ? canvasWidth : canvasWidth + 1;
      canvasHeight = canvasHeight % 2 === 0 ? canvasHeight : canvasHeight + 1;

      const scaleX = canvasWidth / canvasInstance.width;
      const scaleY = canvasHeight / canvasInstance.height;

      canvasInstance.setDimensions({
        width: canvasWidth,
        height: canvasHeight
      });

      // 同步缩放所有对象
      canvasInstance.getObjects().forEach((obj) => {
        obj.scaleX *= scaleX;
        obj.scaleY *= scaleY;
        obj.setCoords();
      });

      canvasInstance.renderAll();
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current!);
    return () => {
      observer.disconnect();
    };
  }, [canvasInstance, ratio]);

  useEffect(() => {
    const calcCanvasPosition = () => {
      const baseSize = isMobileOrTablet ? "65vw" : "60vh";

      const width = isMobileOrTablet ? baseSize : `calc(${baseSize} * ${canvasRatio.width} / ${canvasRatio.height})`;
      const height = isMobileOrTablet ? `calc(${baseSize} * ${canvasRatio.height} / ${canvasRatio.width})` : baseSize;
      const top = "calc(50%)";

      // 居中在剩余区域
      const adjustedLeft = (navWidth: number) => {
        return `calc(((${window.innerWidth}px - ${navWidth}px) / 2) + ${navWidth}px)`;
      };

      const sideNavWidth = document.getElementById("side-nav")?.clientWidth || 72;
      const navPanelWidth = document.getElementById("nav-audio")?.clientWidth || 256;

      const PC_NAV_WIDTH = sideNavWidth + navPanelWidth + 20;
      const MOBILE_NAV_WIDTH = sideNavWidth + 5;

      const left = adjustedLeft(isMobileOrTablet ? MOBILE_NAV_WIDTH : PC_NAV_WIDTH);

      Object.entries({ width, height, top, left }).forEach(([key, value]) => {
        containerRef.current?.style.setProperty(key, value);
      });
    };

    calcCanvasPosition();

    window.addEventListener("resize", calcCanvasPosition);
    const observer = new ResizeObserver(calcCanvasPosition);
    observer.observe(containerRef.current!);

    return () => {
      window.removeEventListener("resize", calcCanvasPosition);
      observer.disconnect();
    };
  }, [isMobileOrTablet, canvasRatio]);

  return (
    <div
      ref={containerRef}
      className="absolute border-3 border-emerald-500 flex-center transform translate-x-[-50%] translate-y-[-50%]"
      dark="border-dark-50"
    >
      <canvas ref={canvasRef}></canvas>
      <RightClickMenu />
    </div>
  );
};

export default CanvasPreview;
