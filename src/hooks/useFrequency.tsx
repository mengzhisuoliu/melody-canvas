import FFT from "fft.js";
import { useRef } from "react";

import { FFT_SIZE } from "@/libs/config";

// 平滑常数
const SMOOTH_UP = 0.2; // 越大 -> 上升更迅速
const SMOOTH_DOWN = 0.05; // 越小 -> 降落更迅速

const normalize = (y: number[]) => {
  // 平移所有值，确保没有负值
  const shiftedY = y.map((v) => v + 20);

  const minVal = Math.min(...shiftedY);
  const maxVal = Math.max(...shiftedY);

  // 归一化 -> [0, 1]
  const normalizedY = shiftedY.map((v) => (v - minVal) / (maxVal - minVal));

  // 映射 -> [0, 255]
  return normalizedY.map((v) => Math.min(255, Math.max(0, v * 255)));
};

const useFrequency = () => {
  const lastYRef = useRef<number[] | null>(null);

  const getFrequency = (samples: Float32Array) => {
    // 傅里叶变换
    const fft = new FFT(FFT_SIZE);
    const out = fft.createComplexArray();
    fft.realTransform(out, samples);

    const frequency = Array.from({ length: FFT_SIZE / 2 + 1 }, (_, i) => {
      const real = out[2 * i];
      const imag = out[2 * i + 1];
      const magnitude = Math.sqrt(real * real + imag * imag); // 复数 -> 幅度

      // 模拟人耳的感知
      const logMag = 20 * Math.log10(magnitude); // 分贝 -> [-20, 60]
      return isFinite(logMag) ? logMag : 0;
    });

    // 平滑处理
    if (lastYRef.current) {
      for (let i = 0; i < lastYRef.current.length; i++) {
        if (frequency[i] < lastYRef.current[i]) {
          lastYRef.current[i] = frequency[i] * SMOOTH_DOWN + lastYRef.current[i] * (1 - SMOOTH_DOWN);
        } else {
          lastYRef.current[i] = frequency[i] * SMOOTH_UP + lastYRef.current[i] * (1 - SMOOTH_UP);
        }
      }
    } else {
      lastYRef.current = frequency; // 初始化
    }
    return normalize(lastYRef.current);
  };

  return { getFrequency };
};

export default useFrequency;
