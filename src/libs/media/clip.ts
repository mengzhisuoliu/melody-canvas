import { IClip } from "@webav/av-cliper";
import { Canvas, Group } from "fabric";

import { VISUAL_MAP } from "../visualizer";
import { FrequencyAnalyzer, extractSamples } from "./audio";

class CanvasClip implements IClip {
  ready: IClip["ready"];
  meta = {
    duration: 0,
    width: 0,
    height: 0
  };

  #canvas;
  #buffer;
  #analyzer;

  constructor(canvas: Canvas, buffer: AudioBuffer) {
    this.#canvas = canvas;
    this.#buffer = buffer;
    this.#analyzer = new FrequencyAnalyzer();

    this.meta = {
      duration: buffer.duration * 1e6, // 单位微秒
      width: canvas.width,
      height: canvas.height
    };
    this.ready = Promise.resolve(this.meta);
  }

  /**
   * 核心的绘制逻辑
   * 会自动递归 -> 传入当前瞬间渲染帧的时间数据
   * 最重要的是需要知道「某一时刻」应该绘制什么内容
   */
  async tick(time: number): Promise<{
    video?: VideoFrame;
    state: "success" | "done";
  }> {
    if (time > this.meta.duration) return { state: "done" }; // 结束条件 -> 避免无限循环

    const samples = extractSamples(this.#buffer, time / 1e6);
    const frequency = this.#analyzer.getFrequency(samples);

    (Object.keys(VISUAL_MAP) as Array<keyof typeof VISUAL_MAP>).forEach((key) => {
      const group = this.#canvas.getObjects().find((obj) => obj.type === "group" && obj.id === key) as
        | Group
        | undefined;

      if (group) {
        VISUAL_MAP[key].draw(frequency, group);
      }
    });

    this.#canvas.renderAll();

    return {
      state: "success",
      video: new VideoFrame(this.#canvas.lowerCanvasEl, {
        timestamp: time
      })
    };
  }

  clone() {
    return Promise.resolve(this);
  }

  destroy() {
    const tempCanvas = document.querySelectorAll("canvas.temp_canvas");
    tempCanvas.forEach((canvas) => {
      canvas.remove();
    });
  }
}

export default CanvasClip;
