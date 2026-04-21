/**
 * @file Pharmacological prescription notation
 * @author Kaj Kowalski <info@kajkowalski.nl>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import { LATIN_ABBREVS, MULTIWORD_ABBREV_RE } from "./grammar/latin.js";
import { UNITS } from "./grammar/units.js";

export default grammar({
	name: "prescription",

	// Enables context-sensitive keyword promotion so "ad", "dtd", "no" etc.
	// are recognized as keywords only when they appear as complete words.
	word: $ => $.word,

	extras: $ => [
		/[ \t]+/,
		$.line_comment,
		$.block_comment,
		$.doc_comment_line,
		$.doc_comment_block,
	],

	// LR(1) can't tell if a newline after an ingredient_line continues the
	// section (next atom is ingredient) or ends it (next token is a marker).
	// Declaring the conflict lets tree-sitter's GLR look ahead far enough to
	// disambiguate at parse time.
	conflicts: $ => [
		[$.recipe_section],
		[$.signa_section],
	],

	rules: {
		source_file: $ => repeat(choice($._section, $._newline)),

		_section: $ =>
			choice(
				$.recipe_section,
				$.dispense_section,
				$.signa_section,
			),

		recipe_section: $ =>
			seq(
				$.recipe_marker,
				$.ingredient_line,
				repeat(seq($._newline, $.ingredient_line)),
			),
		dispense_section: $ => seq($.dispense_marker, $.dispense_body),
		signa_section: $ =>
			seq(
				$.signa_marker,
				$.signa_line,
				repeat(seq($._newline, $.signa_line)),
			),

		// Case-insensitive markers: R/, r/, Da/, da/, D/, d/, S/, s/
		recipe_marker: $ => token(prec(4, /[Rr]\//)),
		dispense_marker: $ => token(prec(4, /[Dd][Aa]?\//)),
		signa_marker: $ => token(prec(4, /[Ss]\//)),

		ingredient_line: $ => repeat1($._atom),
		dispense_body: $ => repeat1($._atom),
		signa_line: $ => repeat1($._atom),

		_atom: $ =>
			choice(
				$.latin_abbrev,
				$.frequency,
				$.dtd_directive,
				$.fill_to,
				$.dose,
				$.number,
				$.word,
				$.punctuation,
			),

		latin_abbrev: $ =>
			choice(
				token(prec(3, choice(...LATIN_ABBREVS))),
				token(prec(3, MULTIWORD_ABBREV_RE)),
			),

		// Compact modern frequency: "1 dd", "2 dd", "1dd" — caveman speak for dosing.
		frequency: $ => token(prec(3, /[1-9]\s*dd/)),

		// Dose = number + unit. Extras swallow whitespace between, so
		// "50mg", "50 mg", "0,1%", "100 g" all parse.
		dose: $ => seq($.number, $.unit),
		unit: $ => choice(...UNITS),

		// "ad 100 g" — compound fill-to-total
		fill_to: $ => seq(alias("ad", "fill_marker"), $.dose),

		// "dtd no 90", "d.t.d. no 14", "dtd 14"
		dtd_directive: $ =>
			seq(
				alias(choice("dtd", "d.t.d."), "dtd_keyword"),
				optional(alias("no", "dtd_no")),
				$.number,
			),

		number: $ => /\d+([.,]\d+)?/,
		word: $ => /[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\-]*/,
		punctuation: $ => /[,;:()]/,

		// Layered comment system; all in extras so they appear in the AST as
		// siblings but impose no structural constraint. Downstream tools
		// (highlighter, LSP, doc-gen) associate doc variants with the next
		// section via position.
		line_comment: $ => token(seq("#", /[^\n]*/)),
		doc_comment_line: $ => token(prec(1, seq("#!", /[^\n]*/))),
		block_comment: $ => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
		doc_comment_block: $ => token(prec(1, seq("/**", /[^*]*\*+([^/*][^*]*\*+)*/, "/"))),

		_newline: $ => /\r?\n/,
	},
});
