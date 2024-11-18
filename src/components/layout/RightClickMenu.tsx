import { useEffect, useRef, useState } from "react";
import useCanvasStore from "@/stores/canvasStore";

const MENU_BUTTON_STYLE = "rounded-md flex-between hover:bg-dark-50 px-2 space-x-4";

/**
 * 自定义右键菜单
 */
const RightClickMenu = () => {
  const { canvasInstance, activeObject } = useCanvasStore();

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
      if (!activeObject || !canvasInstance) return;

      const canvas = canvasInstance.getElement();
      const canvasRect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const { left, top, width, height } = activeObject.getBoundingRect();

      const matrix = activeObject.transformMatrixKey();
      const offsetLeft = left + matrix[4];
      const offsetTop = top + matrix[5];

      // 鼠标需要落在当前选中物体内
      if (
        mouseX >= offsetLeft &&
        mouseX <= offsetLeft + width &&
        mouseY >= offsetTop &&
        mouseY <= offsetTop + height
      ) {
        const { offsetWidth, offsetHeight } = menuRef.current!;
        // 确保菜单不会超出画布边界
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
  }, [activeObject]);

  const actions =
    !canvasInstance || !activeObject
      ? null
      : {
          edit: () => {},
          delete: () => canvasInstance.remove(activeObject),
          bringToFront: () => canvasInstance.bringObjectToFront(activeObject),
          sendToBack: () => canvasInstance.sendObjectToBack(activeObject)
        };

  return (
    <div
      ref={menuRef}
      className="z-1000 absolute bg-dark-100 border border-gray-300 rounded-md px-1 py-2 shadow-lg"
      style={{
        top: position.y,
        left: position.x,
        visibility: visible ? "visible" : "hidden"
      }}
    >
      <div className="flex flex-col space-y-1">
        <button className={MENU_BUTTON_STYLE} onClick={() => actions?.edit?.()}>
          <div className="i-material-symbols:settings"></div>
          <div>Edit</div>
        </button>
        <button className={MENU_BUTTON_STYLE} onClick={() => actions?.delete?.()}>
          <div className="i-material-symbols:delete"></div>
          <div>Delete</div>
        </button>
        <span className="w-full h-0.5 bg-dark-50"></span>
        <button className={MENU_BUTTON_STYLE} onClick={() => actions?.bringToFront?.()}>
          <div className="i-material-symbols:vertical-align-top"></div>
          <div>Bring to Front</div>
        </button>
        <button className={MENU_BUTTON_STYLE} onClick={() => actions?.sendToBack?.()}>
          <div className="i-material-symbols:vertical-align-bottom"></div>
          <div>Send to Back</div>
        </button>
      </div>
    </div>
  );
};

export default RightClickMenu;
