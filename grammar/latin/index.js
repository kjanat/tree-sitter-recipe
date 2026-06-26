/**
 * Latin abbreviation vocabulary grouped by semantic role.
 *
 * Each category exports its own list so downstream tooling (highlight queries,
 * linters, LSP) can reason about abbreviations semantically. `grammar.js`
 * consumes the per-category exports directly — one rule per category —
 * letting consumers query either the supertype `latin_abbrev` or a concrete
 * category like `route_abbrev`.
 *
 * Multi-word categories get their own compiled regex so escaped dots and
 * flexible whitespace are compiled once, at generate time.
 *
 * @example
 * ```ts
 * import { ROUTE, TIMING, TIMING_MULTIWORD_RE } from "@kjanat/tree-sitter-recipe/grammar/latin";
 *
 * // Check if a token is a known route abbreviation
 * ROUTE.includes("i.v."); // true
 *
 * // Match multi-word timing phrases with flexible whitespace
 * TIMING_MULTIWORD_RE.test("m.  et   v."); // true
 * ```
 *
 * @module latin
 * @license MIT
 */

import { COMPOUNDING, COMPOUNDING_MULTIWORD } from "./compounding.ts";
import { CONDITIONAL, CONDITIONAL_MULTIWORD } from "./conditional.ts";
import { DISPENSING, DISPENSING_MULTIWORD } from "./dispensing.ts";
import { FORMS, FORMS_MULTIWORD } from "./forms.ts";
import { FREQUENCY } from "./frequency.ts";
import { ROUTE, ROUTE_MULTIWORD } from "./route.ts";
import { TIMING, TIMING_MULTIWORD } from "./timing.ts";
import { WARNING } from "./warning.ts";

export {
	COMPOUNDING,
	COMPOUNDING_MULTIWORD,
	CONDITIONAL,
	CONDITIONAL_MULTIWORD,
	DISPENSING,
	DISPENSING_MULTIWORD,
	FORMS,
	FORMS_MULTIWORD,
	FREQUENCY,
	ROUTE,
	ROUTE_MULTIWORD,
	TIMING,
	TIMING_MULTIWORD,
	WARNING,
};

/**
 * Escape backslashes and dots as regex metachars, expand whitespace runs into
 * `\s+` so irregular spacing ("m.  et   v.") still matches. Backslash is
 * escaped first so the escapes we add below are not doubled.
 * @param {string} s - Raw multiword abbreviation string
 * @returns {string} Regex-safe pattern
 */
const toMultiwordPattern = (s) => s.replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\s+/g, "\\s+");

/**
 * Compile a multiword-abbreviation list into a single alternation regex.
 * @param {readonly string[]} tokens - Multiword abbreviation strings
 * @returns {RegExp} Combined alternation pattern
 */
const buildMultiwordRegex = (tokens) => new RegExp(tokens.map(toMultiwordPattern).join("|"));

/** Pre-compiled regex for timing multiword abbreviations. @type {RegExp} */
const TIMING_MULTIWORD_RE = buildMultiwordRegex(TIMING_MULTIWORD);
/** Pre-compiled regex for route multiword abbreviations. @type {RegExp} */
const ROUTE_MULTIWORD_RE = buildMultiwordRegex(ROUTE_MULTIWORD);
/** Pre-compiled regex for dispensing multiword abbreviations. @type {RegExp} */
const DISPENSING_MULTIWORD_RE = buildMultiwordRegex(DISPENSING_MULTIWORD);
/** Pre-compiled regex for forms multiword abbreviations. @type {RegExp} */
const FORMS_MULTIWORD_RE = buildMultiwordRegex(FORMS_MULTIWORD);
/** Pre-compiled regex for conditional multiword abbreviations. @type {RegExp} */
const CONDITIONAL_MULTIWORD_RE = buildMultiwordRegex(CONDITIONAL_MULTIWORD);
/** Pre-compiled regex for compounding multiword abbreviations. @type {RegExp} */
const COMPOUNDING_MULTIWORD_RE = buildMultiwordRegex(COMPOUNDING_MULTIWORD);

export {
	COMPOUNDING_MULTIWORD_RE,
	CONDITIONAL_MULTIWORD_RE,
	DISPENSING_MULTIWORD_RE,
	FORMS_MULTIWORD_RE,
	ROUTE_MULTIWORD_RE,
	TIMING_MULTIWORD_RE,
};
