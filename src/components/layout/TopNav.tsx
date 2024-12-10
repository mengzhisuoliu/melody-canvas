import { AudioClip, Combinator, OffscreenSprite } from "@webav/av-cliper";
import { Button, Tabs } from "tdesign-react";

import { downloadFile } from "@/libs/common/toolkit";
import { getAudioBuffer } from "@/libs/media/audio";
import { cloneCanvas } from "@/libs/media/canvas";
import CanvasClip from "@/libs/media/clip";

import useAudioStore from "@/stores/audioStore";
import useCanvasStore from "@/stores/canvasStore";

const { TabPanel } = Tabs;

/**
 * 顶部栏
 */
const TopNav: React.FC = () => {
  const { audioFile } = useAudioStore();
  const { canvasInstance, themeMode, setThemeMode } = useCanvasStore();

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
      <div className="absolute top-5 right-8 z-10 flex justify-end space-x-10">
        {/* 主题切换 */}
        <Tabs
          theme="card"
          className="rounded-sm h-8 w-16 flex-center border border-emerald-700 dark:border-dark-50"
          value={themeMode}
          onChange={(v) => setThemeMode(v as "light" | "dark")}
        >
          <TabPanel
            value="light"
            className="w-4 flex-center"
            label={<div className="i-material-symbols:sunny text-lg"></div>}
          ></TabPanel>
          <TabPanel
            value="dark"
            className="w-4 flex-center"
            label={<div className="i-material-symbols:nightlight text-lg"></div>}
          ></TabPanel>
        </Tabs>

        {/* 视频导出 */}
        <Button
          theme="primary"
          variant="outline"
          onClick={exportVideo}
        >
          <div className="flex-center text-lg font-bold">
            <div className="i-ri:folder-video-line mr-4"></div>
            <span>Export Video</span>
          </div>
        </Button>
      </div>
    </>
  );
};

export default TopNav;
