import { mergeConfig } from "vite";
export default {
  framework: "@storybook/react",
  core: { builder: "@storybook/builder-vite" },
  stories: ["../frontend/src/components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"]
};
