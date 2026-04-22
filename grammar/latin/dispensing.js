/**
 * @file Dispensing / labeling instructions to the pharmacist.
 * @license MIT
 */

/** @type {readonly string[]} */
export const DISPENSING = [
	"d.s.p.", // detur sine prescriptione — dispense without prescription label
	"d.c.p.", // detur cum prescriptione — dispense with prescription label
	"d.i.m.m.", // detur in manu medici — dispense to physician
	"u.c.", // usus cognitus — patient knows usage
	"u.d.", // ut dictum — as directed
	"m.d.u.", // more dicto utendum — to be used as directed
	"z.n.", // zo nodig — as needed (Dutch)
	"sig.", // signetur — let it be labeled
	"rep.", // repetatur — let it be repeated
	"n.r.", // non repetatur — do not repeat
	"disp.", // dispense
	"non rep.", // non repetatur (dot-space variant)
];

/** @type {readonly string[]} */
export const DISPENSING_MULTIWORD = [
	"d.c. prohib.", // dispensing repeat prohibited
	"d.s. monit.", // dispense with monitoring label
	"sec. art.", // secundum artem — according to the art (pharmacist judgment)
	"m. dict.", // more dicto — as directed (alt form)
	"ut dict.", // ut dictum (space-dot variant)
];
