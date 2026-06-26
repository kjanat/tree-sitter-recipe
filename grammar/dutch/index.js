/**
 * Dutch patient-facing prose vocabulary, compiled into grammar-ready matchers.
 *
 * `grammar.js` builds a field-labelled `frequency` rule from these, so every
 * cadence carries semantic roles a consumer can read without re-parsing text:
 *
 * ```text
 * "3 keer per dag"  ->  (frequency count: (number)     period: (period))
 * "driemaal daags"  ->  (frequency count: (count_word) period: (period))
 * "om de 8 uur"     ->  (frequency every: (number)     period: (period))
 * ```
 *
 * `count:` = how many doses, `every:` = interval length, `period:` = the unit.
 * A `count_word` ("driemaal") is its own node so a digit and a spelled count
 * share the `count:` role while staying distinct types; downstream maps the
 * word to an integer.
 *
 * Tokens use `[ \t]` (not `\s`) so a frequency never spans a newline.
 *
 * @module dutch
 * @license MIT
 */

import { COUNTERS, NUMBER_WORDS, PERIOD_PLURALS, PERIODS } from "./frequency.ts";

/**
 * Wrap a token list in a non-capturing alternation group.
 * @param {readonly string[]} xs - Alternatives
 * @returns {string} `(?:a|b|c)`
 */
const alt = (xs) => `(?:${xs.join("|")})`;

const period = alt(PERIODS);
const numword = alt(NUMBER_WORDS);
const counter = alt(COUNTERS);

/**
 * Cadence following a digit count: the compact "dd", or a Dutch multiplier
 * ("keer per dag", "maal per week", "x daags"). Anchored by the multi-word
 * shape (or bare "dd"), so it can't collide with a lone word like "keer".
 * @type {RegExp}
 */
const DUTCH_FREQUENCY_UNIT_RE = new RegExp(
	String.raw`(?:dd|${counter}[ \t]+(?:per[ \t]+${period}|daags))`,
);

/**
 * Spelled-out count, "eenmaal".."tienmaal" — the `count_word` node. Includes
 * the glued "maal" because the lexer won't split "driemaal" into "drie"+"maal"
 * (maximal munch); downstream strips "maal" and maps the stem to an integer.
 * @type {RegExp}
 */
const DUTCH_COUNT_WORD_RE = new RegExp(String.raw`${numword}[ \t]*maal`);

/**
 * Cadence following a spelled count: "daags" or "per <period>"
 * ("driemaal DAAGS", "eenmaal PER DAG").
 * @type {RegExp}
 */
const DUTCH_FREQUENCY_TAIL_RE = new RegExp(String.raw`(?:daags|per[ \t]+${period})`);

/**
 * Interval lead-in: "om de", optionally "om de andere" (every other …).
 * Hidden marker; the `every:`/`period:` fields carry the meaning.
 * @type {RegExp}
 */
const DUTCH_INTERVAL_LEAD_RE = /om[ \t]+de(?:[ \t]+andere)?/;

/**
 * A bare period noun, singular or plural, for interval phrasings
 * ("om de 8 UUR", "om de 2 DAGEN", "om de DAG").
 * @type {RegExp}
 */
const DUTCH_PERIOD_NOUN_RE = new RegExp(alt([...PERIOD_PLURALS, ...PERIODS]));

export {
	COUNTERS,
	DUTCH_COUNT_WORD_RE,
	DUTCH_FREQUENCY_TAIL_RE,
	DUTCH_FREQUENCY_UNIT_RE,
	DUTCH_INTERVAL_LEAD_RE,
	DUTCH_PERIOD_NOUN_RE,
	NUMBER_WORDS,
	PERIOD_PLURALS,
	PERIODS,
};
