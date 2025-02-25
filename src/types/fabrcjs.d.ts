import type { Group, FabricObject } from "fabric";
import type { VizShape, VizStyle } from "@/components/editor/types";

declare module "fabric" {
  export interface FabricObject {
    id?: string;
    subType?: "audio" | "image" | "text";
  }
}
