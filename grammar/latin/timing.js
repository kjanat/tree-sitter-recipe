/**
 * @file Timing relative to meals / day cycle.
 * @license MIT
 */

/** @type {readonly string[]} */
const TIMING = [
	"a.c.", // ante cibum — before meals
	"p.c.", // post cibum — after meals
	"a.n.", // ante noctem — before bed
	"h.s.", // hora somni — at bedtime
	"i.c.", // inter cibos — between meals
	"mane", // in the morning
	"nocte", // at night
	"vesp.", // vespere — in the evening
	"matut.", // matutinus — morning (variant)
];

/** @type {readonly string[]} */
const TIMING_MULTIWORD = [
	"m. et v.", // mane et vespere — morning and evening
	"mane et nocte", // morning and night (written)
	"inter cibos", // between meals (written)
	"ante prandium", // before the meal
	"post prandium", // after the meal
	"hora somni", // at the hour of sleep (written)
	"in ieiunio", // on an empty stomach
];

export { TIMING, TIMING_MULTIWORD };
