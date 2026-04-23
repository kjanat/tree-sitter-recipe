/// <reference types="node" />

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";
import { defineConfig } from "tsdown";
import ts from "typescript";

const SELF_TYPED_JS_EXTENSIONS = new Set([".js", ".mjs", ".cjs"]);

function injectSelfTypes(dir: string) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			injectSelfTypes(fullPath);
		} else if (entry.isFile()) {
			const { name, ext } = parse(entry.name);
			if (!SELF_TYPED_JS_EXTENSIONS.has(ext) || name.endsWith(".d")) continue;

			const dtsName = `${name}.d.ts`;
			if (existsSync(join(dir, dtsName))) {
				const content = readFileSync(fullPath, "utf8");
				if (!content.startsWith("/* @ts-self-types=")) {
					writeFileSync(fullPath, `/* @ts-self-types="./${dtsName}" */\n${content}`);
				}
			}
		}
	}
}

function generateGrammarRuleNames() {
	const sourcePath = "./grammar.ts";
	const generatedPath = "./grammar/generated/recipe-rule-names.ts";
	const sourceText = readFileSync(sourcePath, "utf8");
	const sourceFile = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const ruleNames: string[] = [];

	const visit = (node: ts.Node) => {
		if (
			ts.isPropertyAssignment(node)
			&& ts.isIdentifier(node.name)
			&& node.name.text === "rules"
			&& ts.isObjectLiteralExpression(node.initializer)
		) {
			for (const property of node.initializer.properties) {
				if (
					!ts.isPropertyAssignment(property) && !ts.isMethodDeclaration(property)
					&& !ts.isShorthandPropertyAssignment(property)
				) continue;
				const propertyName = property.name;
				if (ts.isIdentifier(propertyName) || ts.isStringLiteral(propertyName)) {
					ruleNames.push(propertyName.text);
				}
			}
		}

		ts.forEachChild(node, visit);
	};

	visit(sourceFile);

	if (ruleNames.length === 0) {
		throw new Error(`Could not find grammar rule names in ${sourcePath}`);
	}

	const generatedText = [
		"/**",
		" * Generated from grammar.ts.",
		" * Do not edit manually.",
		" */",
		"export type RecipeGrammarRuleName =",
		...ruleNames.map(ruleName => `\t| ${JSON.stringify(ruleName)}`),
		";",
		"",
	].join("\n");

	writeFileSync(generatedPath, generatedText);
}

export default defineConfig({
	entry: [
		{
			"grammar": "./grammar.ts",
			"grammar/*": ["./grammar/*/index.ts"],
		},
	],
	copy: [
		"package.json",
		"bindings/node/{index.{js,d.ts},binding.cc}",
		{ from: "src", to: "dist", flatten: false },
		{ from: "queries", to: "dist", flatten: false },
	],
	outDir: "./dist",
	dts: true,
	clean: true,
	treeshake: true,
	unbundle: true,
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
	hooks: {
		"build:before": () => {
			generateGrammarRuleNames();
		},
		"build:done": () => {
			injectSelfTypes("./dist");
		},
	},
	"onSuccess": "bun fmt",
});
