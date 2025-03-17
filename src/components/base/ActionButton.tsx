import { FabricObject } from "fabric";
import { Button } from "tdesign-react";

import { useCanvasStore } from "@/stores";

interface ActionButtonProps {
  activeObjs: FabricObject[];
  disabled: boolean;
  onAdd: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ activeObjs, disabled, onAdd }) => {
  const { canvasInstance } = useCanvasStore();

  const action =
    activeObjs?.length === 1
      ? {
          theme: "danger" as const,
          icon: "i-ri:subtract-fill",
          text: "Delete",
          onClick: () => {
            activeObjs!.forEach((obj) => {
              canvasInstance!.remove(obj);
            });
          }
        }
      : {
          theme: "success" as const,
          icon: "i-ri:add-fill",
          text: "New",
          onClick: onAdd
        };

  if (activeObjs.length > 1) return;

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
