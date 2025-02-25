import { useState } from "react";
import { ColorPickerPanel, Select } from "tdesign-react";

import { DEFAULT_BACKGROUND_COLOR } from "@/libs/common/config";
import { formatSelectOptions } from "@/libs/common/toolkit";

import useCanvasStore from "@/stores/canvasStore";

import { OptionCard } from "../base";

/**
 * 画布背景
 */
const BackdropDisplay: React.FC = () => {
  const { canvasInstance, ratio, setRatio } = useCanvasStore();
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND_COLOR);

  const updateBackground = (color: string) => {
    setBackgroundColor(color);

    /*
      TDesign 疑似把整个函数缓存了
      如果不给 ColorPicker 加 key
      这里的 canvasInstance 一直是 null
     */
    if (!canvasInstance) return;
    canvasInstance.backgroundColor = color;
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
            colorModes={["monochrome"]}
            recentColors={null}
            swatchColors={null}
            value={backgroundColor}
            onChange={(color) => updateBackground(color)}
          />
        </OptionCard>
      </div>
    </>
  );
};

export default BackdropDisplay;
