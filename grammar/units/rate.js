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

/** Units of rate or concentration. @type {readonly string[]} */
const RATE = [
	// Weight-volume-time compound rates (longest first for clarity)
	"mg/kg/dag", // Dutch — mg per kg per day
	"mg/kg/dag.", // dotted variant seen in Rx
	"mcg/kg/min", // microgram/kg/min (IV infusion classic)
	"µg/kg/min",
	"mg/kg/u", // Dutch "uur" shorthand
	"mg/kg/h",
	"mcg/kg/h",
	"µg/kg/h",
	// Inhaler-specific rates
	"mcg/pufje",
	"µg/pufje",
	"mcg/puff",
	"µg/puff",
	// Concentration (quantity per volume)
	"mg/ml",
	"mg/dl",
	"mg/l",
	"µg/ml",
	"mcg/ml",
	"ng/ml",
	"g/l",
	"g/dl",
	"mmol/l",
	"mol/l",
	"mEq/l",
	"IE/ml",
	"IU/ml",
	"E/ml",
	// Body-weight dosing (single denominator)
	"mg/kg",
	"µg/kg",
	"mcg/kg",
	"ng/kg",
	"IE/kg",
	"IU/kg",
	"ml/kg",
	// Per-time (infusion rates, daily totals)
	"mg/h",
	"µg/h",
	"mcg/h",
	"ml/h",
	"mg/min",
	"µg/min",
	"ml/min",
	"mg/uur",
	"µg/uur",
	"ml/uur",
	"IE/uur",
	"mg/24h",
	"mg/dag",
	"µg/dag",
	"mcg/dag",
	"IE/dag",
	"IU/dag",
	"ml/dag",
	// Per-surface-area (oncology)
	"mg/m2",
	"mg/m²",
	"mcg/m2",
	"µg/m²",
];

export { RATE, RATE as default };
