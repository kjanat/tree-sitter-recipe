/**
 * @file Biological activity and concentration units.
 * IU = international units, E = eenheid (Dutch "unit"), % = percent w/w or w/v,
 * ‰ = per mille (used in some EU prescribing traditions).
 * @license MIT
 */

/** @type {readonly string[]} */
export const ACTIVITY = [
	"IU",
	"IE", // internationale eenheden — Dutch IU
	"E",
	"%",
	"‰", // per mille
	"ppm", // parts per million (some trace-element preparations)
	"mEq", // milliequivalents (electrolytes)
	"mOsm", // milliosmoles (osmolarity)
];
