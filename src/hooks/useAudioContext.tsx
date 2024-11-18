import { useEffect, useRef } from "react";
import { FrequencyAnalyzer } from "@/libs/media/audio";

type AudioEventListeners = {
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
};

const useAudioContext = (audioRef: React.RefObject<HTMLAudioElement>) => {
  // 避免同一个 audio 被绑定到多个不同节点
  const audioContextRef = useRef<AudioContext | null>(null);
  // 绑定外部的音频事件处理
  const audioListenersRef = useRef<AudioEventListeners>({});
  // 自定义算法的频率处理器
  const analyzerRef = useRef<FrequencyAnalyzer | null>(null);

  const handleInit = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyzerRef.current = new FrequencyAnalyzer();
    }
  };

  const handlePlay = () => {
    audioListenersRef.current.onPlay?.();
  };

  const handlePause = () => {
    audioListenersRef.current.onPause?.();
  };

  const handleEnd = () => {
    audioListenersRef.current.onEnd?.();
    analyzerRef.current?.reset();
  };

  useEffect(() => {
    if (!audioRef.current) return;

    handleInit();

    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("ended", handleEnd);

    return () => {
      audioRef.current?.removeEventListener("play", handlePlay);
      audioRef.current?.removeEventListener("pause", handlePause);
      audioRef.current?.removeEventListener("ended", handleEnd);
    };
  }, []);

  return {
    audioContextRef,
    analyzerRef,
    audioListenersRef
  };
};

export default useAudioContext;
