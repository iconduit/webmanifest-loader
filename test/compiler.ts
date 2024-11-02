import webpack, { type Stats } from "webpack";
import { createWebpackConfig } from "./create-webpack-config.js";

export default (fixture: string): Promise<Stats> => {
  const compiler = webpack(createWebpackConfig(fixture));

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
