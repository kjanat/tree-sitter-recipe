/**
 * @file Administration routes.
 *
 * Real-world prescriptions use both classical lowercase (`i.v.`) and
 * uppercase clinical notation (`I.V.`, `IV`) interchangeably. Tree-sitter
 * string tokens are case-sensitive, so both casings are enumerated — the
 * uppercase set is derived programmatically from the canonical lowercase
 * list to keep additions cheap.
 *
 * Dotless shorthand (`IV`, `IM`, `SC`, `SL`, `PO`) is only included for
 * forms that don't collide with common words or other abbreviations.
 * `OD`/`OS`/`OU` dotless is deliberately omitted — ambiguous with plain
 * words / the international `q.d.` tradition.
 * @license MIT
 */

/** @type {readonly string[]} */
const DOTTED_CANONICAL = [
	"i.m.", // intramuscular
	"i.v.", // intravenous
	"s.c.", // subcutaneous
	"s.l.", // sublingual (dotted)
	"subling.", // sublingual (written)
	"p.o.", // per os — orally
	"p.r.", // per rectum
	"rect.", // rectal (written)
	"p.v.", // per vaginam
	"vag.", // vaginal (written)
	"i.n.", // intranasal
	"nas.", // nasal (written)
	"inh.", // inhalation
	"neb.", // nebulizer
	"top.", // topical
	"buc.", // buccal
	"transd.", // transdermal
	"i.a.", // intra-arterial
	"i.d.", // intradermal
	"i.t.", // intrathecal
	"i.o.", // intraosseous
	"i.p.", // intraperitoneal
	"epid.", // epidural
	"o.d.", // oculus dexter — right eye
	"o.s.", // oculus sinister — left eye
	"o.u.", // oculus uterque — both eyes
	"a.u.e.", // ad usum externum — for external use
	"u.e.", // usus externus — external use
];

/** @type {readonly string[]} */
export const ROUTE = [
	...DOTTED_CANONICAL,
	...DOTTED_CANONICAL.map(s => s.toUpperCase()),
	// Dotless clinical shorthand — letters unambiguous with common words.
	"IV",
	"IM",
	"SC",
	"SL",
	"PO",
	"PR",
	"PV",
	"SQ", // subcutaneous (US clinical variant)
];

/** @type {readonly string[]} */
const ROUTE_MULTIWORD_CANONICAL = [
	"per os", // orally
	"per rectum",
	"per vaginam",
	"per inhalationem", // by inhalation
	"ad us. int.", // ad usum internum — internal use
	"ad us. ext.", // ad usum externum — external use
	"in ocul.", // in the eye(s)
	"in aur.", // in the ear(s)
	"in nar.", // in the nostril(s)
];

/** @type {readonly string[]} */
export const ROUTE_MULTIWORD = [
	...ROUTE_MULTIWORD_CANONICAL,
	// Sentence-case — signa lines occasionally start with the route.
	...ROUTE_MULTIWORD_CANONICAL.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
];
