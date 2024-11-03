import type { LoaderDefinitionFunction } from "webpack";

const webManifestSubLoader: LoaderDefinitionFunction = function () {
  return `module.exports = require(${JSON.stringify(this.utils.contextify(this.context, this.remainingRequest))});`;
};

module.exports = webManifestSubLoader;
