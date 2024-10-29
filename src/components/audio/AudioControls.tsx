import { useEffect, useRef, useState } from "react";

import useMediaStore from "@/stores/mediaStore";
import AudioVisualizer from "./AudioVisualizer";

const AudioControls: React.FC = () => {
  const { audioFile } = useMediaStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.1);

  useEffect(() => {
    if (audioFile && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioFile);
      audioRef.current.src = audioUrl;
      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [audioFile]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMeta = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const newVolume = Number(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    // audio 元素获取的默认时间单位是秒
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {/* 音频操作 */}
      {audioFile && (
        <>
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMeta} />
          <AudioVisualizer audioRef={audioRef} />
        </>
      )}

      <div className="bg-dark-300 w-screen h-16 absolute bottom-0 flex items-center justify-between px-6">
        {/* 播放按钮 */}
        <button
          onClick={togglePlay}
          className={`w-12 aspect-square rounded-full bg-emerald-300 flex-center ${!audioRef.current ? "cursor-not-allowed" : ""}`}
        >
          <div
            w="5"
            h="5"
            className={`${!audioRef.current || audioRef.current.paused ? "i-solar:play-bold" : "i-solar:pause-bold"}`}
          ></div>
        </button>

        {/* 音量控制 */}
        <button className={`ml-6 ${audioRef.current ? "group" : "pointer-events-none text-dark-50"}`}>
          <div className="i-lsicon:volume-outline text-2xl"></div>
          <div className="absolute bottom-14 -ml-3 opacity-0 group-hover:opacity-100 bg-dark-300 border-2 border-dark-50 w-12 p-2 rounded-md flex flex-col">
            <input
              type="range"
              min="0.01" // 避免完全静音 -> 无法获取实时音频数据
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="h-24 transform scale-y-[-1]"
              style={{ writingMode: "vertical-lr" }}
            />
            <div text="xs" m="t-1">
              {Math.round(volume * 100)}%
            </div>
          </div>
        </button>

        {/* 时间 */}
        <div className="flex items-center justify-between mx-4">
          <span className="text-white text-sm mx-4 whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* 进度条 */}
        <input
          type="range"
          className={`w-full mr-6`}
          step="0.1"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
      </div>
    </>
  );
};

export default AudioControls;
