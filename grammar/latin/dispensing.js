/**
 * @file Dispensing / labeling instructions to the pharmacist.
 * @license MIT
 */

export const DISPENSING = [
	"d.s.p.", // detur sine prescriptione — dispense without prescription label
	"d.c.p.", // detur cum prescriptione — dispense with prescription label
	"d.i.m.m.", // detur in manu medici — dispense to physician
	"u.c.", // usus cognitus — patient knows usage
	"z.n.", // zo nodig — as needed (Dutch)
];

export const DISPENSING_MULTIWORD = [
	"d.c. prohib.", // dispensing repeat prohibited
	"d.s. monit.", // dispense with monitoring label
];
