CHANGELOG_TAG_URL_PREFIX := https://github.com/iconduit/webmanifest-loader/releases/tag/
JS_VITEST_REQ := artifacts/dist

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-npm.mk
-include .makefiles/pkg/js/v1/with-tsc.mk
-include .makefiles/pkg/changelog/v1/Makefile

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

.PHONY: precommit
precommit:: run-fixtures

.PHONY: ci
ci:: run-fixtures

################################################################################

VALID_FIXTURES := $(wildcard test/fixture/valid/*)
INVALID_FIXTURES := $(wildcard test/fixture/invalid/*)

.PHONY: run-fixtures
run-fixtures: run-fixtures-valid run-fixtures-invalid

.PHONY: run-fixtures-valid
run-fixtures-valid: $(addprefix run-fixture-valid-,$(notdir $(VALID_FIXTURES)))

.PHONY: run-fixtures-invalid
run-fixtures-invalid: $(addprefix run-fixture-invalid-,$(notdir $(INVALID_FIXTURES)))

.PHONY: run-fixture-valid-%
run-fixture-valid-%: artifacts/link-dependencies.touch artifacts/dist
	FIXTURE="valid/$*" $(JS_EXEC) webpack --config test/webpack.config.js

.PHONY: run-fixture-invalid-%
run-fixture-invalid-%: artifacts/link-dependencies.touch artifacts/dist
	if FIXTURE="invalid/$*" $(JS_EXEC) webpack --config test/webpack.config.js; then exit 1; else exit 0; fi

################################################################################

artifacts/dist: artifacts/dist/cjs artifacts/dist/esm
	@touch "$@"

artifacts/dist/cjs: tsconfig.build.cjs.json tsconfig.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	echo '{"type":"commonjs"}' > "$@/package.json"
	@touch "$@"

artifacts/dist/esm: tsconfig.build.esm.json tsconfig.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	echo '{"type":"module"}' > "$@/package.json"
	@touch "$@"
