# tree-sitter-prescription

Tree-sitter grammar for `.prescription` files — a digital notation for
pharmacological prescriptions in the Dutch/Latin KNMP/FNA tradition.

## What it parses

Three section markers (case-insensitive):

| Marker | Meaning     | Content                              |
| ------ | ----------- | ------------------------------------ |
| `R/`   | recipe      | active ingredient(s), form, strength |
| `Da/`  | da/dispense | quantity to dispense                 |
| `S/`   | signa       | directions to the patient            |

Plus Latin abbreviations, modern frequencies (`1 dd`, `3 dd`), numbers with
Dutch (`0,1`) or international (`0.1`) decimals, and a four-tier comment
system.

## Example

```prescription
/**
 * Patient: 45yo female, chronic URTI
 * Allergies: none known
 */
R/ claritromycin tablet 500mg
Da/ 14 tablets
S/ b.d.d. 1 tablet p.c.

#! empirical coverage for suspected CAP
R/ amoxicilline 500mg
Da/ 21 caps
S/ 3 dd 1 caps

# pharmacist: check interaction table before dispensing
```

## Install

```sh
bun install        # or: npm install
bun test           # or: npm test
```

## Development

```sh
npx tree-sitter generate                   # regenerate parser after grammar changes
npx tree-sitter test                       # run corpus tests
npx tree-sitter parse file.prescription    # inspect parse tree
npx tree-sitter highlight file.prescription # visualize syntax highlighting
npx tree-sitter build --wasm               # build WASM for playground
```

## Comment system

| Syntax     | Purpose           | AST role             |
| ---------- | ----------------- | -------------------- |
| `# …`      | line comment      | extra (no structure) |
| `#! …`     | doc line comment  | extra (sibling node) |
| `/* … */`  | block comment     | extra (no structure) |
| `/** … */` | doc block comment | extra (sibling node) |

All four live in `extras`, so they parse anywhere without affecting structure.
Doc variants (`#!`, `/**`) are intended for tooling (LSP, formatter, docgen)
to associate them with the next section by source position.

## Supported abbreviations (V1)

**Frequency:** `d.d.`, `b.d.d.`, `t.d.d.`, `q.i.d.`, `s.d.d.` plus modern `N dd`

**Timing:** `a.c.`, `p.c.`, `a.n.`, `m. et v.`

**Route:** `i.m.`, `i.v.`, `s.c.`, `subling.`, `o.d.`, `o.s.`, `a.u.e.`, `u.e.`

**Compounding:** `ad` (fill-to), `dtd` / `d.t.d.` (dispense-this-dose)

**Dispensing/warning:** `d.s.p.`, `u.c.`, `z.n.`, `d.c.p.`, `d.s. monit.`,
`d.c. prohib.`, `d.i.m.m.`, `CITO`, `PIM`

**Forms:** `aq. pur.`, `collut.`, `lin.`, `supp.`, `gtt aur.`, `gtt nas.`,
`gtt ophth.`

**Conditional:** `si nec. sit`

## Not in V1

- International abbreviations (`Rx`, `Rp`, `sig.`, `prn`, `qd`, `qid`, `bid`,
  `tid`, `hs`, `stat`) — reserved for `#!dialect international` pragma.
- `iter N x` repeat directive — dropped due to lexical conflict with `x`
  appearing in signa phrases (`2 x daags`).
- ISMP error-prone-abbreviation linting — future tooling, not a grammar
  concern.
- Nested language injection inside doc comments — reserved for V2.

## License

MIT
