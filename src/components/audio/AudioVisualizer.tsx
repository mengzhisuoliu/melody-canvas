import { Group } from "fabric";
import { useEffect, useRef } from "react";

import useAudioContext from "@/hooks/useAudioContext";

import { extractSamples, getAudioBuffer } from "@/libs/media/audio";
import { VISUAL_MAP } from "@/libs/visualizer";

import useAudioStore from "@/stores/audioStore";
import useCanvasStore from "@/stores/canvasStore";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioRef }) => {
  const { audioFile } = useAudioStore();
  const { canvasInstance } = useCanvasStore();

  const { audioContextRef, analyzerRef, audioListenersRef } = useAudioContext(audioRef);

  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const reqIDRef = useRef<number | null>(null);

  const drawAll = () => {
    if (!canvasInstance) return;

    const samples = extractSamples(audioBufferRef!.current!, audioRef.current!.currentTime);
    const frequency = analyzerRef!.current!.getFrequency(samples);

    const objects = canvasInstance.getObjects();
    (Object.keys(VISUAL_MAP) as Array<keyof typeof VISUAL_MAP>).forEach((key) => {
      const groups = objects.filter((obj) => obj.subType?.variant === key) as Group[];

      groups.forEach((group) => {
        VISUAL_MAP[key].draw(frequency, group);
      });
    });

    canvasInstance.requestRenderAll();
    reqIDRef.current = requestAnimationFrame(drawAll);
  };

  useEffect(() => {
    if (!audioContextRef.current || !audioFile) return;

    const handlePlay = () => {
      drawAll();
    };

    const handlePause = () => {
      if (reqIDRef.current) {
        cancelAnimationFrame(reqIDRef.current);
      }
      reqIDRef.current = null;
    };

    (async () => {
      // 通过原始的 file -> 避免 fetch audioRef.src 产生资源解析异常
      audioBufferRef.current = await getAudioBuffer(audioFile);
    })();

    audioListenersRef.current = {
      onPlay: handlePlay,
      onPause: handlePause
    };

    return () => {
      if (reqIDRef.current) {
        cancelAnimationFrame(reqIDRef.current);
      }
      analyzerRef.current?.reset();
    };
  }, [audioRef, audioFile]);

  return <></>;
};

export default AudioVisualizer;
