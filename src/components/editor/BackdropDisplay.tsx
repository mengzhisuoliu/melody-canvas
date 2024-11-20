import type { DropdownOption } from "tdesign-react";
import { Button, Dropdown } from "tdesign-react";

import useCanvasStore from "@/stores/canvasStore";

const BackdropDisplay: React.FC = () => {
  const { backdrop } = useCanvasStore();

  const handleAdjustSize = (item: DropdownOption) => {};

  return (
    <>
      <div>
        {/* 尺寸 */}
        <Dropdown
          hideAfterItemClick
          options={[
            {
              content: "9:16"
            },
            {
              content: "1:1"
            }
          ]}
          placement="bottom-right"
          trigger="click"
          onClick={(item) => handleAdjustSize(item)}
        >
          <Button
            block
            theme="primary"
            variant="dashed"
            size="large"
            suffix={<div className="i-gridicons:chevron-down"></div>}
          >
            <div className="flex-between w-full mr-1 text-emerald-800 dark:text-emerald-400">
              <div className="flex-center font-bold">
                <div className="i-mingcute:display-line text-xl mr-2"></div>
                <div>Size</div>
              </div>
              <span>16:9</span>
            </div>
          </Button>
        </Dropdown>
      </div>
    </>
  );
};

export default BackdropDisplay;
