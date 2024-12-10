import { FabricImage, Group, Path, Shadow } from "fabric";
import { useEffect, useMemo, useState } from "react";
import { ColorPicker, InputNumber, Upload, UploadFile } from "tdesign-react";

import ActionButton from "@/components/base/ActionButton";
import { pickValues } from "@/libs/common/toolkit";
import { createRoundedPath } from "@/libs/media/canvas";
import useCanvasStore from "@/stores/canvasStore";

import { DEFAULT_RADIUS, DEFAULT_SHADOW, DEFAULT_STROKE, OBJECT_CONFIG, RADIUS_INPUT } from "./props";
import { RadiusOptions, ShadowOptions, StrokeOptions } from "./types";

const ImageProcessor: React.FC = () => {
  const { canvasInstance, activeObjects } = useCanvasStore();

  const [imageFile, setImageFile] = useState<UploadFile[]>([]);

  const [radiusOptions, setRadiusOptions] = useState<RadiusOptions>(DEFAULT_RADIUS);
  const [strokeOptions, setStrokeOptions] = useState<StrokeOptions>(DEFAULT_STROKE);
  const [shadowOptions, setShadowOptions] = useState<ShadowOptions>(DEFAULT_SHADOW);

  const resetOptions = () => {
    setImageFile([]);
    setRadiusOptions(DEFAULT_RADIUS);
    setStrokeOptions(DEFAULT_STROKE);
    setShadowOptions(DEFAULT_SHADOW);
  };

  const activeImage = useMemo(() => {
    const obj = activeObjects[0];
    if (obj?.type === "group" && obj?.subType?.category === "image") {
      const group = obj as Group;
      const image = group.getObjects().find((child) => child.type === "image") as FabricImage;
      const stroke = group.getObjects().find((child) => child.type === "path") as Path;
      return { group, image, stroke };
    } else {
      resetOptions();
      return null;
    }
  }, [activeObjects]);

  useEffect(() => {
    if (activeImage) {
      const { image, stroke } = activeImage;

      const imageURL = image!.getSrc();
      setImageFile([{ url: imageURL }]);

      const radiusData = pickValues(image.clipPath as Partial<RadiusOptions>, DEFAULT_RADIUS);
      const strokeData = pickValues(stroke as Partial<StrokeOptions>, DEFAULT_STROKE);
      const shadowData = pickValues(image.shadow as Partial<ShadowOptions>, DEFAULT_SHADOW);

      setRadiusOptions(radiusData);
      setStrokeOptions(strokeData);
      setShadowOptions(shadowData);
    }
  }, [activeImage]);

  const updateRadius = (options: Partial<RadiusOptions>) => {
    setRadiusOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      const image = activeImage?.image;
      const stroke = activeImage?.stroke;
      if (image && stroke) {
        const pathData = createRoundedPath(image.width, image.height, updatedOptions);

        const radius = image.clipPath as Path;
        radius._setPath(pathData);
        // 同时影响 stroke
        stroke._setPath(pathData);

        canvasInstance?.renderAll();
      }

      return updatedOptions;
    });
  };

  const updateStroke = (options: Partial<StrokeOptions>) => {
    setStrokeOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      const stroke = activeImage?.stroke;
      if (stroke) {
        stroke.set(updatedOptions);
        canvasInstance?.renderAll();
      }

      return updatedOptions;
    });
  };

  const updateShadow = (options: Partial<ShadowOptions>) => {
    setShadowOptions((prev) => {
      const updatedOptions = { ...prev, ...options };

      const image = activeImage?.image;
      if (image) {
        image.set({
          shadow: new Shadow(updatedOptions)
        });
        canvasInstance?.renderAll();
      }

      return updatedOptions;
    });
  };

  const handleAddImage = async () => {
    if (!canvasInstance || imageFile.length === 0) return;

    // 基本配置
    const file = imageFile[0].raw!;
    const imageURL = URL.createObjectURL(file);
    const image = await FabricImage.fromURL(imageURL);

    const width = image.width;
    const height = image.height;
    const scaleFactor = 200 / height;

    image.set({
      ...OBJECT_CONFIG
    });
    image.scale(scaleFactor);

    // 阴影
    image.set({
      shadow: new Shadow(shadowOptions)
    });

    // 圆角
    const pathData = createRoundedPath(width, height, radiusOptions);
    const roundedPath = new Path(pathData, {
      left: -width / 2,
      top: -height / 2
    });

    image.set({
      clipPath: roundedPath
    });

    // 边框
    const strokePath = new Path(pathData, {
      ...OBJECT_CONFIG,
      ...strokeOptions,
      fill: "transparent"
    });
    strokePath.scale(scaleFactor);

    const group = new Group([image, strokePath]);
    group.set({ subType: { category: "image" } });

    canvasInstance.add(group);
    canvasInstance.setActiveObject(group);
    canvasInstance.renderAll();

    resetOptions();
  };

  return (
    <>
      <div className="text-sm space-y-8">
        <div>
          <div className="flex-between font-bold text-emerald-600 dark:text-emerald-400 mb-3">
            <div className="text-base mt-0.5">File</div>
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

        <div>
          <div className="font-bold text-base text-emerald-600 dark:text-emerald-400 mb-3">Options</div>
          <div className="space-y-6">
            {/* 描边 */}
            <div className="card flex flex-col space-y-2">
              <span className="card-title mr-4">Stroke</span>
              <div className="grid grid-cols-2 gap-2">
                <ColorPicker
                  key={activeImage?.toString()}
                  format="HEX"
                  colorModes={["monochrome"]}
                  recentColors={null}
                  swatchColors={null}
                  inputProps={{ style: { width: "88px" } }}
                  value={strokeOptions.stroke}
                  onChange={(val) => updateStroke({ stroke: val })}
                />
                <InputNumber
                  size="small"
                  theme="column"
                  min={0}
                  label={<div className={"i-proicons:stroke-thickness"}></div>}
                  value={strokeOptions.strokeWidth}
                  onChange={(val) => updateStroke({ strokeWidth: Number(val) })}
                />
              </div>
            </div>

            {/* 阴影 */}
            <div className="card flex flex-col space-y-2">
              <span className="card-title mr-4">Shadow</span>
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
            </div>

            {/* 弧度 */}
            <div className="card flex flex-col">
              <div className="card-title mb-2">Rounded Corner</div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageProcessor;
