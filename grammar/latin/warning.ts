/**
 * Emergency / safety priority markers.
 *
 * Uppercase by tradition. Includes urgency flags (CITO, STAT, URGENT) and
 * regulatory safety markers (LASA, REMS, BLACKBOX) that highlight-queries
 * can style distinctly to draw clinical attention.
 * @license MIT
 */

/** Urgency and safety keywords — CITO, STAT, URGENT, plus regulatory flags. */
const WARNING = [
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
] as const;

export { WARNING };
