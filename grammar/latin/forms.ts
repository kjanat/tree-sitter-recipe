/**
 * Pharmaceutical form keywords — names for the preparation type.
 *
 * Not units (those are in `grammar/units/`); these name the dosage form
 * itself: ointment, solution, syrup, suppository, etc.
 * @license MIT
 */

/** Single-token dosage form names — "powder", "ointment", "solution", etc. */
const FORMS = [
	"aq. pur.", // aqua purificata — purified water
	"aq. dest.", // aqua destillata — distilled water
	"collut.", // collutorium — mouthwash
	"lin.", // linimentum
	"supp.", // suppositorium
	"pulv.", // pulvis — powder
	"ungt.", // unguentum — ointment
	"ung.", // unguentum — shorter variant
	"emp.", // emplastrum — medicinal plaster
	"sol.", // solutio — solution
	"susp.", // suspensio — suspension
	"syr.", // syrupus — syrup
	"inj.", // injectio — injection
	"crm.", // cream (clinical shorthand)
	"tinct.", // tinctura — tincture
	"mixt.", // mixtura — mixture
	"elix.", // elixir
	"troch.", // trochiscus — lozenge
	"past.", // pasta / pastille
	"aeros.", // aerosol
	"gel.", // gel (dotted)
	"spray", // modern — spray
	"patch", // modern — transdermal patch
	"pasta", // Latin/Dutch — paste
] as const;

/** Multi-word dosage forms — "ear drops", "eye drops", "water for injection". */
const FORMS_MULTIWORD = [
	"gtt aur.", // guttae auriculares — ear drops
	"gtt nas.", // guttae nasales — nose drops
	"gtt ophth.", // guttae ophthalmicae — eye drops
	"aq. pro inj.", // aqua pro injectione — water for injection
	"pulv. adsp.", // pulvis adspersorius — dusting powder
	"sol. inj.", // solutio iniectabilis — injectable solution
	"unguent. opht.", // ophthalmic ointment
] as const;

export { FORMS, FORMS_MULTIWORD };
