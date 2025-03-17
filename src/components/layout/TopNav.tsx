import { Tabs } from "tdesign-react";

import { useSettingStore } from "@/stores";
import ExportDialog from "./ExportDialog";

const { TabPanel } = Tabs;

/**
 * 顶部栏
 */
const TopNav: React.FC = () => {
  const { themeMode, setThemeMode } = useSettingStore();

  return (
    <>
      <div className="absolute top-5 right-8 z-10 flex justify-end space-x-10">
        {/* 主题切换 */}
        <Tabs
          theme="card"
          className="rounded-sm h-8 w-16 flex-center border border-emerald-700 dark:border-dark-50"
          value={themeMode}
          onChange={(mode) => setThemeMode(mode as "light" | "dark")}
        >
          <TabPanel
            value="light"
            className="w-4 flex-center"
            label={<div className="i-material-symbols:sunny text-lg"></div>}
          ></TabPanel>
          <TabPanel
            value="dark"
            className="w-4 flex-center"
            label={<div className="i-material-symbols:nightlight text-lg"></div>}
          ></TabPanel>
        </Tabs>

        {/* 视频导出 */}
        <ExportDialog />
      </div>
    </>
  );
};

export default TopNav;
