/**
 * Biological activity and concentration units.
 *
 * IU = international units, IE = internationale eenheden (Dutch),
 * E = eenheid (Dutch "unit"), % = percent w/w or w/v,
 * ‰ = per mille (used in some EU prescribing traditions).
 * @license MIT
 */

/** Activity units — international units, Dutch equivalents, and concentration markers. */
const ACTIVITY = [
	"IU",
	"IE", // internationale eenheden — Dutch IU
	"E",
	"%",
	"‰", // per mille
	"ppm", // parts per million (some trace-element preparations)
	"mEq", // milliequivalents (electrolytes)
	"mOsm", // milliosmoles (osmolarity)
] as const;

export { ACTIVITY, ACTIVITY as default };
