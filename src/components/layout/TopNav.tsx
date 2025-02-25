import { AudioClip, Combinator, Log, OffscreenSprite } from "@webav/av-cliper";
import { Canvas } from "fabric";
import { Button, Tabs } from "tdesign-react";

import { useAudioStore, useCanvasStore, useSettingStore } from "@/stores";

import { downloadFile } from "@/libs/common/toolkit";
import { getAudioBuffer } from "@/libs/media/audio";
import CanvasClip from "@/libs/media/clip";

const { TabPanel } = Tabs;
Log.setLogLevel(Log.warn); // 隐藏默认 info 日志

/**
 * 顶部栏
 */
const TopNav: React.FC = () => {
  const { audioFile } = useAudioStore();
  const { canvasInstance, builderFactory } = useCanvasStore();
  const { themeMode, setThemeMode } = useSettingStore();

  const exportVideo = async () => {
    if (!canvasInstance || !builderFactory || !audioFile) return;
    canvasInstance.discardActiveObject();

    // 克隆 -> 不影响当前画布
    const lowerCanvas = document.createElement("canvas");
    const newCanvas = new Canvas(lowerCanvas, {
      width: canvasInstance.width,
      height: canvasInstance.height,
      backgroundColor: canvasInstance.backgroundColor
    });
    const factoryCopy = await builderFactory.clone(newCanvas);

    // 临时画布 -> 隐藏绘制
    lowerCanvas.classList.add("temp_canvas");
    lowerCanvas.style.display = "none";

    const upperCanvas = factoryCopy.getCanvas().upperCanvasEl;
    upperCanvas.classList.add("temp_canvas");
    upperCanvas.style.display = "none";

    document.body.appendChild(lowerCanvas);
    document.body.appendChild(upperCanvas);

    // 视频合成器
    const combinator = new Combinator({
      width: canvasInstance.width,
      height: canvasInstance.height
    });

    // 添加画布
    const buffer = await getAudioBuffer(audioFile);
    const videoClip = new CanvasClip(factoryCopy, buffer);
    const videoSpr = new OffscreenSprite(videoClip);
    await combinator.addSprite(videoSpr, { main: true });

    // 添加音频
    const audioClip = new AudioClip(audioFile.stream());
    const audioSpr = new OffscreenSprite(audioClip);
    await combinator.addSprite(audioSpr);

    // 下载
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
          onChange={(mode) => setThemeMode(mode as "light" | "dark")}
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
          disabled={!audioFile}
        >
          <div className="flex-center font-bold">
            <div className="i-ri:folder-video-line mr-4"></div>
            <span>Export Video</span>
          </div>
        </Button>
      </div>
    </>
  );
};

export default TopNav;
