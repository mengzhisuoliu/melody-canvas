import "fabric";

declare module "fabric" {
  export interface FabricObject {
    subType?: "audio" | "image" | "text";
  }

  export interface Group {
    id?: string;
    count?: number;
    color?: string;
    shape?: string;
  }
}
