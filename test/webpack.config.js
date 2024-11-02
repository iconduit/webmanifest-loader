import { createWebpackConfig } from "./create-webpack-config.js";

const fixture = process.env.FIXTURE;

if (!fixture) throw new Error("FIXTURE is required");

export default createWebpackConfig(fixture);
