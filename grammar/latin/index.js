/**
 * @file Barrel for Latin abbreviation vocabulary, grouped by semantic role.
 *
 * Each category exports its own list so downstream tooling (highlight queries,
 * linters, LSP) can reason about abbreviations semantically — e.g. a formatter
 * that normalizes only frequencies, or a linter that flags a dispensing
 * abbreviation without an accompanying quantity.
 *
 * Single-word entries go into LATIN_ABBREVS; multi-word entries feed the
 * regex so "gtt  aur." (variable spacing) still tokenizes.
 * @license MIT
 */

import { CONDITIONAL_MULTIWORD } from "./conditional.js";
import { DISPENSING, DISPENSING_MULTIWORD } from "./dispensing.js";
import { FORMS, FORMS_MULTIWORD } from "./forms.js";
import { FREQUENCY } from "./frequency.js";
import { ROUTE, ROUTE_MULTIWORD } from "./route.js";
import { TIMING, TIMING_MULTIWORD } from "./timing.js";
import { WARNING } from "./warning.js";

export {
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

// Atomic tokens — no embedded whitespace, fed to token(prec(3, choice(...))).
/** @type {readonly string[]} */
export const LATIN_ABBREVS = [
	...FREQUENCY,
	...TIMING,
	...ROUTE,
	...DISPENSING,
	...WARNING,
	...FORMS,
];

// Multi-word tokens — embedded whitespace. Escape dots, let \s+ absorb any
// whitespace run so "m.  et   v." still matches.
/**
 * @param {string} s
 * @returns {string}
 */
const toMultiwordPattern = s => s.replace(/\./g, "\\.").replace(/\s+/g, "\\s+");

/** @type {readonly string[]} */
export const MULTIWORD_ABBREVS = [
	...TIMING_MULTIWORD,
	...ROUTE_MULTIWORD,
	...DISPENSING_MULTIWORD,
	...FORMS_MULTIWORD,
	...CONDITIONAL_MULTIWORD,
];

/** @type {RegExp} */
export const MULTIWORD_ABBREV_RE = new RegExp(
	MULTIWORD_ABBREVS.map(toMultiwordPattern).join("|"),
);
