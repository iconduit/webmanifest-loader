const { createWebpackConfig } = require("./create-webpack-config.js");

const fixture = process.env.FIXTURE;

if (!fixture) throw new Error("FIXTURE is required");

module.exports = createWebpackConfig(fixture);
