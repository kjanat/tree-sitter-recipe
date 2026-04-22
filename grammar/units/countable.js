/**
 * @file Countable dose-form units — things you can count as discrete items
 * (as opposed to continuous measurements in mass/volume). Singular and plural
 * forms listed separately; English and Dutch vocabularies both included.
 * @license MIT
 */

/** English — tablets / capsules
 * @type {readonly string[]} */
const COUNTABLE_TABLETS_CAPSULES = [
	"tablet",
	"tablets",
	"tabl.",
	"tab",
	"tabs",
	"tbl.",
	"capsule",
	"capsules",
	"cap",
	"caps",
	"caps.",
];

/** Drops (clinical Latin + Dutch)
 *  @type {readonly string[]} */
const COUNTABLE_DROPS = ["gtt.", "gtt", "druppel", "druppels"];

/** Packets / sachets (Dutch + modern clinical)
 * @type {readonly string[]} */
const COUNTABLE_PACKETS = ["zakje", "zakjes", "sachet", "sachets"];

/** Ampules / vials / bottles (Dutch + modern clinical)
 * @type {readonly string[]} */
const COUNTABLE_AMPULES_VIALS_BOTTLES = [
	"ampul",
	"ampullen",
	"amp.",
	"flac.",
	"flacon",
	"flacons",
	"fl.",
	"vial",
	"vials",
];

/** Syringes / pre-filled devices (Dutch + modern clinical)
 * @type {readonly string[]} */
const COUNTABLE_SYRINGES_DEVICES = ["spuit", "spuiten", "pen", "pennen"];

/** Puffs / doses (inhalers) (Dutch + modern clinical)
 * @type {readonly string[]} */
const COUNTABLE_PUFFS_DOSES = ["pufje", "pufjes", "puff", "puffs", "dosis", "doses"];

/** Generic discrete items (Dutch + English)
 * @type {readonly string[]} */
const COUNTABLE_GENERIC_DISCRETE = ["stuk", "stuks", "piece", "pieces"];

/** Suppositories (as countable form, distinct from "supp." marker) (Dutch)
 * @type {readonly string[]} */
const COUNTABLE_SUPPOSITORIES = ["zetpil", "zetpillen"];

/** All countable units, in no particular order. @type {readonly string[]} */
const COUNTABLE = [
	...COUNTABLE_TABLETS_CAPSULES,
	...COUNTABLE_DROPS,
	...COUNTABLE_PACKETS,
	...COUNTABLE_AMPULES_VIALS_BOTTLES,
	...COUNTABLE_SYRINGES_DEVICES,
	...COUNTABLE_PUFFS_DOSES,
	...COUNTABLE_GENERIC_DISCRETE,
	...COUNTABLE_SUPPOSITORIES,
];

export {
	COUNTABLE,
	COUNTABLE as default,
	COUNTABLE_AMPULES_VIALS_BOTTLES,
	COUNTABLE_DROPS,
	COUNTABLE_GENERIC_DISCRETE,
	COUNTABLE_PACKETS,
	COUNTABLE_PUFFS_DOSES,
	COUNTABLE_SUPPOSITORIES,
	COUNTABLE_SYRINGES_DEVICES,
	COUNTABLE_TABLETS_CAPSULES,
};
