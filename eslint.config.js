const js = require("@eslint/js");
const import_ = require("eslint-plugin-import");
const node = require("eslint-plugin-n");
const promise = require("eslint-plugin-promise");
const globals = require("globals");
const ts = require("typescript-eslint");

module.exports = ts.config(
  {
    ignores: [".makefiles", "artifacts", "test/fixture"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  node.configs["flat/recommended-module"],
  import_.flatConfigs.recommended,
  import_.flatConfigs.typescript,
  promise.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // allow unused args if they start with _
          argsIgnorePattern: "^_",
        },
      ],
      // handled by import/no-unresolved
      "n/no-missing-import": "off",
      // don't check for unsupported features - too much config to make this work
      "n/no-unsupported-features/es-builtins": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "off",
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
