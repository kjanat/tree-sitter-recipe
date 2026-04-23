/* @ts-self-types="./index.d.ts" */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { dlopen } from "node:process";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.resolve("tree-sitter-recipe/package.json")));
const require = createRequire(join(root, "package.json"));

const nativePath = join(root, "prebuilds", `${process.platform}-${process.arch}`, "tree-sitter-recipe.node");

let binding;
if (typeof process.versions.bun === "string") {
	const module = { exports: {} };
	dlopen(module, nativePath);
	binding = module.exports;
} else {
	binding = require("node-gyp-build")(root);
}

try {
	binding.nodeTypeInfo = JSON.parse(readFileSync(`${root}/src/node-types.json`, "utf8"));
} catch {}

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

export default binding;
