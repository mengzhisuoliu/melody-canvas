import type { FabricObject } from "fabric";

declare module "fabric" {
  export interface FabricObject {
    subType?: {
      category: "audio" | "image" | "text";
      variant?: string;
    };
  }
}
