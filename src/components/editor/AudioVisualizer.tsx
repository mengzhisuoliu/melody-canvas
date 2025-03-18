import { Group } from "fabric";
import { useEffect, useMemo, useState } from "react";

import type { ColorObject, ColorPickerChangeTrigger } from "tdesign-react";
import { ColorPicker, Radio, Select } from "tdesign-react";

import { INPUT_STYLE, pickWithDefaults } from "@/libs/common";
import { useCanvasStore } from "@/stores";
import { shaperMap } from "@/visualizers";

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

  const activeVizList = useMemo(() => {
    return activeObjects.filter((obj) => obj?.subType === "audio") as Group[];
  }, [activeObjects]);

  useEffect(() => {
    if (activeVizList.length > 0) {
      setVizName(activeVizList[0].id!.split("-")[0]);
      const vizData = pickWithDefaults(activeVizList[0], DEFAULT_VIZ_OPTIONS);
      setVizOptions(vizData);
    } else {
      resetOptions();
    }
  }, [activeVizList]);

  const updateVizOptions = (options: Partial<VizOptions>) => {
    setVizOptions((prev) => ({ ...prev, ...options }));
  };

  const updateName = (type: string) => {
    setVizName(type);
    activeVizList.forEach((viz) => {
      builderFactory!.updateBuilderType(viz, type);
    });
  };

  const updateColor = (
    color: string,
    context: {
      color: ColorObject;
      trigger: ColorPickerChangeTrigger;
    }
  ) => {
    // to fix: context 有时候传入的参数结构有误 -> context.color 为 undefined
    const isGradient = context.color?.isGradient;
    const appliedColor = isGradient ? context.color.css : color;

    updateVizOptions({ color: appliedColor });
    activeVizList.forEach((viz) => {
      builderFactory!.updateBuilderColor(viz, appliedColor);
    });
  };

  const updateShaper = (shaper: string) => {
    updateVizOptions({ shape: shaper });
    activeVizList.forEach((viz) => {
      builderFactory!.updateBuilderShape(viz, shaper);
    });
  };

  const updateCount = (count: number) => {
    updateVizOptions({ count });
    activeVizList.forEach((viz) => {
      builderFactory!.updateBuilderCount(viz, count);
    });
  };

  const handleAddViz = async () => {
    if (!builderFactory) return;
    const BuilderClass = await builderFactory.createBuilder(vizName);
    const { count, color, shape: shaper } = vizOptions;
    const builder = new BuilderClass(count, color, shaper);
    builderFactory.addBuilder(builder);
  };

  return (
    <>
      <AudioUploader />

      <div className="mb-6">
        <div className="flex-between font-bold text-emerald-600 dark:text-emerald-400 mb-4">
          <div>Element</div>
          <ActionButton onAdd={handleAddViz} />
        </div>

        <AudioSvgSelect
          name={vizName}
          disabled={activeObjects.length > 1}
          onChange={(name) => updateName(name)}
        />
      </div>

      <div className="mb-6">
        <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">Options</div>
        <div className="space-y-6">
          <OptionCard title="Color">
            <ColorPicker
              key={activeVizList.map((v) => v.id).join(",")}
              format="HEX"
              recentColors={null}
              swatchColors={null}
              inputProps={{ style: INPUT_STYLE }}
              value={vizOptions.color}
              onChange={(color, ctx) => updateColor(color, ctx)}
            />
          </OptionCard>

          <OptionCard title="Shape">
            <Select
              style={INPUT_STYLE}
              options={Object.keys(shaperMap).map((item) => ({ label: item, value: item }))}
              value={vizOptions.shape}
              onChange={(type) => updateShaper(type as string)}
            />
          </OptionCard>

          <OptionCard
            vertical
            title="Count"
          >
            <Radio.Group
              className="space-x-2"
              value={vizOptions.count}
              onChange={(val) => updateCount(val as number)}
            >
              {[32, 64, 128, 256].map((val) => (
                <div
                  className="flex-center"
                  key={val}
                >
                  <Radio
                    value={val}
                    style={{ margin: 0 }}
                  ></Radio>
                  <span className="ml-0.5 font-mono text-xs">{val}</span>
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
