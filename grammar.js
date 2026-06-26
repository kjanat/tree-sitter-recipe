/**
 * # Tree-sitter grammar for pharmacological recipe notation.
 *
 * Parses classical prescription format with three sections:
 * - **R/** (Recipe) — ingredient lines with doses, units, and Latin abbreviations
 * - **Da/** (Detur Ad) — dispensing instructions to the pharmacist
 * - **S/** (Signa) — patient-facing usage directions
 *
 * Latin abbreviations are grouped by semantic role (route, timing, frequency,
 * dispensing, compounding, conditional, warning, form) as a supertype
 * `latin_abbrev` with concrete subtypes, enabling category-aware highlighting.
 *
 * @example
 * ```recipe
 * R/  Amoxicilline 500 mg caps
 *     d.t.d. no 21
 * Da/ m.f. caps
 * S/  3 dd 1 caps p.o. a.c.
 * ```
 *
 * @see {@link https://github.com/kjanat/tree-sitter-recipe}
 * @author Kaj Kowalski <info@kajkowalski.nl>
 * @module grammar
 * @license MIT
 */
/// <reference path="./node_modules/tree-sitter-cli/dsl.d.ts" />

import {
	DUTCH_COUNT_WORD_RE,
	DUTCH_FREQUENCY_TAIL_RE,
	DUTCH_FREQUENCY_UNIT_RE,
	DUTCH_INTERVAL_LEAD_RE,
	DUTCH_PERIOD_NOUN_RE,
} from "#grammar/dutch";
import {
	COMPOUNDING,
	COMPOUNDING_MULTIWORD_RE,
	CONDITIONAL,
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
} from "#grammar/latin";
import { UNITS } from "#grammar/units";

/** Recipe language tree-sitter grammar definition. */
export default grammar({
	name: "recipe",

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
		[$.rx_section],
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
				$.rx_section,
				$.dispense_section,
				$.signa_section,
			),

		rx_section: $ =>
			seq(
				$.rx_marker,
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
		rx_marker: _ => token(prec(4, /[Rr]\//)),
		dispense_marker: _ => token(prec(4, /[Dd][Aa]?\//)),
		signa_marker: _ => token(prec(4, /[Ss]\//)),

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
		frequency_abbrev: _ => choice(...FREQUENCY),
		timing_abbrev: _ => choice(...TIMING, token(prec(3, TIMING_MULTIWORD_RE))),
		route_abbrev: _ => choice(...ROUTE, token(prec(3, ROUTE_MULTIWORD_RE))),
		dispensing_abbrev: _ => choice(...DISPENSING, token(prec(3, DISPENSING_MULTIWORD_RE))),
		warning_abbrev: _ => choice(...WARNING),
		form_abbrev: _ => choice(...FORMS, token(prec(3, FORMS_MULTIWORD_RE))),
		compounding_abbrev: _ => choice(...COMPOUNDING, token(prec(3, COMPOUNDING_MULTIWORD_RE))),
		conditional_abbrev: _ => choice(...CONDITIONAL, token(prec(3, CONDITIONAL_MULTIWORD_RE))),

		// Frequency, field-labelled so a consumer reads dosing semantics off the
		// tree without re-parsing text. `count:` = how many doses, `every:` =
		// interval length, `period:` = the unit. One node spans prescriber
		// shorthand ("1 dd") and the Dutch patient-label prose a model emits.
		//   "3 keer per dag" -> (frequency count: (number)     period: (period))
		//   "driemaal daags" -> (frequency count: (count_word) period: (period))
		//   "om de 8 uur"    -> (frequency every: (number)     period: (period))
		//   "om de dag"      -> (frequency period: (period))
		frequency: $ =>
			choice(
				// digit count: "3 dd", "3 keer per dag", "1x daags", "2 maal per week"
				seq(field("count", $.number), field("period", $.period)),
				// spelled count: "driemaal daags", "eenmaal per dag", "tweemaal"
				seq(
					field("count", $.count_word),
					optional(field("period", alias($._period_tail, $.period))),
				),
				// interval: "om de 8 uur", "om de 2 dagen", "om de [andere] dag"
				seq(
					$._interval_lead,
					optional(field("every", $.number)),
					field("period", alias($._period_noun, $.period)),
				),
			),

		// Cadence following a digit count: "dd", "keer per dag", "x daags".
		period: _ => token(prec(3, DUTCH_FREQUENCY_UNIT_RE)),
		// Spelled-out count "driemaal" — own node so it shares the `count:` role
		// with `number` while staying a distinct type. Maps to an int downstream.
		count_word: _ => token(prec(3, DUTCH_COUNT_WORD_RE)),
		// Cadence after a spelled count ("driemaal DAAGS"); aliased to `period`.
		_period_tail: _ => token(prec(3, DUTCH_FREQUENCY_TAIL_RE)),
		// "om de" / "om de andere" — hidden interval marker; fields carry meaning.
		_interval_lead: _ => token(prec(3, DUTCH_INTERVAL_LEAD_RE)),
		// Bare period noun for intervals ("8 UUR", "2 DAGEN"); aliased to `period`.
		_period_noun: _ => token(prec(2, DUTCH_PERIOD_NOUN_RE)),

		// Dose = number + unit. Extras swallow whitespace between, so
		// "50mg", "50 mg", "0,1%", "100 g" all parse.
		dose: $ => seq($.number, $.unit),
		unit: _ => choice(...UNITS),

		// "ad 100 g" — compound fill-to-total
		fill_to: $ => seq(alias("ad", "fill_marker"), $.dose),

		// "dtd no 90", "d.t.d. no 14", "dtd 14"
		dtd_directive: $ =>
			seq(
				alias(choice("dtd", "d.t.d."), "dtd_keyword"),
				optional(alias("no", "dtd_no")),
				$.number,
			),

		number: _ => /\d+([.,]\d+)?/,
		word: _ => /[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9-]*/,
		// `.` — Dutch sentence terminators ("sachet à 4 g.").
		// `-` — dose ranges ("1-2 tabletten"). Inside drug names the dash is
		// already absorbed by the `word` rule via its own character class, so
		// `N-acetylcysteïne` still tokenizes as a single word (longer match).
		// Safe despite dotted abbreviations: `b.d.d.`, `m.f.`, `gtt aur.` all
		// tokenize as longer atomic tokens and beat a bare `.` by longest-
		// match. `\d+([.,]\d+)?` in `number` consumes the decimal dot before
		// `punctuation` sees it.
		punctuation: _ => /[-.,;:()]/,

		// Layered comment system; all in extras so they appear in the AST as
		// siblings but impose no structural constraint. Downstream tools
		// (highlighter, LSP, doc-gen) associate doc variants with the next
		// section via position.
		line_comment: _ => token(seq("#", /[^\n]*/)),
		doc_comment_line: _ => token(prec(1, seq("#!", /[^\n]*/))),
		block_comment: _ => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
		doc_comment_block: _ => token(prec(1, seq("/**", /[^*]*\*+([^/*][^*]*\*+)*/, "/"))),

		_newline: _ => /\r?\n/,
	},
});
