import FFT from "fft.js";
import { FFT_SIZE, STANDARD_LIMIT } from "../common/constant";

const SCALE_FACTOR = 20; // 信号幅度进行对数转换时的常用系数
const SMOOTH_UP = 0.2; // 越大 -> 上升更迅速
const SMOOTH_DOWN = 0.05; // 越小 -> 降落更迅速

export class FrequencyAnalyzer {
  private lastY: number[] | null = null;

  private normalize = (y: number[]) => {
    const shiftedY = y.map((v) => v + SCALE_FACTOR); // 先统一转为正数

    const minVal = Math.min(...shiftedY);
    const maxVal = Math.max(...shiftedY);

    const range = STANDARD_LIMIT / (maxVal - minVal); // 再放大到一定范围，方便可视化
    return shiftedY.map((v) => Math.min(STANDARD_LIMIT, Math.max(0, (v - minVal) * range)));
  };

  public getFrequency(samples: Float32Array) {
    // 傅里叶变换
    const fft = new FFT(FFT_SIZE);
    const out = fft.createComplexArray();
    fft.realTransform(out, samples);

    // 复数 -> 频谱
    const frequency = Array.from({ length: FFT_SIZE / 2 + 1 }, (_, i) => {
      const real = out[2 * i];
      const imag = out[2 * i + 1];
      const magnitude = Math.sqrt(real * real + imag * imag);

      const logMag = SCALE_FACTOR * Math.log10(magnitude);
      return isFinite(logMag) ? logMag : 0;
    });

    // 平滑处理
    if (this.lastY) {
      for (let i = 0; i < this.lastY.length; i++) {
        if (frequency[i] < this.lastY[i]) {
          this.lastY[i] = frequency[i] * SMOOTH_DOWN + this.lastY[i] * (1 - SMOOTH_DOWN);
        } else {
          this.lastY[i] = frequency[i] * SMOOTH_UP + this.lastY[i] * (1 - SMOOTH_UP);
        }
      }
    } else {
      this.lastY = frequency; // 初始化
    }

    // 归一化
    return this.normalize(this.lastY);
  }

  public reset() {
    this.lastY = null;
  }
}

export const getAudioBuffer = async (audio: File) => {
  const audioContext = new AudioContext();
  const buffer = await audio.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(buffer);
  return audioBuffer;
};

export const extractSamples = (buffer: AudioBuffer, time: number) => {
  const allSamples = buffer.getChannelData(0);

  const percentage = time / buffer.duration;
  const startIdx = Math.floor(allSamples.length * percentage);
  const endIdx = startIdx + FFT_SIZE;

  let samples = allSamples.slice(startIdx, endIdx);
  const delta = samples.length - FFT_SIZE;
  if (delta < 0) {
    samples = new Float32Array(FFT_SIZE).fill(0);
  }

  return samples;
};
