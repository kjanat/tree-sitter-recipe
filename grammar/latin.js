/**
 * @file Latin abbreviation vocabulary for prescription notation.
 * @license MIT
 */

// Single-token Latin abbreviations (no internal whitespace).
// Ordered so that longer prefixes appear before shorter ones where relevant;
// tree-sitter's longest-match will then pick the intended token.
export const LATIN_ABBREVS = [
	// Frequency (classical)
	"b.d.d.",
	"t.d.d.",
	"q.i.d.",
	"s.d.d.",
	"d.d.",
	// Timing
	"a.c.",
	"p.c.",
	"a.n.",
	// Route
	"a.u.e.",
	"u.e.",
	"i.m.",
	"i.v.",
	"s.c.",
	"subling.",
	"o.d.",
	"o.s.",
	// Dispensing / warnings
	"d.s.p.",
	"d.c.p.",
	"d.i.m.m.",
	"u.c.",
	"z.n.",
	"CITO",
	"PIM",
	// Forms
	"aq. pur.",
	"collut.",
	"lin.",
	"supp.",
];

// Multi-word abbreviations — regex tolerates flexible internal whitespace so
// both "gtt aur." and "gtt  aur." tokenize.
export const MULTIWORD_ABBREV_RE =
	/d\.c\.\s+prohib\.|d\.s\.\s+monit\.|si\s+nec\.\s+sit|m\.\s+et\s+v\.|gtt\s+aur\.|gtt\s+nas\.|gtt\s+ophth\./;
