import { FabricObject } from "fabric";
import { Button } from "tdesign-react";

import { useCanvasStore } from "@/stores";

interface ActionButton {
  activeObj: FabricObject | null | undefined;
  disabled: boolean;
  onAdd: () => void;
}

const ActionButton: React.FC<ActionButton> = ({ activeObj, disabled, onAdd }) => {
  const { canvasInstance } = useCanvasStore();

  const action = activeObj
    ? {
        theme: "danger" as const,
        icon: "i-ri:subtract-fill",
        text: "Delete",
        onClick: () => canvasInstance?.remove(activeObj)
      }
    : {
        theme: "success" as const,
        icon: "i-ri:add-fill",
        text: "New",
        onClick: onAdd
      };

  return (
    <Button
      shape="round"
      size="small"
      suffix={<div className={action.icon}></div>}
      onClick={action.onClick}
      theme={action.theme}
      disabled={disabled}
    >
      <span className="font-bold">{action.text}</span>
    </Button>
  );
};

export default ActionButton;
