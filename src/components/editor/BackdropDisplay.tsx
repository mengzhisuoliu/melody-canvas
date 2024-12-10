import { ColorPickerPanel, Select } from "tdesign-react";

import { formatSelectOptions } from "@/libs/common/toolkit";
import useCanvasStore from "@/stores/canvasStore";

const BackdropDisplay: React.FC = () => {
  const { backdrop, setBackdrop } = useCanvasStore();

  return (
    <>
      <div className="flex flex-col space-y-8">
        {/* 画布比例 */}
        <div className="card flex items-center">
          <span className="card-title mr-4">Ratio</span>
          <Select
            style={{ width: "65%" }}
            value={backdrop.ratio}
            options={formatSelectOptions(["16:9", "9:16", "1:1"])}
          />
        </div>

        {/* 背景颜色 */}
        <div className="card">
          <div className="card-title mb-2">Color</div>
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
        </div>
      </div>
    </>
  );
};

export default BackdropDisplay;
