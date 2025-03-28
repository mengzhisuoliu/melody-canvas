import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

export default defineConfig({
  presets: [
    presetWind3({
      dark: {
        dark: '[theme-mode="dark"]'
      }
    }),
    presetAttributify(),
    presetIcons()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  content: {
    pipeline: {
      include: ["src/**/*.{ts,tsx}"]
    }
  },
  shortcuts: [
    ["flex-start", "flex justify-start items-center"],
    ["flex-center", "flex justify-center items-center"],
    ["flex-between", "flex justify-between items-center"],
    ["flex-end", "flex justify-end items-center"]
  ]
});
