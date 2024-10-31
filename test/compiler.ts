import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import { join, resolve } from "path";
import webpack, { type Stats } from "webpack";

export default (fixture: string): Promise<Stats> => {
  const compiler = webpack({
    mode: "production",
    devtool: "source-map",
    context: join(import.meta.dirname, "fixture", fixture),
    output: {
      path: resolve(import.meta.dirname, "../artifacts/test/output", fixture),
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
  });

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);

        return;
      }

      if (!stats) {
        reject(new Error("Missing stats"));

        return;
      }

      if (stats.hasErrors()) {
        reject(stats.toJson().errors);

        return;
      }

      resolve(stats);
    });
  });
};
