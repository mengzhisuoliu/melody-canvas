import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@unocss/reset/tailwind.css";
import 'tdesign-react/es/style/index.css';
import "virtual:uno.css";

import "@/styles/theme.css";
// 注意顺序
import "@/styles/animation.css";
import "@/styles/ui.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
