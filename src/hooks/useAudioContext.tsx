import { useEffect, useRef } from "react";

type AudioEventListeners = {
  onPlay?: () => void;
  onPause?: () => void;
};

const useAudioContext = (audioRef: React.RefObject<HTMLAudioElement>) => {
  // 避免同一个 audio 被尝试绑定到多个不同节点而报错
  const audioContextRef = useRef<AudioContext | null>(null);
  // 绑定外部的音频事件处理
  const audioListenersRef = useRef<AudioEventListeners>({});

  const handleInit = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  };

  const handlePlay = () => {
    audioListenersRef.current.onPlay?.();
  };

  const handlePause = () => {
    audioListenersRef.current.onPause?.();
  };

  useEffect(() => {
    if (!audioRef.current) return;

    handleInit();

    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);

    return () => {
      audioRef.current?.removeEventListener("play", handlePlay);
      audioRef.current?.removeEventListener("pause", handlePause);
    };
  }, []);

  return {
    audioContextRef,
    audioListenersRef
  };
};

export default useAudioContext;
