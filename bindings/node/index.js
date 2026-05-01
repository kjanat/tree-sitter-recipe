/* @ts-self-types="./index.d.ts" */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { dlopen } from "node:process";
import { fileURLToPath } from "node:url";
import nodeTypes from "tree-sitter-recipe/src/node-types.json" with { type: "json" };
import tsJson from "tree-sitter-recipe/tree-sitter.json" with { type: "json" };
const root = dirname(fileURLToPath(import.meta.resolve("tree-sitter-recipe/package.json")));
const require = createRequire(join(root, "package.json"));

/**
 * @typedef {import("tree-sitter").Language} Language
 * @typedef {import("tree-sitter").NodeInfo} NodeInfo
 * @typedef { "HIGHLIGHTS_QUERY" | "INJECTIONS_QUERY" | "LOCALS_QUERY" | "TAGS_QUERY" } QueryKey
 * @typedef {typeof import("./index.d.ts").default} Binding
 */

const nativePath = join(root, "prebuilds", `${process.platform}-${process.arch}`, "tree-sitter-recipe.node");

const recipeGrammar = tsJson.grammars.find(g => g.name === "recipe");
if (!recipeGrammar) throw new Error("'recipe' grammar not declared in tree-sitter.json");
console.debug(`Scope is: ${recipeGrammar.scope}`);

/** @type {Binding} */
let binding;
if (typeof process.versions.bun === "string") {
	const module = { exports: {} };
	dlopen(module, nativePath);
	binding = /** @type {Binding} */ (module.exports);
} else {
	binding = require("node-gyp-build")(root);
}

/**
 * The tree-sitter language object for this grammar.
 *
 * @see {@linkcode https://tree-sitter.github.io/node-tree-sitter/interfaces/Parser.Language.html Parser.Language}
 *
 * @example
 * ```js
 * import Parser from "tree-sitter";
 * import Recipe from "tree-sitter-recipe";
 *
 * const parser = new Parser();
 * parser.setLanguage(Recipe);
 * ```
 *
 * @type {{
 *   name: Language["name"],
 *   nodeTypeInfo: NodeInfo[],
 *   HIGHLIGHTS_QUERY?: string | string[],
 *   INJECTIONS_QUERY?: string | string[],
 *   LOCALS_QUERY?: string | string[],
 *   TAGS_QUERY?: string | string[],
 * }}
 */
const construct = {
	/** The language name. */
	name: recipeGrammar.name,

	/**
	 * The content of the `node-types.json` file for this grammar.
	 * @type {NodeInfo[]}
	 * @see {@linkplain https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types Static Node Types}
	 */
	nodeTypeInfo: convertToNodeInfo(nodeTypes),
	/* try { binding.nodeTypeInfo = JSON.parse(readFileSync(`${root}/src/node-types.json`, "utf8")) } catch {} */

	/** The syntax highlighting query for this grammar. */
	HIGHLIGHTS_QUERY: recipeGrammar.highlights,

	/** The language injection query for this grammar. */
	INJECTIONS_QUERY: recipeGrammar.injections,

	/** The local variable query for this grammar. */
	LOCALS_QUERY: recipeGrammar.locals,

	/** The symbol tagging query for this grammar. */
	TAGS_QUERY: recipeGrammar.tags,
};

binding.name = recipeGrammar.name;

/** @type {ReadonlyArray<readonly [QueryKey, string]>} */
const queries = [
	["HIGHLIGHTS_QUERY", `${root}/queries/highlights.scm`],
	["INJECTIONS_QUERY", `${root}/queries/injections.scm`],
	["LOCALS_QUERY", `${root}/queries/locals.scm`],
	["TAGS_QUERY", `${root}/queries/tags.scm`],
];

for (const [prop, path] of queries) {
	Object.defineProperty(binding, prop, {
		configurable: true,
		enumerable: true,
		get() {
			delete binding[prop];
			try {
				binding[prop] = readFileSync(path, "utf8");
			} catch {}
			return binding[prop];
		},
	});
}

/**
 * Converts raw tree-sitter node-types JSON to the {@linkcode construct.nodeTypeInfo | NodeInfo[]} format.
 *
 * @param {typeof nodeTypes} rawData - The content of node-types.json for this grammar.
 * @returns {NodeInfo[]} An array of NodeInfo objects representing the node types of the grammar.
 */
function convertToNodeInfo(rawData) {
	return rawData.map(node => {
		const base = {
			type: node.type,
			named: node.named,
		};

		// Scenario 1: It's a supertype (contains subtypes)
		if (node.subtypes) {
			return {
				...base,
				subtypes: node.subtypes.map(s => ({ type: s.type, named: s.named })),
			};
		}

		// Scenario 2: It's a leaf node (contains no fields or children).
		// We ensure that 'fields' is an empty object and 'children' an empty array.
		return {
			...base,
			fields: node.fields || {},
			children: node.children
				? (Array.isArray(node.children) ? node.children : [node.children])
				: [],
		};
	});
}

export { binding, construct as default };
