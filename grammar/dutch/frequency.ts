/**
 * Dutch patient-facing dosing frequency — the prose a label (Signa) carries.
 *
 * The classical Latin forms ("3 dd", "b.d.d.", "q.4h.") live in
 * `grammar/latin/frequency.ts` and the compact `frequency` token in
 * `grammar.js`. This module adds the *Nederlandse spreektaal* an etiket
 * actually uses — the form a trainer model emits because the patient, not the
 * pharmacist, reads it: "3 keer per dag", "driemaal daags", "om de 8 uur".
 *
 * Only the raw vocabulary lives here; `index.js` compiles it into a single
 * matcher, mirroring the data/regex split used by `grammar/latin`.
 *
 * @module dutch/frequency
 * @license MIT
 */

/**
 * Time-period nouns a frequency can reference ("per DAG", "om de 8 UUR").
 * Plural interval forms ("dagen", "weken") are handled in `index.js`.
 */
const PERIODS = [
	"dag",
	"week",
	"maand",
	"uur",
	"nacht",
	"ochtend",
	"morgen",
	"middag",
	"avond",
] as const;

/** Spelled-out Dutch counts "een".."tien" — the lead of "DRIEmaal daags". */
const NUMBER_WORDS = [
	"een",
	"twee",
	"drie",
	"vier",
	"vijf",
	"zes",
	"zeven",
	"acht",
	"negen",
	"tien",
] as const;

/** Multiplier connectors between a digit and a period ("3 KEER per dag"). */
const COUNTERS = ["keer", "maal", "x"] as const;

/**
 * Plural period nouns, for interval phrasings that count whole periods
 * ("om de 2 DAGEN"). Plural-first ordering is harmless for tree-sitter
 * (maximal-munch lexing) but keeps the compiled JS RegExp longest-first too.
 */
const PERIOD_PLURALS = [
	"dagen",
	"weken",
	"maanden",
	"uren",
	"nachten",
	"ochtenden",
	"avonden",
] as const;

export { COUNTERS, NUMBER_WORDS, PERIOD_PLURALS, PERIODS };
