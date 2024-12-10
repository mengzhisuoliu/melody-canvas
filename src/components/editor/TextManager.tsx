import { Textbox } from "fabric";
import { useEffect, useMemo, useState } from "react";
import { Checkbox, ColorPicker, Select, Textarea } from "tdesign-react";

import ActionButton from "@/components/base/ActionButton";
import { formatSelectOptions, pickValues } from "@/libs/common/toolkit";
import useCanvasStore from "@/stores/canvasStore";

import { DEFAULT_TEXT, FONT_LIST, OBJECT_CONFIG } from "./props";
import { TextOptions } from "./types";

const TextManager: React.FC = () => {
  const { canvasInstance, activeObjects } = useCanvasStore();

  const [text, setText] = useState<string>("");
  const [textOptions, setTextOptions] = useState<TextOptions>(DEFAULT_TEXT);

  const resetOptions = () => {
    setText("");
    setTextOptions(DEFAULT_TEXT);
  };

  const activeText = useMemo(() => {
    const obj = activeObjects[0];
    if (obj?.type === "textbox") {
      return obj as Textbox;
    } else {
      resetOptions();
      return null;
    }
  }, [activeObjects]);

  useEffect(() => {
    if (activeText) {
      const textInput = activeText.text;
      const textData = pickValues(activeText as Partial<TextOptions>, DEFAULT_TEXT);

      setText(textInput);
      setTextOptions(textData);
    }
  }, [activeObjects]);

  const handleAddText = () => {
    if (!canvasInstance || text === "") return;

    const textbox = new Textbox(text, {
      ...OBJECT_CONFIG,
      ...textOptions
    });
    // 禁止变形拉伸
    textbox.setControlsVisibility({
      mt: false,
      mb: false
    });

    canvasInstance.add(textbox);
    canvasInstance.setActiveObject(textbox);
    canvasInstance.renderAll();

    resetOptions();
  };

  const updateTextOptions = (options: Partial<TextOptions>) => {
    setTextOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      if (activeText) {
        activeText.set(updatedOptions);
        canvasInstance?.renderAll();
      }

      return updatedOptions;
    });
  };

  return (
    <>
      <div className="text-sm space-y-8">
        <div>
          <div className="flex-between font-bold text-emerald-600 dark:text-emerald-400 mb-3">
            <div className="text-base mt-0.5">Content</div>
            <ActionButton
              activeObj={activeText}
              disabled={text === ""}
              onAdd={handleAddText}
            />
          </div>
          {/* 文本 */}
          <Textarea
            placeholder="Type something..."
            value={text}
            onChange={(val) => setText(val)}
          />
        </div>

        <div>
          <div className="font-bold text-base text-emerald-600 dark:text-emerald-400 mb-3">Options</div>
          <div className="space-y-6">
            {/* 颜色 */}
            <div className="card flex items-center h-16">
              <span className="card-title mr-3">Color</span>
              <ColorPicker
                key={activeText?.toString()} // TDesign 内部缓存问题
                format="HEX"
                colorModes={["monochrome"]}
                recentColors={null}
                swatchColors={null}
                inputProps={{ style: { width: "126px" } }}
                value={textOptions.fill}
                onChange={(val) => updateTextOptions({ fill: val as string })}
              />
            </div>

            {/* 样式 */}
            <div className="card flex items-center h-16 space-x-2">
              <span className="card-title mr-1.5">Style</span>
              <Checkbox
                checked={textOptions.fontWeight === 900}
                onChange={(checked) => updateTextOptions({ fontWeight: checked ? 900 : 400 })}
              >
                <span font="bold">Bold</span>
              </Checkbox>
              <Checkbox
                checked={textOptions.fontStyle === "italic"}
                onChange={(checked) => updateTextOptions({ fontStyle: checked ? "italic" : "normal" })}
              >
                <span className="italic">Italic</span>
              </Checkbox>
            </div>

            {/* 字体 */}
            <div className="card flex items-center h-16">
              <span className="card-title mr-4">Font</span>
              <Select
                style={{ width: "130px" }}
                value={textOptions.fontFamily}
                options={formatSelectOptions(FONT_LIST)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextManager;
