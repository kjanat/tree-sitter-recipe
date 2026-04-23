/**
 * Conditional clauses — "if needed", "as required" markers.
 *
 * Distinguished from timing (when) and frequency (how often): these gate
 * whether a dose is given at all. Captured as `keyword.conditional` so the
 * highlighter can make conditional dosing visually distinct from scheduled.
 * @license MIT
 */

/** Single-token conditional markers — s.o.s., p.r.n., PRN. */
const CONDITIONAL = [
	"s.o.s.", // si opus sit — if there is need
	"p.r.n.", // pro re nata — as the occasion arises
	"prn", // dotless modern clinical shorthand
	"PRN", // uppercase variant
] as const;

/** Multi-word conditional phrases — Latin and Dutch "as needed" forms. */
const CONDITIONAL_MULTIWORD = [
	"si nec. sit", // si necesse sit — if necessary
	"si opus", // si opus sit (abbreviated tail)
	"zo nodig", // Dutch — as needed
	"bij pijn", // Dutch — for pain
	"bij koorts", // Dutch — for fever
	"bij nood", // Dutch — in case of emergency
	"in geval van", // Dutch — in case of
] as const;

export { CONDITIONAL, CONDITIONAL_MULTIWORD };
