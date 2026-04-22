/**
 * @file Biological activity and concentration units.
 * IU = international units, E = eenheid (Dutch "unit"), % = percent w/w or w/v,
 * ‰ = per mille (used in some EU prescribing traditions).
 * @license MIT
 */

/** Activity units. For example, "E" is the Dutch abbreviation for "eenheid" (unit),
 * but it is also used in some clinical contexts as an alternative to "IU".\
 * So we just lump them all together here. @type {readonly string[]} */
const ACTIVITY = [
	"IU",
	"IE", // internationale eenheden — Dutch IU
	"E",
	"%",
	"‰", // per mille
	"ppm", // parts per million (some trace-element preparations)
	"mEq", // milliequivalents (electrolytes)
	"mOsm", // milliosmoles (osmolarity)
];

export { ACTIVITY, ACTIVITY as default };
