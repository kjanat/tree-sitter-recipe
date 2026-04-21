/**
 * @file Pharmaceutical form keywords (not units — these name the preparation).
 * @license MIT
 */

/** @type {readonly string[]} */
export const FORMS = [
	"aq. pur.", // aqua purificata — purified water
	"collut.", // collutorium — mouthwash
	"lin.", // linimentum
	"supp.", // suppositorium
];

/** @type {readonly string[]} */
export const FORMS_MULTIWORD = [
	"gtt aur.", // guttae auriculares — ear drops
	"gtt nas.", // guttae nasales — nose drops
	"gtt ophth.", // guttae ophthalmicae — eye drops
];
