import { Group } from "fabric";
import { useEffect, useMemo, useState } from "react";

import type { ColorObject, ColorPickerChangeTrigger } from "tdesign-react";
import { ColorPicker, Radio } from "tdesign-react";

import { pickWithDefaults } from "@/libs/common";
import { useCanvasStore } from "@/stores";

import { AudioSvgSelect, AudioUploader } from "../audio";
import { ActionButton, OptionCard } from "../base";
import { DEFAULT_VIZ_OPTIONS } from "./props";
import type { VizOptions } from "./types";

const AudioVisualizer: React.FC = () => {
  const { activeObjects, builderFactory } = useCanvasStore();

  const [vizName, setVizName] = useState<string>("");
  const [vizOptions, setVizOptions] = useState<VizOptions>(DEFAULT_VIZ_OPTIONS);

  const resetOptions = () => {
    setVizOptions(DEFAULT_VIZ_OPTIONS);
  };

  const activeViz = useMemo(() => {
    const obj = activeObjects[0];
    if (obj?.subType === "audio") {
      return obj as Group;
    } else {
      resetOptions();
      return null;
    }
  }, [activeObjects]);

  useEffect(() => {
    if (activeViz?.id) {
      setVizName(activeViz.id.split("-")[0]);
      const vizData = pickWithDefaults(activeViz, DEFAULT_VIZ_OPTIONS);
      setVizOptions(vizData);
    }
  }, [activeObjects]);

  const updateVizOptions = (options: Partial<VizOptions>) => {
    setVizOptions((prev) => {
      const updatedOptions = { ...prev, ...options };
      return updatedOptions;
    });
  };

  const updateType = (name: string) => {
    setVizName(name);
    if (activeViz) {
      builderFactory!.updateBuilderType(activeViz, name);
    }
  };

  const updateFill = (
    color: string,
    context: {
      color: ColorObject;
      trigger: ColorPickerChangeTrigger;
    }
  ) => {
    // to fix: context 有时候传入的参数结构有误
    const isGradient = context.color?.isGradient;
    updateVizOptions({ color: isGradient ? context.color.css : color });
    if (activeViz) {
      builderFactory!.updateBuilderColor(activeViz, color);
    }
  };

  const updateCount = (count: number) => {
    updateVizOptions({ count });
    if (activeViz) {
      builderFactory!.updateBuilderCount(activeViz, count);
    }
  };

  const handleAddViz = async () => {
    if (!builderFactory) return;
    const BuilderClass = await builderFactory.createBuilder(vizName);
    const builder = new BuilderClass(vizOptions.count, vizOptions.color);
    builderFactory.addBuilder(builder);
  };

  return (
    <>
      <AudioUploader />

      <div className="mb-6">
        <div className="flex-between font-bold text-emerald-600 dark:text-emerald-400 mb-4">
          <div>Element</div>
          <ActionButton
            activeObj={activeViz}
            disabled={false}
            onAdd={handleAddViz}
          />
        </div>

        <AudioSvgSelect
          name={vizName}
          onChange={(name) => updateType(name)}
        />
      </div>

      <div className="mb-6">
        <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">Options</div>

        <div className="space-y-6">
          {/* 颜色 */}
          <OptionCard title="Color">
            <ColorPicker
              key={activeViz?.toString()} // 不加 key 会莫名陷入死循环
              format="HEX"
              recentColors={null}
              swatchColors={null}
              value={vizOptions.color}
              onChange={(color, ctx) => updateFill(color, ctx)}
            />
          </OptionCard>

          {/* 数量 */}
          <OptionCard
            vertical
            title="Count"
          >
            <Radio.Group
              className="space-x-3"
              value={vizOptions.count}
              onChange={(val) => updateCount(val as number)}
            >
              {[8, 16, 32, 64, 128, 256].map((val) => (
                <div
                  className="flex-center flex-col space-y-1"
                  key={val}
                >
                  <Radio
                    value={val}
                    style={{ margin: 0 }}
                  ></Radio>
                  <span className="font-mono text-xs">{val}</span>
                </div>
              ))}
            </Radio.Group>
          </OptionCard>
        </div>
      </div>
    </>
  );
};

export default AudioVisualizer;
