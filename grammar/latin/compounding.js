/**
 * @file Compounding / extemporaneous-preparation directives.
 *
 * Instructions to the pharmacist about HOW to combine ingredients — distinct
 * from dispensing (labeling), route (administration), or form (preparation
 * type). These are the verbs of galenic compounding.
 *
 * Note: `ad` (fill-to) and `dtd` (dispense-this-dose) are structural rules
 * in grammar.js, not plain vocabulary — they take operands — so they live
 * outside this list even though they're conceptually compounding directives.
 * @license MIT
 */

/** @type {readonly string[]} */
export const COMPOUNDING = [
	"mf", // misce fiat — mix and make
	"m.f.", // dotted variant
	"aa", // ana — of each (equal parts)
	"aa.", // dotted variant
	"q.s.", // quantum satis — quantity sufficient
	"f.", // fiat — let it be made
];
