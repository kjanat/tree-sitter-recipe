/**
 * Countable dose-form units — things you can count as discrete items
 * (as opposed to continuous measurements in mass/volume).
 *
 * Singular and plural forms listed separately; English and Dutch
 * vocabularies both included.
 * @license MIT
 */

/** Tablets and capsules — English abbreviations and full forms. */
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
] as const;

/** Drops — clinical Latin (gtt.) and Dutch (druppel). */
const COUNTABLE_DROPS = ["gtt.", "gtt", "druppel", "druppels"] as const;

/** Packets and sachets — Dutch and modern clinical. */
const COUNTABLE_PACKETS = ["zakje", "zakjes", "sachet", "sachets"] as const;

/** Ampules, vials, and bottles — Dutch and modern clinical. */
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
] as const;

/** Syringes and pre-filled devices — Dutch. */
const COUNTABLE_SYRINGES_DEVICES = ["spuit", "spuiten", "pen", "pennen"] as const;

/** Puffs and doses for inhalers — Dutch and English. */
const COUNTABLE_PUFFS_DOSES = ["pufje", "pufjes", "puff", "puffs", "dosis", "doses"] as const;

/** Generic discrete items — Dutch (stuk) and English (piece). */
const COUNTABLE_GENERIC_DISCRETE = ["stuk", "stuks", "piece", "pieces"] as const;

/** Suppositories as countable form — Dutch. */
const COUNTABLE_SUPPOSITORIES = ["zetpil", "zetpillen"] as const;

/** All countable units — tablets, capsules, drops, packets, ampules, syringes, and more. */
const COUNTABLE = [
	...COUNTABLE_TABLETS_CAPSULES,
	...COUNTABLE_DROPS,
	...COUNTABLE_PACKETS,
	...COUNTABLE_AMPULES_VIALS_BOTTLES,
	...COUNTABLE_SYRINGES_DEVICES,
	...COUNTABLE_PUFFS_DOSES,
	...COUNTABLE_GENERIC_DISCRETE,
	...COUNTABLE_SUPPOSITORIES,
] as const;

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
