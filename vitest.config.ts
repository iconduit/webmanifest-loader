import { defineConfig } from "vitest/config";

module.exports = defineConfig({
  test: {
    watch: false,
    include: ["test/suite/**/*.spec.ts"],
    coverage: {
      include: ["artifacts/dist/**/*.js"],
    },
  },
});
