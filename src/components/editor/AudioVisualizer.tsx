import { Group } from "fabric";
import { useMemo } from "react";
import { ColorPicker, Slider } from "tdesign-react";

import useCanvasStore from "@/stores/canvasStore";

import { AudioSelector } from "../audio";
import { OptionCard } from "../base";

const AudioVisualizer: React.FC = () => {
  const { activeObjects } = useCanvasStore();

  const resetOptions = () => {};

  const activeViz = useMemo(() => {
    const obj = activeObjects[0];
    if (obj?.subType?.category === "audio") {
      return obj as Group;
    } else {
      resetOptions();
      return null;
    }
  }, [activeObjects]);

  // 音频上传 + 可视化元素选项列表
  if (!activeViz) return <AudioSelector />;

  // 可视化样式调整
  return (
    <>
      <div className="flex flex-col space-y-8">
        {/* 颜色 */}
        <OptionCard title="Color">
          <ColorPicker
            format="HEX"
            colorModes={["monochrome"]}
            recentColors={null}
            swatchColors={null}
          />
        </OptionCard>

        {/* 数量 */}
        <OptionCard
          vertical
          title="Bar Count"
        >
          <Slider style={{ padding: "5px 8px" }} />
        </OptionCard>

        {/* 宽度 */}
        <OptionCard
          vertical
          title="Bar Width"
        >
          <Slider style={{ padding: "5px 8px" }} />
        </OptionCard>
      </div>
    </>
  );
};

export default AudioVisualizer;
