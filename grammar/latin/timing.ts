/**
 * Timing relative to meals and the day cycle.
 *
 * Distinct from frequency (how often) — these specify WHEN during the day
 * a dose should be taken: before meals, at bedtime, in the morning, etc.
 * @license MIT
 */

/** Single-token timing markers — "before meals", "at bedtime", "in the morning". */
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
] as const;

/** Multi-word timing phrases — "morning and evening", "on an empty stomach". */
const TIMING_MULTIWORD = [
	"m. et v.", // mane et vespere — morning and evening
	"mane et nocte", // morning and night (written)
	"inter cibos", // between meals (written)
	"ante prandium", // before the meal
	"post prandium", // after the meal
	"hora somni", // at the hour of sleep (written)
	"in ieiunio", // on an empty stomach
] as const;

export { TIMING, TIMING_MULTIWORD };
