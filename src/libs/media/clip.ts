import { IClip } from "@webav/av-cliper";

import { BuilderFactory } from "@/visualizers";
import { TEMP_CANVAS_KEY } from "../common";

export class CanvasClip implements IClip {
  ready: IClip["ready"];
  meta = {
    duration: 0,
    width: 0,
    height: 0
  };

  #builderFactory;
  #buffer;
  #canvas;

  constructor(builderFactory: BuilderFactory, buffer: AudioBuffer) {
    this.#builderFactory = builderFactory;
    this.#buffer = buffer;
    this.#canvas = builderFactory.getCanvas();

    this.meta = {
      duration: buffer.duration * 1e6, // 单位微秒
      width: this.#canvas.width,
      height: this.#canvas.height
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
    if (time > this.meta.duration) return { state: "done" };

    this.#builderFactory.drawAll(this.#buffer, time / 1e6);
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
    const tempCanvas = document.querySelectorAll(`canvas.${TEMP_CANVAS_KEY}`);
    tempCanvas.forEach((canvas) => {
      canvas.remove();
    });
  }
}
