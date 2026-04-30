/**
 * Dose-unit vocabulary grouped by measurement kind.
 *
 * Split allows downstream tooling to distinguish continuous quantities
 * (mass, volume) from discrete counts (countable) and biological potency
 * (activity). A linter could, for example, warn when `%` appears on a
 * tablet prescription.
 *
 * @example
 * ```ts
 * import { UNITS, MASS, COUNTABLE } from "@kjanat/tree-sitter-recipe/grammar/units";
 *
 * // Check if a token is any known unit
 * UNITS.includes("mg"); // true
 *
 * // Or narrow to a specific measurement kind
 * MASS.includes("mg");      // true
 * COUNTABLE.includes("mg"); // false
 * ```
 *
 * @module units
 * @license MIT
 */

import { default as ACTIVITY } from "./activity";
import { default as COUNTABLE } from "./countable";
import { default as MASS } from "./mass";
import { default as RATE } from "./rate";
import { default as VOLUME } from "./volume";

export { ACTIVITY, COUNTABLE, MASS, RATE, VOLUME };

/**
 * All units aggregated — rate first so longest-match prefers `mg/ml` over bare `mg`.
 *
 * Tree-sitter's lexer already picks the longest match regardless of order, but the
 * ordering makes the intent explicit and survives future edits.
 */
export const UNITS = [
	...RATE,
	...MASS,
	...VOLUME,
	...ACTIVITY,
	...COUNTABLE,
];
