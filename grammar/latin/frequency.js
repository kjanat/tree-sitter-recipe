/**
 * @file Dosing frequency — classical Latin forms.
 * Modern compact form (`N dd`) is parsed by a separate rule in grammar.js.
 * @license MIT
 */

/** @type {readonly string[]} */
export const FREQUENCY = [
	"b.d.d.", // bis de die — twice daily
	"t.d.d.", // ter de die — three times daily
	"q.i.d.", // quater in die — four times daily
	"s.d.d.", // semel de die — once daily
	"d.d.", // de die — daily (generic)
];
