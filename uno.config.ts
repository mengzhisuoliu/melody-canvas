import { defineConfig } from "unocss";
import presetAttributify from "@unocss/preset-attributify";
import presetUno from "@unocss/preset-uno";
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [
    presetUno(), // 必须先引入这个，其他 preset 才能生效
    presetAttributify()
  ],
  transformers: [
    transformerDirectives()
  ],
});
