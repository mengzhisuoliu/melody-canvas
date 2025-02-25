import { Group } from "fabric";
import { useEffect, useRef, useState } from "react";

import { cloneFabricObject } from "@/libs/media/canvas";
import useCanvasStore from "@/stores/canvasStore";

const MENU_BUTTON_STYLE =
  "rounded-md flex-between px-2 space-x-4 hover:bg-emerald-100 dark:(hover:bg-dark-50 hover:text-white)";

/**
 * 自定义右键菜单
 */
const RightClickMenu = () => {
  const { canvasInstance, builderFactory, activeObjects } = useCanvasStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = () => {
      if (visible) setVisible(false);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [visible]);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      if (!canvasInstance) return;

      const canvas = canvasInstance.getElement();
      const canvasRect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const inSelectedArea = activeObjects.some((obj) => {
        const { left, top, width, height } = obj.getBoundingRect();
        const matrix = obj.transformMatrixKey();
        const offsetLeft = left + matrix[4];
        const offsetTop = top + matrix[5];

        return (
          mouseX >= offsetLeft && mouseX <= offsetLeft + width && mouseY >= offsetTop && mouseY <= offsetTop + height
        );
      });

      if (inSelectedArea) {
        const { offsetWidth, offsetHeight } = menuRef.current!;
        const newX = mouseX + offsetWidth < canvasInstance.width ? mouseX : mouseX - offsetWidth;
        const newY = mouseY + offsetHeight < canvasInstance.height ? mouseY : mouseY - offsetHeight;

        setPosition({ x: newX, y: newY });
        setVisible(true);
      } else {
        setVisible(false);
        canvasInstance.discardActiveObject();
        canvasInstance.renderAll();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, [canvasInstance, activeObjects]);

  const actions = {
    duplicate: async () => {
      const activeObject = activeObjects[0]!;
      if (activeObject.subType === "audio") {
        builderFactory!.cloneBuilder(activeObject as Group);
      } else {
        const clonedObject = await cloneFabricObject(activeObject);
        canvasInstance!.add(clonedObject);
        canvasInstance!.sendObjectToBack(clonedObject);
        canvasInstance!.renderAll();
      }
    },
    delete: () => {
      activeObjects.forEach((obj) => canvasInstance!.remove(obj));
      canvasInstance!.discardActiveObject();
    },
    bringToFront: () => {
      canvasInstance!.bringObjectToFront(activeObjects[0]);
    },
    sendToBack: () => {
      canvasInstance!.sendObjectToBack(activeObjects[0]);
    }
  };

  return (
    <div
      ref={menuRef}
      className="z-1000 absolute bg-white border border-gray-500 rounded-md px-1 py-2 shadow-lg"
      style={{
        top: position.y,
        left: position.x,
        visibility: visible ? "visible" : "hidden"
      }}
    >
      <div className="flex flex-col space-y-1">
        {activeObjects.length > 1 && (
          <div className="px-2 text-sm mb-1 italic">{activeObjects.length} items selected</div>
        )}

        {activeObjects.length !== 0 && (
          <button
            className={MENU_BUTTON_STYLE}
            onClick={actions.delete}
          >
            <div className="i-material-symbols:delete"></div>
            <div>Delete</div>
          </button>
        )}

        {activeObjects.length === 1 && (
          <>
            <button
              className={MENU_BUTTON_STYLE}
              onClick={actions.duplicate}
            >
              <div className="i-clarity:clone-solid"></div>
              <div>Duplicate</div>
            </button>
            <span className="h-0.4 bg-dark-50 mx-1"></span>
            <button
              className={MENU_BUTTON_STYLE}
              onClick={actions.bringToFront}
            >
              <div className="i-material-symbols:vertical-align-top"></div>
              <div>Bring to Front</div>
            </button>
            <button
              className={MENU_BUTTON_STYLE}
              onClick={actions.sendToBack}
            >
              <div className="i-material-symbols:vertical-align-bottom"></div>
              <div>Send to Back</div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RightClickMenu;
