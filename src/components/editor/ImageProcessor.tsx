import { FabricImage, Path, Shadow } from "fabric";
import { useEffect, useMemo, useState } from "react";
import { ColorPicker, InputNumber, Upload, UploadFile } from "tdesign-react";

import { pickWithDefaults } from "@/libs/common/toolkit";
import { createPathByRadius, extractRadiusFromPath } from "@/libs/media/canvas";
import useCanvasStore from "@/stores/canvasStore";

import { ActionButton, OptionCard } from "../base";
import { DEFAULT_RADIUS, DEFAULT_SHADOW, OBJECT_CONFIG, RADIUS_INPUT } from "./props";
import type { RadiusOptions, ShadowOptions } from "./types";

const ImageProcessor: React.FC = () => {
  const { canvasInstance, activeObjects } = useCanvasStore();

  // todo 支持不删除元素就能修改图片
  const [imageFile, setImageFile] = useState<UploadFile[]>([]);

  const [radiusOptions, setRadiusOptions] = useState<RadiusOptions>(DEFAULT_RADIUS);
  const [shadowOptions, setShadowOptions] = useState<ShadowOptions>(DEFAULT_SHADOW);

  const resetOptions = () => {
    setImageFile([]);
    setRadiusOptions(DEFAULT_RADIUS);
    setShadowOptions(DEFAULT_SHADOW);
  };

  const activeImage = useMemo(() => {
    const obj = activeObjects[0];
    if (obj?.subType === "image") {
      return obj as FabricImage;
    } else {
      resetOptions();
      return null;
    }
  }, [activeObjects]);

  useEffect(() => {
    if (activeImage) {
      // 展示选中物体的参数
      const imageURL = activeImage!.getSrc();
      setImageFile([{ url: imageURL }]);

      const shadowData = pickWithDefaults(activeImage.shadow as Partial<ShadowOptions>, DEFAULT_SHADOW);
      setShadowOptions(shadowData);

      const radiusData = extractRadiusFromPath(
        (activeImage.clipPath as Path).path,
        activeImage.width,
        activeImage.height
      );
      setRadiusOptions(radiusData);
    }
  }, [activeImage]);

  const updateRadius = (options: Partial<RadiusOptions>) => {
    setRadiusOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      if (activeImage) {
        const roundedPath = createPathByRadius(activeImage.width, activeImage.height, updatedOptions);
        activeImage.set({
          clipPath: roundedPath
        });
        canvasInstance!.renderAll();
      }

      return updatedOptions;
    });
  };

  const updateShadow = (options: Partial<ShadowOptions>) => {
    setShadowOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      if (activeImage) {
        activeImage.set({
          shadow: new Shadow(updatedOptions)
        });
        canvasInstance!.renderAll();
      }

      return updatedOptions;
    });
  };

  const handleAddImage = async () => {
    if (!canvasInstance || imageFile.length === 0) return;

    const file = imageFile[0].raw!;
    const imageURL = URL.createObjectURL(file);
    const image = await FabricImage.fromURL(imageURL);
    const width = image.width;
    const height = image.height;
    const scaleFactor = 200 / height;

    image.set({
      ...OBJECT_CONFIG,
      subType: "image"
    });
    image.scale(scaleFactor);

    // 阴影
    image.set({
      shadow: new Shadow(shadowOptions)
    });

    // 圆角
    const roundedPath = createPathByRadius(width, height, radiusOptions);
    image.set({
      clipPath: roundedPath
    });

    canvasInstance.add(image);
    canvasInstance.setActiveObject(image);
    canvasInstance.renderAll();

    resetOptions();
  };

  return (
      <>
        <div className="mb-6">
          <div className="flex-between font-bold text-emerald-600 dark:text-emerald-400 mb-4">
            <div>File</div>
            <ActionButton
              activeObj={activeImage?.group}
              disabled={imageFile.length === 0}
              onAdd={handleAddImage}
            />
          </div>
          <Upload
            className="h-28"
            theme="image"
            accept="image/*"
            autoUpload={false}
            showImageFileName={false}
            files={imageFile}
            onChange={setImageFile}
            disabled={activeImage !== null}
          />
        </div>

        <div className="mb-6">
          <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">Options</div>
          <div className="space-y-6">
            {/* 阴影 */}
            <OptionCard
              vertical
              title="Shadow"
            >
              <div className="grid grid-cols-2 gap-2">
                <ColorPicker
                  format="HEX"
                  colorModes={["monochrome"]}
                  recentColors={null}
                  swatchColors={null}
                  inputProps={{ style: { width: "88px" } }}
                  value={shadowOptions.color}
                  onChange={(val) => updateShadow({ color: val })}
                />
                <InputNumber
                  size="small"
                  theme="column"
                  min={0}
                  label={<div className={"i-material-symbols:blur-circular-outline"}></div>}
                  value={shadowOptions.blur}
                  onChange={(val) => updateShadow({ blur: Number(val) })}
                />
                <InputNumber
                  size="small"
                  theme="column"
                  min={0}
                  label={<div className={"i-tabler:letter-x"}></div>}
                  value={shadowOptions.offsetX}
                  onChange={(val) => updateShadow({ offsetX: Number(val) })}
                />
                <InputNumber
                  size="small"
                  theme="column"
                  min={0}
                  label={<div className={"i-tabler:letter-y"}></div>}
                  value={shadowOptions.offsetY}
                  onChange={(val) => updateShadow({ offsetY: Number(val) })}
                />
              </div>
            </OptionCard>

            {/* 弧度 */}
            <OptionCard
              vertical
              title="Rounded Corner"
            >
              <div className="grid grid-cols-2 gap-2">
                {RADIUS_INPUT.map(({ key, icon }) => (
                  <InputNumber
                    key={key}
                    size="small"
                    theme="column"
                    min={0}
                    label={<div className={icon}></div>}
                    value={radiusOptions[key as keyof RadiusOptions]}
                    onChange={(val) => updateRadius({ [key]: val })}
                  />
                ))}
              </div>
            </OptionCard>
          </div>
        </div>
      </>
  );
};

export default ImageProcessor;
