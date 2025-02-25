import { useEffect, useRef } from "react";

import useAudioContext from "@/hooks/useAudioContext";

import useAudioStore from "@/stores/audioStore";
import useCanvasStore from "@/stores/canvasStore";

const useAudioVisualization = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reqIDRef = useRef<number | null>(null);

  const { audioBuffer } = useAudioStore();
  const { canvasInstance, builderFactory } = useCanvasStore();
  const { audioListenersRef } = useAudioContext(audioRef);

  const drawAll = () => {
    builderFactory!.drawAll(audioBuffer!, audioRef.current!.currentTime);
    reqIDRef.current = requestAnimationFrame(drawAll);
  };

  useEffect(() => {
    if (!canvasInstance || !audioBuffer) return;

    const handlePlay = () => {
      drawAll();
    };

    const handlePause = () => {
      if (reqIDRef.current) {
        cancelAnimationFrame(reqIDRef.current);
      }
      reqIDRef.current = null;
    };

    audioListenersRef.current = {
      onPlay: handlePlay,
      onPause: handlePause
    };

    return () => {
      if (reqIDRef.current) {
        cancelAnimationFrame(reqIDRef.current);
      }
    };
  }, [canvasInstance, audioBuffer]);

  return { audioRef };
};

export default useAudioVisualization;
