import { useEffect, useState } from "react";
import { Slider } from "tdesign-react";

import { useAudioVisualization } from "@/hooks";
import { useAudioStore } from "@/stores";

const AudioControls: React.FC = () => {
  const { audioFile } = useAudioStore();
  const { audioRef } = useAudioVisualization();

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
      {/* 音频 */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMeta}
      />

      <div
        className="w-screen h-15 absolute bottom-0 bg-[#42b093] border-t-2 border-emerald-800 flex items-center justify-between px-6 z-50"
        dark="bg-dark-500 border-dark-100"
        max-lg="h-10"
      >
        {/* 播放按钮 */}
        <button
          disabled={!audioFile}
          onClick={togglePlay}
          className="w-12 aspect-square rounded-full bg-emerald-700 border border-emerald-800 flex-center"
          dark="bg-emerald-300"
        >
          <div
            className={`w-5 h-5 bg-white ${!audioFile || audioRef.current?.paused ? "i-solar:play-bold" : "i-solar:pause-bold"}`}
            max-lg="w-3 h-3"
          ></div>
        </button>

        {/* 音量控制 */}
        <button
          disabled={!audioRef.current}
          className={`ml-4 ${audioFile ? "group text-white" : "text-dark-50"}`}
        >
          <div
            className={`text-2xl ${volume === 0 || !audioFile ? "i-lsicon:volume-mute-outline" : "i-lsicon:volume-outline"}`}
            max-lg="text-lg"
          ></div>
          <div
            className="h-40 absolute bottom-14 -ml-3 w-12 pt-5 rounded-md flex-center flex-col opacity-0 group-hover:opacity-100 bg-[#42b093] border-2 border-emerald-800"
            dark="bg-dark-500 border-dark-100"
          >
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
          <span
            className="text-white text-sm mx-4 whitespace-nowrap"
            max-lg="text-xs"
          >
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
