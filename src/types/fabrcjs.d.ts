import type { FabricObject } from "fabric";

declare module "fabric" {
  export interface FabricObject {
    id?: string;
  }
}
