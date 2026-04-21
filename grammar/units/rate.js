/**
 * @file Rate and concentration units — quantity-per-denominator forms.
 *
 * These appear in IV infusions ("µg/h"), body-weight dosing ("mg/kg"),
 * concentration ("mg/ml"), and daily totals ("mg/24h", "mg/dag"). Enumerated
 * rather than generated from cross-product because (a) not every combination
 * is clinically meaningful and (b) tokenizing them as atomic units avoids
 * any interaction with the `/` in section markers.
 *
 * Note: the slash is part of the token, consumed in one lexer step. This is
 * safe because section markers (`R/`, `S/`, `Da/`) match a strict 2–3 char
 * shape that can never overlap with `<letters>/<letters>`.
 * @license MIT
 */

/** @type {readonly string[]} */
export const RATE = [
	// Concentration (quantity per volume)
	"mg/ml",
	"mg/dl",
	"mg/l",
	"µg/ml",
	"mcg/ml",
	"g/l",
	"mmol/l",
	"IE/ml",
	"IU/ml",
	"E/ml",
	// Body-weight dosing
	"mg/kg",
	"µg/kg",
	"mcg/kg",
	"IE/kg",
	// Per-time (infusion rates, daily totals)
	"mg/h",
	"µg/h",
	"mcg/h",
	"mg/min",
	"µg/min",
	"mg/uur",
	"µg/uur",
	"IE/uur",
	"mg/24h",
	"mg/dag",
	"µg/dag",
	"IE/dag",
];
