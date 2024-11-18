import { AudioClip, Combinator, OffscreenSprite } from "@webav/av-cliper";

import { cloneCanvas, downloadFile } from "@/libs/common/toolkit";
import { getAudioBuffer } from "@/libs/media/audio";
import CanvasClip from "@/libs/media/clip";

import useAudioStore from "@/stores/audioStore";
import useCanvasStore from "@/stores/canvasStore";

/**
 * 顶部栏
 */
const TopNav: React.FC = () => {
  const { audioFile } = useAudioStore();
  const { canvasInstance } = useCanvasStore();

  const exportVideo = async () => {
    if (!canvasInstance || !audioFile) return;

    const canvasCopy = await cloneCanvas(canvasInstance);

    const combinator = new Combinator({
      width: canvasCopy.width,
      height: canvasCopy.height
    });

    // 画布
    const buffer = await getAudioBuffer(audioFile);
    const videoClip = new CanvasClip(canvasCopy, buffer);
    const videoSpr = new OffscreenSprite(videoClip);
    await combinator.addSprite(videoSpr, { main: true });

    // 音频
    const audioClip = new AudioClip(audioFile.stream());
    const audioSpr = new OffscreenSprite(audioClip);
    await combinator.addSprite(audioSpr);

    const blob = await new Response(combinator.output()).blob();
    downloadFile(blob, "output.mp4");
  };

  return (
    <>
      <div className="absolute top-5 right-8 z-10">
        <button
          onClick={exportVideo}
          className="w-46 flex-center px-2 py-1 bg-dark-800 hover:bg-dark-400 border-2 border-dark-50  rounded-md text-lg"
        >
          <div className="i-ri:folder-video-line mr-4 text-xl"></div>
          <span>Export Video</span>
        </button>
      </div>
    </>
  );
};

export default TopNav;
