/**
 * @file Barrel for dose-unit vocabulary, grouped by measurement kind.
 *
 * Split allows downstream tooling to distinguish continuous quantities
 * (mass, volume) from discrete counts (countable) and biological potency
 * (activity). A linter could, for example, warn when `%` appears on a
 * tablet prescription.
 * @license MIT
 */

import { default as ACTIVITY } from "./activity.js";
import { default as COUNTABLE } from "./countable.js";
import { default as MASS } from "./mass.js";
import { default as RATE } from "./rate.js";
import { default as VOLUME } from "./volume.js";

export { ACTIVITY, COUNTABLE, MASS, RATE, VOLUME };

// `RATE` first so longest-match prefers `mg/ml` over bare `mg`. Tree-sitter's
// lexer already picks the longest match regardless of order, but the ordering
// makes the intent explicit and survives future edits.
/** @type {readonly string[]} */
export const UNITS = [
	...RATE,
	...MASS,
	...VOLUME,
	...ACTIVITY,
	...COUNTABLE,
];
