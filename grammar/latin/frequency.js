/**
 * @file Dosing frequency — classical Latin + Q-series clinical shorthand.
 * Modern compact form (`N dd`) is parsed by a separate rule in grammar.js.
 * @license MIT
 */

/** @type {readonly string[]} */
export const FREQUENCY = [
	// Classical "de die" forms — number-per-day vocabulary
	"b.d.d.", // bis de die — twice daily
	"t.d.d.", // ter de die — three times daily
	"q.i.d.", // quater in die — four times daily
	"s.d.d.", // semel de die — once daily
	"d.d.", // de die — daily (generic)
	// Q-series "quaque" — every N hours / every period
	"q.h.", // quaque hora — every hour
	"q.2h.", // every 2 hours
	"q.3h.",
	"q.4h.",
	"q.6h.",
	"q.8h.",
	"q.12h.",
	"q.d.", // quaque die — every day
	"q.a.d.", // quaque alterna die — every other day
	"q.a.m.", // quaque ante meridiem — every morning
	"q.p.m.", // quaque post meridiem — every evening
	"q.o.d.", // every other day (US clinical)
	// Week / longer periods
	"q.w.", // weekly
	"b.i.w.", // twice weekly
	"t.i.w.", // three times weekly
];
