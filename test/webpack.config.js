import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import { resolve } from "path";

const fixture = process.env.FIXTURE;

if (!fixture) throw new Error("FIXTURE is required");

/** @type {import('webpack').Configuration} */
const config = {
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

export default config;
