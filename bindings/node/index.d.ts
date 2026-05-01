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

export default binding;
