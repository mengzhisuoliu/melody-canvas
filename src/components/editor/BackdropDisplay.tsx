import { useState } from "react";

import type { ColorObject, ColorPickerChangeTrigger } from "tdesign-react";
import { ColorPickerPanel, Select } from "tdesign-react";

import { useCanvasStore } from "@/stores";

import { createGradientFromCss } from "@/libs/canvas";
import { DEFAULT_BACKGROUND_COLOR, formatSelectOptions } from "@/libs/common";

import { OptionCard } from "../base";

/**
 * 画布背景
 */
const BackdropDisplay: React.FC = () => {
  const { canvasInstance, ratio, setRatio } = useCanvasStore();
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND_COLOR);

  const updateBackground = (
    color: string,
    context: {
      color: ColorObject;
      trigger: ColorPickerChangeTrigger;
    }
  ) => {
    /*
      TDesign 疑似把整个函数缓存了
      如果不给 ColorPicker 加 key
      这里的 canvasInstance 一直是 null
     */
    if (!canvasInstance) return;
    setBackgroundColor(color);

    if (!context.color.isGradient) {
      canvasInstance.backgroundColor = color;
    } else {
      const cssGradient = context.color.css;
      canvasInstance.backgroundColor = createGradientFromCss(cssGradient, canvasInstance.width, canvasInstance.height);
      // todo: 渐变值持久保存
    }

    canvasInstance.renderAll();
  };

  return (
    <>
      <div className="space-y-6">
        {/* 画布比例 */}
        <OptionCard title="Ratio">
          <Select
            style={{ width: "65%" }}
            options={formatSelectOptions(["16:9", "9:16", "1:1"])}
            value={ratio}
            onChange={(ratio) => setRatio(ratio as string)}
          />
        </OptionCard>

        {/* 背景颜色 */}
        <OptionCard
          vertical
          title="Color"
        >
          <ColorPickerPanel
            style={{ width: "100%" }}
            key={canvasInstance?.toString()}
            format="HEX"
            recentColors={null}
            swatchColors={null} // 预设颜色
            value={backgroundColor}
            onChange={(color, ctx) => updateBackground(color, ctx)}
          />
        </OptionCard>
      </div>
    </>
  );
};

export default BackdropDisplay;
