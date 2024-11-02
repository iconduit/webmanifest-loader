import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import { resolve } from "path";

/**
 * @param {string} fixture
 * @returns {import('webpack').Configuration}
 */
export function createWebpackConfig(fixture) {
  return {
    mode: "production",
    devtool: "source-map",
    context: resolve(import.meta.dirname, "fixture", fixture),
    entry: "./index.html",
    output: {
      path: resolve(import.meta.dirname, "../artifacts/integration"),
      filename: "bundle.js",
      publicPath: "/path/to/public/",
      assetModuleFilename: "[name].public[ext][query]",
    },
    plugins: [
      new HtmlBundlerPlugin({
        entry: {
          index: "index.html",
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.png$/,
          type: "asset/resource",
        },
        {
          test: /\.webmanifest$/,
          type: "asset/resource",
          use: resolve(import.meta.dirname, "../artifacts/dist/esm/index.js"),
        },
      ],
    },
  };
}
