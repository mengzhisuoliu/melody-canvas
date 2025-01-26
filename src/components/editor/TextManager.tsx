import { Textbox } from "fabric";
import { useEffect, useMemo, useState } from "react";
import { Checkbox, ColorPicker, SelectInput, Textarea } from "tdesign-react";

import { pickValues } from "@/libs/common/toolkit";
import useCanvasStore from "@/stores/canvasStore";

import { ActionButton, OptionCard } from "../base";
import { DEFAULT_TEXT, FONT_LIST, OBJECT_CONFIG } from "./props";
import type { TextOptions } from "./types";

const TextManager: React.FC = () => {
  const { canvasInstance, activeObjects } = useCanvasStore();

  const [text, setText] = useState<string>("");
  const [textOptions, setTextOptions] = useState<TextOptions>(DEFAULT_TEXT);
  const [popupVisible, setPopupVisible] = useState(false);

  const resetOptions = () => {
    setText("");
    setTextOptions(DEFAULT_TEXT);
  };

  const activeText = useMemo(() => {
    const obj = activeObjects[0];
    if (obj?.subType?.category === "text") {
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

  const updateText = (text: string) => {
    setText(text);
    if (activeText) {
      activeText.set({ text });
      canvasInstance?.renderAll();
    }
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

    textbox.set({ subType: { category: "text" } });
    canvasInstance.add(textbox);
    canvasInstance.setActiveObject(textbox);
    canvasInstance.renderAll();

    resetOptions();
  };

  return (
    <>
      <div className="text-sm space-y-6">
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
            onChange={(val) => updateText(val)}
          />
        </div>

        <div>
          <div className="font-bold text-base text-emerald-600 dark:text-emerald-400 mb-3">Options</div>
          <div className="space-y-6">
            {/* 颜色 */}
            <OptionCard title="Color">
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
            </OptionCard>

            {/* 样式 */}
            <OptionCard title="Style">
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
            </OptionCard>

            {/* 字体 */}
            <OptionCard title="Font">
              <SelectInput
                value={textOptions.fontFamily}
                popupVisible={popupVisible}
                placeholder="Select or Input"
                allowInput
                clearable
                style={{ width: "75%" }}
                onInputChange={(font) => updateTextOptions({ fontFamily: font })}
                onPopupVisibleChange={(visible) => setPopupVisible(visible)}
                panel={
                  <ul className="">
                    {FONT_LIST.map((font) => (
                      <li
                        key={font}
                        className="text-xs cursor-pointer p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-dark-800"
                        style={{ fontFamily: font }}
                        onClick={() => {
                          updateTextOptions({ fontFamily: font });
                          setPopupVisible(false);
                        }}
                      >
                        {font}
                      </li>
                    ))}
                  </ul>
                }
              />
            </OptionCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextManager;
