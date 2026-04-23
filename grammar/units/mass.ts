/**
 * Mass units — continuous measurement from nanograms to kilograms,
 * plus imperial (lb, oz).
 * @license MIT
 */

/** Units of mass used in pharmacological dosing. */
const MASS = [
	"ng", // nanogram
	"mcg", // microgram (ASCII)
	"µg", // microgram (Greek mu)
	"mg", // milligram
	"g", // gram
	"kg", // kilogram
	"lb", // pound
	"oz", // ounce
] as const;

export { MASS, MASS as default };
