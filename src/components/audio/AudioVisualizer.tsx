import { Group } from "fabric";
import { useCallback, useEffect, useRef } from "react";

import useAudioContext from "@/hooks/useAudioContext";
import { VISUAL_MAP } from "@/libs/visualizer";
import useCanvasStore from "@/stores/canvasStore";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioRef }) => {
  const { canvasInstance } = useCanvasStore();
  const { analyserNodeRef, audioListenersRef } = useAudioContext(audioRef);

  // 用于音频暂停时能显示上一帧数据
  const lastFrameDataRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);

  const drawAll = useCallback(() => {
    const analyser = analyserNodeRef.current;
    if (!analyser || !canvasInstance) return;

    lastFrameDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(lastFrameDataRef.current);

    (Object.keys(VISUAL_MAP) as Array<keyof typeof VISUAL_MAP>).forEach((key) => {
      const group = canvasInstance.getObjects().find((obj) => obj.type === "group" && obj.id === key) as
        | Group
        | undefined;

      if (group) {
        VISUAL_MAP[key].draw(analyser, group);
      }
    });

    canvasInstance.requestRenderAll();
  }, [canvasInstance]);

  useEffect(() => {
    const handlePlay = () => {
      drawAll();
      animationRef.current = requestAnimationFrame(handlePlay);
    };

    const handlePause = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleEnd = () => {
      // todo: reset shape
    };

    audioListenersRef.current = {
      onPlay: handlePlay,
      onPause: handlePause,
      onEnded: handleEnd
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef]);

  return null;
};

export default AudioVisualizer;
