/**
 * Volume units — continuous measurement.
 *
 * Both casings accepted because "ml" and "mL" both appear in
 * real prescriptions.
 * @license MIT
 */

/** Volume units from microliters to liters, both casings. */
const VOLUME = [
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
] as const;

export { VOLUME, VOLUME as default };
