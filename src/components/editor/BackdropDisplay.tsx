import { ColorPickerPanel, Select } from "tdesign-react";

import { formatSelectOptions } from "@/libs/common/toolkit";
import useCanvasStore from "@/stores/canvasStore";

import { OptionCard } from "../base";

const BackdropDisplay: React.FC = () => {
  const { backdrop, setBackdrop } = useCanvasStore();

  return (
    <>
      <div className="flex flex-col space-y-6">
        {/* 画布比例 */}
        <OptionCard title="Ratio">
          <Select
            style={{ width: "65%" }}
            value={backdrop.ratio}
            options={formatSelectOptions(["16:9", "9:16", "1:1"])}
          />
        </OptionCard>

        {/* 背景颜色 */}
        <OptionCard
          vertical
          title="Color"
        >
          <ColorPickerPanel
            format="HEX"
            colorModes={["monochrome"]}
            recentColors={null}
            swatchColors={null}
            value={backdrop.color}
            style={{ width: "100%" }}
            onChange={(color) =>
              setBackdrop({
                color: color
              })
            }
          />
        </OptionCard>
      </div>
    </>
  );
};

export default BackdropDisplay;
