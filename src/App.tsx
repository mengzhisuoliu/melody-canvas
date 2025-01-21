import { ConfigProvider } from "tdesign-react";
import enConfig from "tdesign-react/es/locale/en_US";
import merge from "lodash/merge";

import DashBoard from "@/pages/DashBoard";

function App() {
  const globalConfig = merge(enConfig, {
    input: {
      placeholder: ""
    }
  });

  return (
    <>
      <ConfigProvider globalConfig={globalConfig}>
        <DashBoard />
      </ConfigProvider>
    </>
  );
}

export default App;
