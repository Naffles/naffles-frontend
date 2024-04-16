import type { StorybookConfig } from "@storybook/nextjs";
import * as path from "path";
import { Configuration } from "webpack";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config: Configuration) => {
    const { module, resolve } = config ?? {};
    if (module?.rules && resolve?.alias) {
      resolve.alias["@"] = path.resolve(__dirname, "../src/");
      resolve.alias["@pages"] = path.resolve(__dirname, "../src/pages/");
      resolve.alias["@hook"] = path.resolve(__dirname, "../src/hooks/");
      resolve.alias["@components"] = path.resolve(
        __dirname,
        "../src/components/"
      );
    }

    return config;
  },
  docs: {
    autodocs: "tag",
    defaultName: "Documentation",
  },
  staticDirs: ["..\\public"],
};
export default config;
