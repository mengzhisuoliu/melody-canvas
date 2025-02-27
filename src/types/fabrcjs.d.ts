import "fabric";

declare module "fabric" {
  export interface FabricObject {
    subType?: "audio" | "image" | "text";
  }

  export interface Group {
    id?: string;
    color?: string;
    count?: number;
  }
}
