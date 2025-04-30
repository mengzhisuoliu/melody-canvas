import type { ColorObject, ColorPickerChangeTrigger } from "tdesign-react";
import { ColorPickerPanel, Select } from "tdesign-react";

import { useCanvasStore } from "@/stores";

import { GRADIENT_PRESET, createGradient } from "@/libs/canvas";
import { DEFAULT_BACKGROUND_COLOR, INPUT_STYLE } from "@/libs/common";

import { OptionCard } from "@/components/base";

/**
 * 画布背景
 */
const BackdropDisplay: React.FC = () => {
  const { canvasInstance, ratio, setRatio } = useCanvasStore();

  const updateBackground = (
    color: string,
    context: {
      color: ColorObject;
      trigger: ColorPickerChangeTrigger;
    }
  ) => {
    if (!canvasInstance) return;

    if (!context.color.isGradient) {
      canvasInstance.backgroundColor = color;
    } else {
      const cssGradient = context.color.css;
      canvasInstance.backgroundColor = createGradient(cssGradient, canvasInstance.width, canvasInstance.height);
    }

    canvasInstance.renderAll();
  };

  return (
    <>
      <div className="space-y-6">
        {/* 画布比例 */}
        <OptionCard title="Ratio">
          <Select
            style={INPUT_STYLE}
            options={["16:9", "9:16", "1:1"].map((item) => ({ label: item, value: item }))}
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
            format="CSS"
            recentColors={null}
            swatchColors={GRADIENT_PRESET}
            defaultValue={DEFAULT_BACKGROUND_COLOR}
            onChange={updateBackground}
          />
        </OptionCard>
      </div>
    </>
  );
};

export default BackdropDisplay;
