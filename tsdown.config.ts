/// <reference types="node" />

import jsrTsSelfTypes from "#plugin/jsr-ts-self-types";
import { defineConfig, type UserConfig } from "tsdown";

const config = {
	plugins: [jsrTsSelfTypes()],
	entry: [{
		"index": "./bindings/node/index",
		"grammar": "./grammar.js",
		"grammar/dutch": "./grammar/dutch/index.js",
		"grammar/latin": "./grammar/latin/index.js",
		"grammar/units": "./grammar/units/index.js",
		"ensure-native": "./scripts/ensure-native.ts",
	}],
	exports: {
		enabled: true,
		packageJson: true,
		legacy: true,
		customExports(exports, { pkg, chunks, isPublish }) {
			console.log("<INITIAL_TSDOWN_EXPORTS>\n", exports, "\n</INITIAL_TSDOWN_EXPORTS>");
			console.log("<exports[\"./grammar/units\"]>\n", exports["./grammar/units"], "\n</exports[\"./grammar/units\"]>");
			console.log("<PACKAGE_JSON>\n", pkg, "\n</PACKAGE_JSON>");
			console.log("<CHUNKS>\n", JSON.stringify(chunks).substring(0, 1000), "\n</CHUNKS>");
			console.log("<IS_PUBLISH>\n", isPublish, "\n</IS_PUBLISH>");
			// tsdown emits bare `"./dist/x.js"` strings with no `types`
			// condition (despite `dts: true`), so attach each generated
			// `.d.ts` explicitly — otherwise consumers fall back on implicit
			// adjacent-`.d.ts` resolution that only some moduleResolution
			// modes honour.
			exports["."] = {
				types: "./dist/index.d.ts",
				default: "./dist/index.js",
			};
			exports["./grammar"] = {
				types: "./dist/grammar.d.ts",
				default: "./dist/grammar.js",
			};
			exports["./grammar/dutch"] = {
				types: "./dist/grammar/dutch.d.ts",
				default: "./dist/grammar/dutch.js",
			};
			exports["./grammar/latin"] = {
				types: "./dist/grammar/latin.d.ts",
				default: "./dist/grammar/latin.js",
			};
			exports["./grammar/units"] = {
				types: "./dist/grammar/units.d.ts",
				default: "./dist/grammar/units.js",
			};
			exports["./grammar/*"] = "./dist/grammar/*";
			exports["./binding.gyp"] = "./binding.gyp";
			exports["./queries/*"] = "./queries/*";
			exports["./test/{highlight,fixtures}/*.recipe"] = "./test/{highlight,fixtures}/*.recipe";
			exports["./tree-sitter-recipe.wasm"] = "./tree-sitter-recipe.wasm";
			exports["./tree-sitter.json"] = "./tree-sitter.json";
			exports["./src/*"] = "./src/*";
			console.log(exports);
			return exports;
		},
	},
	dts: true,
	clean: true,
	treeshake: true,
	unbundle: false,
	sourcemap: false,
	hash: false,
	platform: "node",
	fixedExtension: false,
	deps: {
		neverBundle: ["tree-sitter", "tree-sitter-cli"],
		alwaysBundle: [],
		onlyBundle: [],
		skipNodeModulesBundle: false,
	},
	onSuccess: "bun fmt",
} satisfies UserConfig;

export default defineConfig(config);
