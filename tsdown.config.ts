/// <reference types="node" />

import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig, type UserConfig } from "tsdown";
import {
	createSourceFile,
	forEachChild,
	isIdentifier,
	isMethodDeclaration,
	isObjectLiteralExpression,
	isPropertyAssignment,
	isShorthandPropertyAssignment,
	isStringLiteral,
	ScriptKind,
	ScriptTarget,
} from "typescript";
import type { Node } from "typescript";
import jsrTsSelfTypes from "./plugins/jsr-ts-self-types.ts";

const root = import.meta.dirname;
const srcGrammarPath = `${root}/grammar.js` as const;
const grammarRuleNames = `${root}/grammar/generated/recipe-rule-names.ts` as const;

function generateGrammarRuleNames() {
	const sourcePath = srcGrammarPath;
	const generatedPath = grammarRuleNames;
	const sourceText = readFileSync(sourcePath, "utf8");
	const sourceFile = createSourceFile(
		sourcePath,
		sourceText,
		ScriptTarget.Latest,
		true,
		ScriptKind.TS,
	);
	const ruleNames: string[] = [];

	const visit = (node: Node) => {
		if (
			isPropertyAssignment(node)
			&& isIdentifier(node.name)
			&& node.name.text === "rules"
			&& isObjectLiteralExpression(node.initializer)
		) {
			for (const property of node.initializer.properties) {
				if (
					!isPropertyAssignment(property)
					&& !isMethodDeclaration(property)
					&& !isShorthandPropertyAssignment(property)
				) {
					continue;
				}
				const propertyName = property.name;
				if (isIdentifier(propertyName) || isStringLiteral(propertyName)) {
					ruleNames.push(propertyName.text);
				}
			}
		}

		forEachChild(node, visit);
	};

	visit(sourceFile);

	if (ruleNames.length === 0) {
		throw new Error(`Could not find grammar rule names in ${sourcePath}`);
	}

	const generatedText = `/**
 * Generated from ${srcGrammarPath}.
 * Do not edit manually.
 */
export type RecipeGrammarRuleName =
${ruleNames.map(ruleName => `\t| ${JSON.stringify(ruleName)}`).join("\n")};\n`;
	writeFileSync(generatedPath, generatedText);
}

// This is the previously held shape.
// "exports": {
// 		".": {
// 			"types": "./dist/index.d.ts",
// 			"default": "./dist/index.js"
// 		},
// 		"./grammar.js": {
// 			"types": "./dist/grammar.d.ts",
// 			"default": "./dist/grammar.js"
// 		},
// 		"./grammar/latin": {
// 			"types": "./dist/grammar/latin/index.d.ts",
// 			"default": "./dist/grammar/latin/index.js"
// 		},
// 		"./grammar/units": {
// 			"types": "./dist/grammar/units/index.d.ts",
// 			"default": "./dist/grammar/units/index.js"
// 		},
// 		"./grammar/*.js": {
// 			"types": "./dist/grammar/*.d.ts",
// 			"default": "./dist/grammar/*.js"
// 		},
// 		"./queries/*": "./queries/*",
// 		"./test/fixtures/*": "./test/fixtures/*",
// 		"./test/highlight/*": "./test/highlight/*",
// 		"./package.json": "./package.json",
// 		"./tree-sitter.json": "./tree-sitter.json",
// 		"./binding.gyp": "./binding.gyp"
// 	},

const deps = {
	neverBundle: ["tree-sitter", "tree-sitter-cli"],
	alwaysBundle: [],
	onlyBundle: [],
	skipNodeModulesBundle: false,
} satisfies UserConfig["deps"];

// const hooks = {
// 	"build:before": () => {
// 		generateGrammarRuleNames();
// 	},
// } satisfies UserConfig["hooks"];

const config = {
	plugins: [jsrTsSelfTypes()],
	entry: [
		{
			"index": "./bindings/node/index",
			"grammar": srcGrammarPath,
			"grammar/latin": "./grammar/latin/index.js",
			// "grammar/latin/*": ["./grammar/latin/**/*.ts", "!./grammar/latin/index.js"],
			"grammar/units": "./grammar/units/index.js",
			// "grammar/units/*": ["./grammar/units/**/*.ts", "!./grammar/units/index.js"],
		},
	],
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
			// exports["."] = {
			// 	types: "./bindings/node/index.d.ts",
			// 	default: "./bindings/node/index.js",
			// };
			exports["./grammar"] = {
				types: "./dist/grammar.d.ts",
				default: "./dist/grammar.js",
			};
			exports["./grammar/*"] = "./dist/grammar/*";
			// exports["./grammar/latin"] = {
			// 	types: "./dist/grammar/latin/index.d.ts",
			// 	default: exports["./grammar/latin"],
			// };
			// exports["./grammar/units"] = {
			// 	types: "./dist/grammar/units/index.d.ts",
			// 	default: exports["./grammar/units"],
			// };
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
	deps,
	// hooks,
	onSuccess: "bun fmt",
} satisfies UserConfig;

export default defineConfig(config);
