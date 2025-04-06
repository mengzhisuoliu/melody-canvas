import { FabricImage, FabricObjectProps, Path, Shadow } from "fabric";
import { useEffect, useMemo, useState } from "react";
import { Checkbox, ColorPicker, InputNumber, Upload, type UploadFile } from "tdesign-react";

import { useCanvasStore } from "@/stores";

import { createPathByRadius, extractRadiusFromPath, getObjectTransformations } from "@/libs/canvas";
import { pickWithDefaults } from "@/libs/common";

import { ActionButton, OptionCard } from "@/components/base";

import { DEFAULT_RADIUS, DEFAULT_SHADOW, OBJECT_CONFIG, RADIUS_INPUT } from "./props";
import type { RadiusOptions, ShadowOptions } from "./types";

const ImageProcessor: React.FC = () => {
  const { canvasInstance, activeObjects } = useCanvasStore();

  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [isRadiusUniform, setIsRadiusUniform] = useState<boolean>(true);
  const [radiusOptions, setRadiusOptions] = useState<RadiusOptions>(DEFAULT_RADIUS);
  const [shadowOptions, setShadowOptions] = useState<ShadowOptions>(DEFAULT_SHADOW);

  const resetOptions = () => {
    setImageFile(null);
    setRadiusOptions(DEFAULT_RADIUS);
    setShadowOptions(DEFAULT_SHADOW);
  };

  const activeImgList = useMemo(() => {
    return activeObjects.filter((obj) => obj?.subType === "image") as FabricImage[];
  }, [activeObjects]);

  const ImgPreviewTrigger: React.FC = () => {
    return (
      <label className="w-full h-full flex-center">
        <div className="i-tdesign-refresh text-base"></div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={updateImageFile}
        />
      </label>
    );
  };

  const RadiusModeCheckbox: React.FC = () => {
    return (
      <div className="flex-between">
        Radius
        <Checkbox
          checked={isRadiusUniform}
          onChange={setIsRadiusUniform}
          label="Uniform"
        />
      </div>
    );
  };

  useEffect(() => {
    if (activeImgList.length > 0) {
      const firstImage = activeImgList[0];
      const imageUrl = firstImage.getSrc();
      setImageFile({ url: imageUrl });

      const shadowData = pickWithDefaults(firstImage.shadow as Partial<ShadowOptions>, DEFAULT_SHADOW);
      setShadowOptions(shadowData);

      const radiusData = extractRadiusFromPath((firstImage.clipPath as Path).path, firstImage.width, firstImage.height);
      setRadiusOptions(radiusData);
    } else {
      resetOptions();
    }
  }, [activeImgList]);

  const createFabricImg = async (url: string, options?: Partial<FabricObjectProps>) => {
    const image = await FabricImage.fromURL(url);
    const width = image.width;
    const height = image.height;
    const scaleFactor = 200 / height;

    image.set({ ...OBJECT_CONFIG, subType: "image" });
    image.scale(scaleFactor);

    // 阴影
    image.set({ shadow: new Shadow(shadowOptions) });

    // 圆角
    const roundedPath = createPathByRadius(width, height, radiusOptions);
    image.set({ clipPath: roundedPath });

    if (options) {
      image.set(options);
    }

    canvasInstance?.add(image);
    canvasInstance?.setActiveObject(image);
    canvasInstance?.renderAll();
  };

  const updateImageFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImageFile({ url: imageUrl });

    const origProps = getObjectTransformations(activeImgList[0]);
    await createFabricImg(imageUrl, origProps);

    canvasInstance?.remove(activeImgList[0]);
  };

  const updateRadius = (options: Partial<RadiusOptions>) => {
    setRadiusOptions((prev) => {
      let updatedOptions = { ...prev, ...options };

      if (isRadiusUniform) {
        // 四个角一起变化
        const uniformValue = options.tl ?? options.tr ?? options.bl ?? options.br ?? 0;
        updatedOptions = { tl: uniformValue, tr: uniformValue, bl: uniformValue, br: uniformValue };
      }

      activeImgList.forEach((img) => {
        const roundedPath = createPathByRadius(img.width, img.height, updatedOptions);
        img.set({ clipPath: roundedPath });
      });
      canvasInstance?.renderAll();

      return updatedOptions;
    });
  };

  const updateShadow = (options: Partial<ShadowOptions>) => {
    setShadowOptions((prev) => {
      const updatedOptions = { ...prev, ...options };
      activeImgList.forEach((img) => img.set({ shadow: new Shadow(updatedOptions) }));
      canvasInstance?.renderAll();
      return updatedOptions;
    });
  };

  const handleAddImage = async () => {
    if (!canvasInstance || !imageFile) return;

    const file = imageFile.raw!;
    const imageUrl = URL.createObjectURL(file);
    await createFabricImg(imageUrl);
  };

  return (
    <>
      <div className="mb-6">
        <div
          className="flex-between font-bold text-emerald-600 mb-4"
          dark="text-emerald-400"
        >
          <div>File</div>
          <ActionButton
            disabled={!imageFile}
            onAdd={handleAddImage}
          />
        </div>
        <Upload
          className="h-28"
          theme="image"
          accept="image/*"
          multiple={false}
          autoUpload={false}
          showImageFileName={false}
          files={imageFile ? [imageFile] : []}
          disabled={activeObjects.length > 0}
          onChange={(files) => setImageFile(files[0])}
          // 确保选中物体只是一个 FabricImage
          {...(activeObjects.length === 1 &&
            activeImgList.length === 1 && {
              imageViewerProps: {
                trigger: <ImgPreviewTrigger />
              }
            })}
        />
      </div>

      <div className="mb-6">
        <div
          className="font-bold text-emerald-600 mb-3"
          dark="text-emerald-400"
        >
          Options
        </div>
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
            title={<RadiusModeCheckbox />}
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

      {/* 选中状态下隐藏 Upload 组件原有的删除按钮 -> 交给 Trigger 处理 */}
      {activeImgList && (
        <style>
          {`
            .t-upload__card-mask-item {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
        
            .t-upload__card-mask-item-divider {
              display: none;
            }
        
            .t-upload__card-mask-item-divider ~ * {
              display: none;
            }
          `}
        </style>
      )}
    </>
  );
};

export default ImageProcessor;
