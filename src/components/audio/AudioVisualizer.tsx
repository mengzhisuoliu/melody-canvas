import { Group } from "fabric";
import { useEffect, useRef } from "react";

import useAudioContext from "@/hooks/useAudioContext";
import useFrequency from "@/hooks/useFrequency";

import { FFT_SIZE } from "@/libs/config";
import { VISUAL_MAP } from "@/libs/visualizer";

import useCanvasStore from "@/stores/canvasStore";
import useMediaStore from "@/stores/mediaStore";

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioRef }) => {
  const { canvasInstance } = useCanvasStore();
  const { audioFile } = useMediaStore();

  const { audioContextRef, audioListenersRef } = useAudioContext(audioRef);
  const { getFrequency } = useFrequency();

  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startOffsetRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const reqIDRef = useRef<number | null>(null);

  const extractSamples = () => {
    const allSamples = audioBufferRef.current!.getChannelData(0);

    // 时间切片
    const timeOffset = audioRef.current!.currentTime - startTimeRef.current + startOffsetRef.current;
    const duration = audioBufferRef.current!.duration;
    const percentage = (timeOffset % duration) / duration;

    const startIdx = Math.floor(allSamples.length * percentage);
    const endIdx = startIdx + FFT_SIZE;

    let samples = allSamples.slice(startIdx, endIdx);
    const delta = samples.length - FFT_SIZE;
    if (delta < 0) {
      samples = new Float32Array(FFT_SIZE).fill(0);
    }

    return samples;
  };

  const drawAll = () => {
    if (!canvasInstance) return;

    const samples = extractSamples();
    const frequency = getFrequency(samples);

    (Object.keys(VISUAL_MAP) as Array<keyof typeof VISUAL_MAP>).forEach((key) => {
      const group = canvasInstance.getObjects().find((obj) => obj.type === "group" && obj.id === key) as
        | Group
        | undefined;

      if (group) {
        VISUAL_MAP[key].draw(frequency, group);
      }
    });

    canvasInstance.requestRenderAll();
    reqIDRef.current = requestAnimationFrame(drawAll);
  };

  useEffect(() => {
    const initBuffer = async () => {
      if (!audioContextRef.current || !audioFile) return;

      // 通过原始的 file -> 避免 fetch audioRef.src 产生资源解析异常
      const buffer = await audioFile.arrayBuffer();
      audioBufferRef.current = await audioContextRef.current.decodeAudioData(buffer);
    };

    initBuffer();
  }, [audioFile]);

  useEffect(() => {
    const handlePlay = () => {
      startTimeRef.current = audioRef.current!.currentTime;
      drawAll();
    };

    const handlePause = () => {
      startOffsetRef.current += audioRef.current!.currentTime - startTimeRef.current;
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
  }, [audioRef]);

  return <></>;
};

export default AudioVisualizer;
