/**
 * @file Pharmacological prescription notation (Dutch/Latin)
 * @author Kaj Kowalski <info@kajkowalski.nl>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
	name: "prescription",

	extras: _ => [/\s/],

	word: $ => $.identifier,

	rules: {
		source_file: $ => repeat($.prescription),

		prescription: $ =>
			seq(
				$.recipe_section,
				optional($.da_section),
				$.signa_section,
			),

		// R/ section: marker followed by one or more recipe body lines
		recipe_section: $ =>
			seq(
				$.recipe_marker,
				repeat1($.recipe_body_line),
			),

		recipe_marker: _ => "R/",

		recipe_body_line: $ =>
			choice(
				$.mf_directive,
				$.ingredient,
			),

		// Drug name: one or more words
		ingredient: $ =>
			seq(
				field("drug", $.drug_name),
				optional(field("dose", $.dose)),
			),

		drug_name: $ =>
			prec.left(repeat1(choice(
				$.identifier,
				$.form_word,
			))),

		form_word: _ =>
			choice(
				"tablet",
				"tablets",
				"tabletten",
				"caps",
				"capsule",
				"capsulae",
				"ung",
				"unguentum",
			),

		// Dose can be: percentage, weight/volume, ad/aa quantity, or q.s. alone
		dose: $ =>
			choice(
				$.concentration,
				$.amount,
				$.ad_quantity,
				$.qs_ad_quantity,
				$.aa_quantity,
				alias("q.s.", "qs_alone"),
			),

		concentration: $ => seq($.number, "%"),
		amount: $ => seq($.number, optional($.dose_unit)),
		ad_quantity: $ => seq("ad", $.number, optional($.dose_unit)),
		qs_ad_quantity: $ => seq("q.s.", optional("ad"), $.number, optional($.dose_unit)),
		aa_quantity: $ => seq("aa", $.number, optional($.dose_unit)),

		// mf [preparation_form] [dtd_spec]
		mf_directive: $ =>
			seq(
				alias("mf", "keyword_mf"),
				$.preparation_form,
				optional($.dtd_spec),
			),

		preparation_form: _ =>
			choice(
				alias("caps", "form_capsule"),
				alias("capsule", "form_capsule"),
				alias("capsulae", "form_capsule"),
				alias("cap", "form_capsule"),
				alias("tabs", "form_tablet"),
				alias("tablet", "form_tablet"),
				alias("tabletten", "form_tablet"),
				alias("tab", "form_tablet"),
				alias("ung", "form_ointment"),
				alias("unguentum", "form_ointment"),
				alias("cremor", "form_cream"),
				alias("sol", "form_solution"),
				alias("solutio", "form_solution"),
				alias("pulv", "form_powder"),
				alias("pulvis", "form_powder"),
				alias("syr", "form_syrup"),
				alias("syrupus", "form_syrup"),
				alias("supp", "form_suppository"),
				alias("suppositorium", "form_suppository"),
				alias("gtt", "form_drops"),
				alias("drops", "form_drops"),
				alias("druppels", "form_drops"),
			),

		dtd_spec: $ =>
			seq(
				alias("dtd", "keyword_dtd"),
				optional(seq(
					choice("no", "no."),
					$.integer,
				)),
			),

		// Da/ section (optional): dispense quantity
		da_section: $ =>
			seq(
				$.da_marker,
				field("quantity", $.quantity),
			),

		da_marker: _ => token(choice("Da/", "da/", "D/", "d/")),

		quantity: $ =>
			seq(
				$.number,
				optional($.quantity_unit),
			),

		// S/ section: marker followed by instruction tokens
		signa_section: $ =>
			seq(
				$.signa_marker,
				repeat1($.signa_token),
			),

		signa_marker: _ => "S/",

		// Signa tokens: structured (frequency, timing, route, warning) or free text
		signa_token: $ =>
			choice(
				$.frequency,
				$.timing,
				$.administration,
				$.warning,
				$.identifier,
			),

		// TODO: User contribution point
		// Modify this rule to control which Latin abbreviations get structured AST nodes
		// vs. falling through as plain identifiers. Current: all are structured.

		frequency: $ =>
			seq(
				$.integer,
				choice($.dd_kw, $.x_kw),
				optional($.daags_kw),
			),

		dd_kw: _ => alias("dd", "dd"),
		x_kw: _ => alias("x", "times"),
		daags_kw: _ => alias("daags", "daily"),

		timing: _ =>
			choice(
				alias("a.c.", "before_meal"),
				alias("p.c.", "after_meal"),
				alias("a.n.", "before_night"),
				alias("z.n.", "as_needed"),
				alias("s.o.s.", "as_needed"),
				alias("p.r.n.", "as_needed"),
				alias("mane", "morning"),
				alias("nocte", "night"),
				alias("stat", "immediately"),
				seq("si", "nec"),
			),

		administration: _ =>
			choice(
				alias("s.c.", "subcutaneous"),
				alias("i.m.", "intramuscular"),
				alias("i.v.", "intravenous"),
				alias("subling.", "sublingual"),
				alias("o.d.", "right_eye"),
				alias("o.s.", "left_eye"),
			),

		warning: _ =>
			choice(
				alias("d.c.p.", "give_with_prohibition"),
				alias("CITO", "urgent"),
				alias("PIM", "danger_if_delayed"),
				alias("non rep.", "no_repeats"),
			),

		// Terminal tokens
		dose_unit: _ =>
			choice(
				"mg",
				"g",
				"ml",
				"l",
				"mcg",
				"IU",
				"IE",
			),

		quantity_unit: _ =>
			choice(
				"mg",
				"g",
				"ml",
				"l",
				"mcg",
				"IU",
				"IE",
			),

		number: _ => /[0-9]+([.,][0-9]+)?/,
		integer: _ => /[0-9]+/,
		identifier: _ => /[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9_'-]*/,
	},
});
