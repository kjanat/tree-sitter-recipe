/**
 * @file Pharmacological prescription notation
 * @author Kaj Kowalski <info@kajkowalski.nl>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

import {
	COMPOUNDING,
	CONDITIONAL_MULTIWORD_RE,
	DISPENSING,
	DISPENSING_MULTIWORD_RE,
	FORMS,
	FORMS_MULTIWORD_RE,
	FREQUENCY,
	ROUTE,
	ROUTE_MULTIWORD_RE,
	TIMING,
	TIMING_MULTIWORD_RE,
	WARNING,
} from "./grammar/latin/index.js";
import { UNITS } from "./grammar/units/index.js";

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

	// `latin_abbrev` is a supertype — queries can target either the
	// supertype ((latin_abbrev) @foo) or the concrete category
	// ((route_abbrev) @bar). AST emits the concrete subtype.
	supertypes: $ => [$.latin_abbrev],

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

		// Supertype of all Latin abbreviation categories. Body is a pure
		// choice of concrete rule refs per tree-sitter supertype rules.
		latin_abbrev: $ =>
			choice(
				$.frequency_abbrev,
				$.timing_abbrev,
				$.route_abbrev,
				$.dispensing_abbrev,
				$.warning_abbrev,
				$.form_abbrev,
				$.compounding_abbrev,
				$.conditional_abbrev,
			),

		// Plain string `choice(...)` lets tree-sitter's keyword extraction
		// (via the `word` directive) enforce word boundaries — so "aa" won't
		// eat the first two letters of "aanbrengen". Multiword regex alts can't
		// benefit from that and must still go through `token()`; they're
		// combined with the literals via an outer choice where present.
		frequency_abbrev: $ => choice(...FREQUENCY),
		timing_abbrev: $ => choice(...TIMING, token(prec(3, TIMING_MULTIWORD_RE))),
		route_abbrev: $ => choice(...ROUTE, token(prec(3, ROUTE_MULTIWORD_RE))),
		dispensing_abbrev: $ => choice(...DISPENSING, token(prec(3, DISPENSING_MULTIWORD_RE))),
		warning_abbrev: $ => choice(...WARNING),
		form_abbrev: $ => choice(...FORMS, token(prec(3, FORMS_MULTIWORD_RE))),
		compounding_abbrev: $ => choice(...COMPOUNDING),
		conditional_abbrev: $ => token(prec(3, CONDITIONAL_MULTIWORD_RE)),

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
		// `.` — Dutch sentence terminators ("sachet à 4 g.").
		// `-` — dose ranges ("1-2 tabletten"). Inside drug names the dash is
		// already absorbed by the `word` rule via its own character class, so
		// `N-acetylcysteïne` still tokenizes as a single word (longer match).
		// Safe despite dotted abbreviations: `b.d.d.`, `m.f.`, `gtt aur.` all
		// tokenize as longer atomic tokens and beat a bare `.` by longest-
		// match. `\d+([.,]\d+)?` in `number` consumes the decimal dot before
		// `punctuation` sees it.
		punctuation: $ => /[-.,;:()]/,

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
