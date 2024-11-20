import { useEffect, useRef, useState } from "react";
import { Slider } from "tdesign-react";

import useAudioStore from "@/stores/audioStore";
import AudioVisualizer from "./AudioVisualizer";

const AudioControls: React.FC = () => {
  const { audioFile } = useAudioStore();

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

  const handleSeek = (time: number | number[]) => {
    if (audioRef.current && typeof time === "number") {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (volume: number | number[]) => {
    if (audioRef.current && typeof volume === "number") {
      audioRef.current.volume = volume;
      setVolume(volume);
    }
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
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMeta}
          />
          <AudioVisualizer audioRef={audioRef} />
        </>
      )}

      <div
        className="w-screen h-15 absolute bottom-0 bg-[#42b093] border-t-2 border-emerald-800 flex items-center justify-between px-6"
        dark="bg-dark-500 border-dark-50"
      >
        {/* 播放按钮 */}
        <button
          disabled={!audioRef.current}
          onClick={togglePlay}
          className="w-12 aspect-square rounded-full bg-emerald-700 border border-emerald-800 dark:bg-emerald-300 flex-center"
        >
          <div
            className={`w-5 h-5 bg-white ${!audioRef.current || audioRef.current.paused ? "i-solar:play-bold" : "i-solar:pause-bold"}`}
          ></div>
        </button>

        {/* 音量控制 */}
        <button
          disabled={!audioRef.current}
          className={`ml-4 ${audioRef.current ? "group text-white" : "text-dark-50"}`}
        >
          <div
            className={`text-2xl ${volume === 0 || !audioRef.current ? "i-lsicon:volume-mute-outline" : "i-lsicon:volume-outline"}`}
          ></div>
          <div className="h-40 absolute bottom-14 -ml-3 w-12 pt-5 rounded-md flex-center flex-col opacity-0 group-hover:opacity-100 bg-[#42b093] dark:bg-dark-500 border-2 border-emerald-800 dark:border-dark-50">
            <Slider
              layout="vertical"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              label={false}
              disabled={!audioRef.current}
            />
            <div className="text-xs mt-4 mb-2">{Math.round(volume * 100)}%</div>
          </div>
        </button>

        {/* 时间 */}
        <div className="flex items-center justify-between ml-1 mr-4">
          <span className="text-white text-sm mx-4 whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* 进度条 */}
        <Slider
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          label={false}
          disabled={!audioRef.current}
        />
      </div>
    </>
  );
};

export default AudioControls;
