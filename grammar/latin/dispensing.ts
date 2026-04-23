/**
 * Dispensing / labeling instructions to the pharmacist.
 *
 * These direct how the prescription should be labeled, whether it can be
 * repeated, and how it should be handed to the patient.
 * @license MIT
 */

/** Single-token dispensing directives — "label it", "repeat", "do not repeat". */
const DISPENSING = [
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
] as const;

/** Multi-word dispensing phrases — "according to the art", "as directed". */
const DISPENSING_MULTIWORD = [
	"d.c. prohib.", // dispensing repeat prohibited
	"d.s. monit.", // dispense with monitoring label
	"sec. art.", // secundum artem — according to the art (pharmacist judgment)
	"m. dict.", // more dicto — as directed (alt form)
	"ut dict.", // ut dictum (space-dot variant)
] as const;

export { DISPENSING, DISPENSING_MULTIWORD };
