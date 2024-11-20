import { ConfigProvider } from "tdesign-react";
import enConfig from "tdesign-react/es/locale/en_US";
import merge from "lodash/merge";

import DashBoard from "@/pages/DashBoard";
import useThemeMode from "@/hooks/useThemeMode";

function App() {
  useThemeMode();

  const globalConfig = merge(enConfig, {});

  return (
    <>
      <ConfigProvider globalConfig={globalConfig}>
        <DashBoard />
      </ConfigProvider>
    </>
  );
}

export default App;
