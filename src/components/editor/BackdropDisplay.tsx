import { useState } from "react";
import { ColorPickerPanel, SelectInput } from "tdesign-react";

import useCanvasStore from "@/stores/canvasStore";

const BackdropDisplay: React.FC = () => {
  const { backdrop, setBackdrop } = useCanvasStore();
  const [popupVisible, setPopupVisible] = useState(false);

  const ratioOptions = ["16:9", "9:16", "1:1"]
    .filter((item) => item !== backdrop.ratio)
    .map((item) => ({ content: item }));

  return (
    <>
      <div className="flex flex-col space-y-8">
        {/* 画布比例 */}
        <div className="card">
          <span className="card-title mr-4">Ratio</span>
          <SelectInput
            suffix={<div className="i-gridicons:chevron-down"></div>}
            popupVisible={popupVisible}
            onPopupVisibleChange={(val) => setPopupVisible(val)}
            style={{ width: "65%" }}
            value={backdrop.ratio}
            panel={
              <ul className="text-right text-base cursor-pointer">
                {ratioOptions.map((item) => (
                  <li
                    className="px-1 rounded-md hover:(bg-emerald-100 dark:bg-dark-100)"
                    key={item.content}
                    onClick={() => {
                      setBackdrop({
                        ratio: item.content
                      });
                      setPopupVisible(false);
                    }}
                  >
                    {item.content}
                  </li>
                ))}
              </ul>
            }
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
