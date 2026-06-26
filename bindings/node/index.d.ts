import type { Language, NodeInfo } from "tree-sitter";

/**
 * The tree-sitter language object for this grammar.
 *
 * @see {@linkcode https://tree-sitter.github.io/node-tree-sitter/interfaces/Parser.Language.html Parser.Language}
 *
 * @example
 * import Parser from "tree-sitter";
 * import Recipe from "tree-sitter-recipe";
 *
 * const parser = new Parser();
 * parser.setLanguage(Recipe);
 */
declare const binding: {
	/**
	 * The language name.
	 */
	name: Language["name"];

	/**
	 * The inner language object.
	 * @private
	 */
	language: Language;

	/**
	 * The content of the `node-types.json` file for this grammar.
	 *
	 * @see {@linkplain https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types Static Node Types}
	 */
	nodeTypeInfo: NodeInfo[];

	/** The syntax highlighting query for this grammar. */
	HIGHLIGHTS_QUERY?: string;

	/** The language injection query for this grammar. */
	INJECTIONS_QUERY?: string;

	/** The local variable query for this grammar. */
	LOCALS_QUERY?: string;

	/** The symbol tagging query for this grammar. */
	TAGS_QUERY?: string;
};

/**
 * Plain grammar metadata — the same shape as the default export minus the
 * native {@linkcode Language} object. For consumers that only want the name,
 * static node-type info, or the query paths declared in `tree-sitter.json`,
 * without loading the native addon.
 */
declare const construct: {
	/** The language name. */
	name: Language["name"];

	/**
	 * The content of the `node-types.json` file for this grammar.
	 *
	 * @see {@linkplain https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types Static Node Types}
	 */
	nodeTypeInfo: NodeInfo[];

	/** The syntax highlighting query path(s) for this grammar. */
	HIGHLIGHTS_QUERY?: string | string[];

	/** The language injection query path(s) for this grammar. */
	INJECTIONS_QUERY?: string | string[];

	/** The local variable query path(s) for this grammar. */
	LOCALS_QUERY?: string | string[];

	/** The symbol tagging query path(s) for this grammar. */
	TAGS_QUERY?: string | string[];
};

export { binding, binding as default, construct };
