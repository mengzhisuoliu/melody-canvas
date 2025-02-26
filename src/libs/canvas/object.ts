import { FabricObject } from "fabric";
import { pick } from "lodash";

import { NORMALIZATION_FACTOR } from "../common/config";

export const getScaledHeight = (objHeight: number, containerHeight: number) => {
  return ((objHeight / NORMALIZATION_FACTOR) * containerHeight) / 4;
};

export const cloneFabricObject = async (source: FabricObject) => {
  const newObject = await source.clone();
  if (source.subType) {
    newObject.set({ subType: source.subType });
  }
  return newObject;
};

export const getObjectTransformations = (object: FabricObject) => {
  return pick(object, ["left", "top", "scaleX", "scaleY", "flipX", "flipY", "angle"]);
};
