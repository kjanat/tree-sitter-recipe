/**
 * @file Volume units — continuous measurement. Both casings accepted
 * because "ml" and "mL" both appear in real prescriptions.
 * @license MIT
 */

/** @type {readonly string[]} */
export const VOLUME = [
	"µl", // microliter (Greek mu)
	"ul", // microliter (ASCII fallback)
	"µL",
	"uL",
	"ml",
	"mL",
	"cl", // centiliter
	"cL",
	"dl", // deciliter
	"dL",
	"l",
	"L",
];
