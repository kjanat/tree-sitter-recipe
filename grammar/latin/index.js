/**
 * @file Barrel for Latin abbreviation vocabulary, grouped by semantic role.
 *
 * Each category exports its own list so downstream tooling (highlight queries,
 * linters, LSP) can reason about abbreviations semantically. grammar.js
 * consumes the per-category exports directly — one rule per category —
 * letting consumers query either the supertype `latin_abbrev` or a concrete
 * category like `route_abbrev`.
 *
 * Multi-word categories get their own compiled regex so escaped dots and
 * flexible whitespace are compiled once, at generate time.
 * @license MIT
 */

import { COMPOUNDING } from "./compounding.js";
import { CONDITIONAL_MULTIWORD } from "./conditional.js";
import { DISPENSING, DISPENSING_MULTIWORD } from "./dispensing.js";
import { FORMS, FORMS_MULTIWORD } from "./forms.js";
import { FREQUENCY } from "./frequency.js";
import { ROUTE, ROUTE_MULTIWORD } from "./route.js";
import { TIMING, TIMING_MULTIWORD } from "./timing.js";
import { WARNING } from "./warning.js";

export {
	COMPOUNDING,
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
 * Escape dots as regex metachars, expand any whitespace run into `\s+` so
 * irregular spacing ("m.  et   v.") still matches.
 * @param {string} s
 * @returns {string}
 */
const toMultiwordPattern = s => s.replace(/\./g, "\\.").replace(/\s+/g, "\\s+");

/**
 * Compile a multiword-abbreviation list into a single alternation regex.
 * @param {readonly string[]} tokens
 * @returns {RegExp}
 */
const buildMultiwordRegex = tokens => new RegExp(tokens.map(toMultiwordPattern).join("|"));

/** @type {RegExp} */
export const TIMING_MULTIWORD_RE = buildMultiwordRegex(TIMING_MULTIWORD);
/** @type {RegExp} */
export const ROUTE_MULTIWORD_RE = buildMultiwordRegex(ROUTE_MULTIWORD);
/** @type {RegExp} */
export const DISPENSING_MULTIWORD_RE = buildMultiwordRegex(DISPENSING_MULTIWORD);
/** @type {RegExp} */
export const FORMS_MULTIWORD_RE = buildMultiwordRegex(FORMS_MULTIWORD);
/** @type {RegExp} */
export const CONDITIONAL_MULTIWORD_RE = buildMultiwordRegex(CONDITIONAL_MULTIWORD);
