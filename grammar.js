/**
 * @file Pharmacological prescription notation
 * @author Kaj Kowalski <info@kajkowalski.nl>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
	name: "prescription",

	rules: {
		// TODO: add the actual grammar rules
		source_file: $ => "hello",
	},
});
