/**
 * @file Countable dose-form units — things you can count as discrete items
 * (as opposed to continuous measurements in mass/volume). Singular and plural
 * forms listed separately; English and Dutch vocabularies both included.
 * @license MIT
 */

/** @type {readonly string[]} */
export const COUNTABLE = [
	// English — tablets / capsules
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
	// Drops (clinical Latin + Dutch)
	"gtt.",
	"gtt",
	"druppel",
	"druppels",
	// Packets / sachets
	"zakje",
	"zakjes",
	"sachet",
	"sachets",
	// Ampules / vials / bottles
	"ampul",
	"ampullen",
	"amp.",
	"flac.", // flacon
	"flacon",
	"flacons",
	"fl.",
	"vial",
	"vials",
	// Syringes / pre-filled devices
	"spuit",
	"spuiten",
	"pen",
	"pennen",
	// Puffs / doses (inhalers)
	"pufje",
	"pufjes",
	"puff",
	"puffs",
	"dosis",
	"doses",
	// Generic discrete
	"stuk",
	"stuks",
	"piece",
	"pieces",
	// Suppositories (as countable form, distinct from "supp." marker)
	"zetpil",
	"zetpillen",
];
