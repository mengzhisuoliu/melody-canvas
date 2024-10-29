import { FFT_SIZE } from "@/libs/config";
import { useEffect, useRef } from "react";

type AudioEventListeners = {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
};

const useAudioContext = (audioRef: React.RefObject<HTMLAudioElement>) => {
  // 避免同一个 audio 被尝试绑定到多个不同节点而报错
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // 绑定外部的音频事件处理
  const audioListenersRef = useRef<AudioEventListeners>({});

  const handleInit = () => {
    if (mediaSourceRef.current) return;

    try {
      const audioContext = new AudioContext();
      const analyserNode = audioContext.createAnalyser();
      /**
       * 高效离散傅里叶变换使用的样本数量 -> 采样率（分辨率）
       *「桶的数量」（频率 Bin）是「采样率」的一半，即 “奈奎斯特频率 (Nyquist frequency)”
       * 数值越大 -> 音频分析越精确 -> 消耗性能越大
       */
      analyserNode.fftSize = FFT_SIZE;

      const mediaSource = audioContext.createMediaElementSource(audioRef!.current!);
      mediaSource.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserNodeRef.current = analyserNode;
      mediaSourceRef.current = mediaSource;
    } catch (err) {
      console.error("Failed to initialize audio:", err);
    }
  };

  const handlePlay = () => {
    handleInit();
    audioListenersRef.current.onPlay?.();
  };

  const handlePause = () => {
    audioListenersRef.current.onPause?.();
  };

  const handleEnd = () => {
    audioListenersRef.current.onEnded?.();
    // todo: clean up resource
  };

  useEffect(() => {
    if (!audioRef.current) return;

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
    analyserNodeRef,
    audioListenersRef
  };
};

export default useAudioContext;
