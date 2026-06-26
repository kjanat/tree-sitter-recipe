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

/**
 * Multiplier connectors between a digit and a period ("3 KEER per dag").
 * Both the ASCII `x` and the `×` (U+00D7) a model emits ("3× daags").
 */
const COUNTERS = ["keer", "maal", "x", "×"] as const;

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

/**
 * Numeric value of each spelled-out count, "een" -> 1 … "tien" -> 10.
 * The canonical word→integer map behind {@linkcode countWordValue} and
 * {@linkcode countValue}; exposed so consumers needn't rebuild it.
 */
const NUMBER_WORD_VALUE: ReadonlyMap<string, number> = new Map(
	NUMBER_WORDS.map((word, index) => [word, index + 1]),
);

/**
 * Integer value of a spelled-out Dutch count word, or `undefined` when the
 * stem isn't "een".."tien".
 *
 * Accepts a bare number word ("drie") or a `count_word` exactly as the grammar
 * emits it ("driemaal", "drie maal") — the lexer can't split the glued form,
 * so the trailing "maal" connector is stripped here before lookup. Trims and
 * lowercases first.
 */
function countWordValue(token: string): number | undefined {
	const stem = token.trim().toLowerCase().replace(/[ \t]*maal$/, "");
	return NUMBER_WORD_VALUE.get(stem);
}

/**
 * Integer value of a count in either notation the grammar's `count:` field
 * admits — a `number` ("3") or a `count_word` ("drie", "driemaal"). Returns
 * `undefined` when the text is neither a plain integer nor a known count word.
 */
function countValue(token: string): number | undefined {
	const trimmed = token.trim();
	if (/^\d+$/.test(trimmed)) return Number(trimmed);
	return countWordValue(trimmed);
}

export { COUNTERS, countValue, countWordValue, NUMBER_WORD_VALUE, NUMBER_WORDS, PERIOD_PLURALS, PERIODS };
