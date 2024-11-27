import { Textbox } from "fabric";
import { useEffect, useState } from "react";
import { Button, Checkbox, ColorPicker, InputNumber, SelectInput, Tag, Textarea } from "tdesign-react";

import useCanvasStore from "@/stores/canvasStore";

import { DEFAULT_TEXT, FONT_LIST } from "./props";
import { TextOptions } from "./types";

const TextManager: React.FC = () => {
  const { canvasInstance, activeObjects } = useCanvasStore();

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [textStatus, setTextStatus] = useState<"default" | "error">("default");

  const [text, setText] = useState<string>("");
  const [textOptions, setTextOptions] = useState<TextOptions>(DEFAULT_TEXT);

  useEffect(() => {
    const handleModified = () => {
      const textbox = getTextbox();
      if (textbox) {
        // 确保文本框尺寸与字体大小适配
        const newWidth = textbox.width * textbox.scaleX;
        const newFontSize = parseFloat((textbox.fontSize * textbox.scaleX).toFixed(2));
        textbox.set({
          width: newWidth,
          fontSize: newFontSize,
          scaleX: 1, // 重置 -> 避免累积缩放
          scaleY: 1
        });
        canvasInstance?.renderAll();

        setTextOptions((prev) => ({
          ...prev,
          fontSize: newFontSize
        }));
      }
    };

    canvasInstance?.on("object:modified", handleModified);
    return () => {
      canvasInstance?.off("object:modified", handleModified);
    };
  }, [activeObjects]);

  const getTextbox = () => {
    if (activeObjects.length !== 1) return;

    const obj = activeObjects[0];
    if (obj.type === "textbox") {
      return obj as Textbox;
    }
  };

  const updateTextOptions = (options: Partial<TextOptions>) => {
    setTextOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      const textbox = getTextbox();
      if (textbox) {
        textbox.set(updatedOptions);
        canvasInstance?.renderAll();
      }

      return updatedOptions;
    });
  };

  const handleAddText = () => {
    if (!canvasInstance || text === "") {
      setTextStatus("error");
      return;
    }

    const textConfig = {
      left: 50,
      top: 50,
      originY: "top" as const
    };

    const textbox = new Textbox(text, {
      ...textConfig,
      ...textOptions
    });
    // 禁止变形拉伸
    textbox.setControlsVisibility({
      mt: false,
      mb: false
    });

    canvasInstance.add(textbox);
    canvasInstance.renderAll();
  };

  return (
    <>
      <div className="text-sm space-y-8">
        <div>
          <div className="flex-between font-bold text-emerald-600 dark:text-emerald-400 mb-3">
            <div className="text-base mt-0.5">Content</div>
            {getTextbox() ? (
              <Tag
                shape="square"
                size="small"
                theme="success"
                variant="light-outline"
              >
                Editing
              </Tag>
            ) : (
              <Button
                shape="round"
                size="small"
                suffix={<div className="i-material-symbols:add-rounded"></div>}
                onClick={handleAddText}
              >
                <span className="font-bold">New</span>
              </Button>
            )}
          </div>
          {/* 文本 */}
          <Textarea
            placeholder="Type something..."
            status={textStatus}
            value={text}
            onChange={(val) => {
              setTextStatus("default");
              setText(val);
            }}
          />
        </div>

        <div>
          <div className="font-bold text-base text-emerald-600 dark:text-emerald-400 mb-3">Options</div>
          <div className="space-y-6">
            {/* 颜色 */}
            <div className="card flex items-center h-16">
              <span className="card-title mr-3">Color</span>
              <ColorPicker
                key={getTextbox()?.toString()} // TDesign 内部缓存问题
                format="HEX"
                colorModes={["monochrome"]}
                recentColors={null}
                swatchColors={null}
                value={textOptions.fill}
                onChange={(val) => updateTextOptions({ fill: val as string })}
                inputProps={{ style: { width: "126px" } }}
              />
            </div>

            {/* 大小 */}
            <div className="card flex items-center h-16">
              <span className="card-title mr-5">Size</span>
              <InputNumber
                size="small"
                min={0}
                value={textOptions.fontSize}
                onChange={(val) => updateTextOptions({ fontSize: val as number })}
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
              <SelectInput
                suffix={<div className="i-gridicons:chevron-down"></div>}
                popupVisible={popupVisible}
                style={{ width: "130px" }}
                onPopupVisibleChange={(val) => setPopupVisible(val)}
                value={textOptions.fontFamily}
                panel={
                  <ul className="text-right space-y-1">
                    {FONT_LIST.map((font, index) => (
                      <li
                        key={index}
                        className={`px-1 rounded-md truncate ${
                          font === textOptions.fontFamily
                            ? "bg-emerald-50 dark:bg-dark-100"
                            : "cursor-pointer hover:(bg-emerald-100 dark:bg-dark-50)"
                        }`}
                        onClick={() => {
                          updateTextOptions({ fontFamily: font });
                          setPopupVisible(false);
                        }}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextManager;
