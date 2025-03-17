import FFT from "fft.js";

import { normalize } from "@/libs/common";
import { applyShaper } from "./FrequencyShaper";

class FrequencyAnalyzer {
  private fft;
  private frequency: number[] = [];

  constructor(fftSize: number) {
    this.fft = new FFT(fftSize);
  }

  private extractSamples = (buffer: AudioBuffer, time: number) => {
    const allSamples = buffer.getChannelData(0);
    const percentage = time / buffer.duration;
    const startIndex = Math.floor(allSamples.length * percentage);
    const endIndex = startIndex + this.fft.size;

    let samples = allSamples.slice(startIndex, endIndex);
    const delta = samples.length - this.fft.size;
    if (delta < 0) {
      samples = new Float32Array(this.fft.size).fill(0);
    }

    return samples;
  };

  private computeFrequency(samples: Float32Array) {
    // Hann 窗 -> 避免频谱泄露
    for (let i = 0; i < samples.length; i++) {
      samples[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (samples.length - 1)));
    }

    // 傅里叶变换 -> 时域转频域
    const complexSamples = this.fft.createComplexArray();
    this.fft.realTransform(complexSamples, samples);

    return Array.from({ length: this.fft.size / 2 + 1 }, (_, i) => {
      const real = complexSamples[2 * i];
      const imag = complexSamples[2 * i + 1];
      const magnitude = Math.sqrt(real * real + imag * imag) / this.fft.size;

      const logMag = 20 * Math.log10(magnitude);
      return isFinite(logMag) ? logMag : 0;
    });
  }

  public getFrequency(buffer: AudioBuffer, time: number, shape: string) {
    const samples = this.extractSamples(buffer, time);
    const rawFreq = this.computeFrequency(samples);

    if (this.frequency.length !== rawFreq.length) {
      this.frequency = rawFreq;
    }

    const SMOOTH_UP = 0.2;
    const SMOOTH_DOWN = 0.05;

    // 平滑化 -> 避免激烈跳动
    for (let i = 0; i < rawFreq.length; i++) {
      if (rawFreq[i] < this.frequency[i]) {
        this.frequency[i] = rawFreq[i] * SMOOTH_DOWN + this.frequency[i] * (1 - SMOOTH_DOWN);
      } else {
        this.frequency[i] = rawFreq[i] * SMOOTH_UP + this.frequency[i] * (1 - SMOOTH_UP);
      }
    }

    // 可选的波形转换算法
    const shapedFreq = applyShaper(shape, this.frequency);

    // 归一化
    return normalize(shapedFreq, 0, 255);
  }

  public updateFFTSize(fftSize: number) {
    this.fft = new FFT(fftSize);
    this.frequency = [];
  }
}

export default FrequencyAnalyzer;
