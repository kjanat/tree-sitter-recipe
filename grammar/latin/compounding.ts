/**
 * Compounding / extemporaneous-preparation directives.
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

/** Single-token compounding verbs — "mix", "dissolve", "divide", etc. */
export const COMPOUNDING = [
	"mf", // misce fiat — mix and make
	"m.f.", // dotted variant
	"aa", // ana — of each (equal parts)
	"aa.", // dotted variant
	"q.s.", // quantum satis — quantity sufficient
	"q.p.", // quantum placet — as much as pleases (free amount)
	"c.s.", // concisus — cut / crushed
	"f.", // fiat — let it be made
	"ft.", // fiat (alt-abbreviation with trailing t)
	"div.", // divide — divide into parts
	"solve", // dissolve
	"coq.", // coque — boil
] as const;

/** Multi-word compounding phrases — "mix to make a powder", "divide into equal parts", etc. */
export const COMPOUNDING_MULTIWORD = [
	"m.f. pulv.", // misce fiat pulvis — mix to make a powder
	"m.f. caps.", // mix to make capsules
	"m.f. ungt.", // mix to make an ointment
	"m.f. sol.", // mix to make a solution
	"m.f. susp.", // mix to make a suspension
	"m. et ft.", // misce et fiat — mix and let be made
	"ad lib.", // ad libitum — at pleasure / freely
	"div. in p. aeq.", // divide into equal parts
	"div. in d.", // divide into doses
] as const;
