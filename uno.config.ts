import { defineConfig } from "unocss";

import presetAttributify from "@unocss/preset-attributify";
import presetIcons from "@unocss/preset-icons";
import presetUno from "@unocss/preset-uno";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [
    presetUno(), // 必须先引入这个，其他 preset 才能生效
    presetAttributify(),
    presetIcons({
      warn: true // 当找不到图标时发出警告
    })
  ],
  transformers: [transformerDirectives()],
  shortcuts: [["flex-center", "flex justify-center items-center"]]
});
