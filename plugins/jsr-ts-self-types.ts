/**
 * A {@link https://rolldown.rs/ | Rolldown} / {@link https://tsdown.dev/ | tsdown}
 * plugin that prepends a `@ts-self-types` pragma to every emitted JavaScript
 * chunk that ships next to a sibling `.d.ts` declaration in the same bundle.
 *
 * @remarks
 * {@link https://jsr.io/ | JSR} (Deno's package registry) enforces a
 * {@link https://jsr.io/docs/about-slow-types | "no slow types"} rule for
 * packages that want full TypeScript support across all consumers (Deno, Node,
 * browsers, Bun). When a package ships a `.js` file alongside a hand-authored
 * or generated `.d.ts` file, JSR has no way of knowing the two belong together
 * unless the `.js` file declares it explicitly via the
 * {@link https://jsr.io/docs/about-slow-types#typescript-comment-pragma | `@ts-self-types` pragma}:
 *
 * ```js
 * /* @ts-self-types="./grammar.d.ts" *\/
 * module.exports = grammar({ ... });
 * ```
 *
 * The plugin operates inside Rolldown's `generateBundle` hook, mutating each
 * JavaScript chunk's `code` field in memory before the bundle is written to
 * disk. Sibling declaration files are discovered by looking up the
 * corresponding `.d.ts` entry in the same {@link OutputBundle} the hook
 * receives — there is no filesystem walk, no `existsSync`, no name-based
 * scanning of the output directory.
 *
 * The injection is idempotent: chunks whose code already begins with the
 * marker are skipped, so repeated builds (e.g. watch mode) and configurations
 * that emit several outputs do not produce duplicated headers.
 *
 * @example Basic usage in `tsdown.config.ts`
 * ```ts
 * import { defineConfig } from "tsdown";
 * import jsrTsSelfTypes from "./plugins/jsr-ts-self-types.ts";
 *
 * export default defineConfig({
 *   entry: ["./src/index.ts"],
 *   dts: true,
 *   plugins: [jsrTsSelfTypes()],
 * });
 * ```
 *
 * @module
 */

import type { OutputBundle, Plugin } from "rolldown";

/**
 * File extensions the plugin recognises as JavaScript output. A chunk whose
 * `fileName` does not end in one of these is left alone, even if a sibling
 * `.d.ts` happens to exist in the bundle.
 */
const SELF_TYPED_JS_EXTENSIONS: readonly [".js", ".mjs", ".cjs"] = [
	".js",
	".mjs",
	".cjs",
];

/**
 * Marker prefix written into emitted chunks. Used both as the literal that
 * gets prepended and as the test for "already processed" so the two stay in
 * sync.
 */
const SELF_TYPES_MARKER = "/* @ts-self-types=" as const;

/**
 * Returns the JS extension a `fileName` ends with, or `null` if none of the
 * recognised extensions match.
 */
function jsExtension(fileName: string): (typeof SELF_TYPED_JS_EXTENSIONS)[number] | null {
	for (const ext of SELF_TYPED_JS_EXTENSIONS) {
		if (fileName.endsWith(ext)) return ext;
	}
	return null;
}

/**
 * Mutates `bundle` in place: for every JS chunk that has a sibling declaration
 * file in the same bundle, prepend the `@ts-self-types` pragma to its code.
 *
 * @internal
 */
function injectIntoBundle(bundle: OutputBundle): void {
	for (const fileName in bundle) {
		const item = bundle[fileName];
		if (!item || item.type !== "chunk") continue;

		const ext = jsExtension(fileName);
		if (ext === null) continue;

		const dtsFileName = `${fileName.slice(0, -ext.length)}.d.ts`;
		if (!(dtsFileName in bundle)) continue;

		if (item.code.startsWith(SELF_TYPES_MARKER)) continue;

		const slashIdx = dtsFileName.lastIndexOf("/");
		const dtsBasename = slashIdx >= 0
			? dtsFileName.slice(slashIdx + 1)
			: dtsFileName;

		item.code = `${SELF_TYPES_MARKER}"./${dtsBasename}" */\n${item.code}`;
	}
}

/**
 * Creates the JSR self-types injector plugin.
 *
 * @returns A Rolldown {@link Plugin} ready to be placed in the `plugins`
 *   array of a Rolldown or tsdown config.
 *
 * @example
 * ```ts
 * import jsrTsSelfTypes from "./plugins/jsr-ts-self-types.ts";
 *
 * export default {
 *   plugins: [jsrTsSelfTypes()],
 * };
 * ```
 */
export default function jsrTsSelfTypes(): Plugin {
	return {
		name: "jsr-ts-self-types",
		generateBundle(_outputOptions, bundle): void {
			injectIntoBundle(bundle);
		},
	};
}
