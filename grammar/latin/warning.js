/**
 * @file Emergency / safety priority markers. Uppercase by tradition.
 * @license MIT
 */

/** @type {readonly string[]} */
export const WARNING = [
	// CITO — classical Latin for "quickly"
	"CITO",
	"cito",
	"Cito",
	// STAT — statim, immediately (US clinical)
	"STAT",
	"stat",
	"Stat",
	// URGENT — english variant
	"URGENT",
	"urgent",
	"Urgent",
	// Risk / safety flags
	"PIM", // potentially inappropriate medication (geriatric)
	"LASA", // look-alike, sound-alike
	"REMS", // risk evaluation and mitigation strategy
	"BLACKBOX", // FDA black-box warning flag
	"TERATOGEN", // pregnancy-contraindicated flag
	"NIEUW", // Dutch — new prescription flag
	"NEW", // english equivalent
];
