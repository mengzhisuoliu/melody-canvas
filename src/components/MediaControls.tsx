import { useEffect, useRef, useState } from "react";

import PreviewArea from "@/components/PreviewArea";
import useMediaStore from "@/stores/mediaStore";

const MediaControls: React.FC = () => {
  const { audioMeta, audioPlaying, setAudioPlaying } = useMediaStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.1);
  const [previousVolume, setPreviousVolume] = useState(volume);

  useEffect(() => {
    setAudioPlaying(false);
  }, [audioMeta?.url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setAudioPlaying(!audioPlaying);
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

  const handleVolumeMute = () => {
    if (!audioRef.current) return;

    if (audioRef.current.volume === 0) {
      // 恢复静音前的音量
      audioRef.current.volume = previousVolume;
      setVolume(previousVolume);
    } else {
      setPreviousVolume(audioRef.current.volume);
      audioRef.current.volume = 0;
      setVolume(0);
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
      {audioMeta?.url && (
        <audio
          ref={audioRef}
          src={audioMeta.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMeta}
          onEnded={() => setAudioPlaying(false)}
        />
      )}

      {/* 播放器 */}
      <div className="bg-dark-300 w-screen h-16 absolute bottom-0 flex items-center justify-between px-6">
        {/* 播放按钮 */}
        <button onClick={togglePlay} className="w-12 aspect-square rounded-full bg-emerald-300 flex-center">
          <div className={`w-5 h-5 ${audioPlaying ? "i-solar:pause-bold" : "i-solar:play-bold"}`}></div>
        </button>

        {/* 音量控制 */}
        <button className={`ml-6 ${audioRef.current ? "group" : "pointer-events-none text-dark-50"}`}>
          <div
            onClick={handleVolumeMute}
            className={`${volume === 0 ? "i-lsicon:volume-mute-outline" : "i-lsicon:volume-outline"} text-2xl`}
          ></div>
          <div className="absolute bottom-14 -ml-3 opacity-0 group-hover:opacity-100 bg-dark-300 border-2 border-dark-50 w-12 p-2 rounded-md flex flex-col">
            <input
              type="range"
              min="0"
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
          className="w-full mr-6"
          step="0.1"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
      </div>

      {/* 视频预览 */}
      <PreviewArea/>
    </>
  );
};

export default MediaControls;
