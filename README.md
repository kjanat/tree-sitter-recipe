# tree-sitter-recipe

[![NPM](https://img.shields.io/npm/v/tree-sitter-recipe?logo=npm&labelColor=CB3837&color=black)][npm]
[![JSR](https://img.shields.io/jsr/v/@kjanat/tree-sitter-recipe?logoColor=083344&logo=jsr&logoSize=auto&label=&labelColor=f7df1e&color=black)][jsr]

Tree-sitter grammar for `.recipe` files — a digital notation for
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

<picture>
  <source media="(prefers-color-scheme: light)" srcset="https://cdn.jsdelivr.net/gh/kjanat/tree-sitter-recipe@master/demo-light.gif">
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kjanat/tree-sitter-recipe@master/demo.gif">
  <img alt="tree-sitter-recipe highlighting a prescription" src="https://cdn.jsdelivr.net/gh/kjanat/tree-sitter-recipe@master/demo.gif">
</picture>

<!-- https://github.com/user-attachments/assets/9015f3e7-b706-45bc-99e5-6e420a6c6936 -->

<details><summary>Click to expand the example</summary>

```recipe
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

</details>

## Install

```sh
bun install        # or: npm install
bun test           # or: npm test
```

## Development

```sh
npx tree-sitter generate                   # regenerate parser after grammar changes
npx tree-sitter test                       # run corpus tests
npx tree-sitter parse file.recipe          # inspect parse tree
npx tree-sitter highlight file.recipe      # visualize syntax highlighting
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

## Supported abbreviations

**Frequency:** `d.d.`, `b.d.d.`, `t.d.d.`, `q.i.d.`, `s.d.d.` plus modern `N dd`

**Dutch prose frequency:** `3 keer per dag`, `driemaal daags`, `om de 8 uur`
(structured into `count`/`every`/`period` fields)

**Timing:** `a.c.`, `p.c.`, `a.n.`, `m. et v.`

**Route:** `i.m.`, `i.v.`, `s.c.`, `subling.`, `o.d.`, `o.s.`, `a.u.e.`, `u.e.`

**Compounding:** `ad` (fill-to), `dtd` / `d.t.d.` (dispense-this-dose)

**Dispensing/warning:** `d.s.p.`, `u.c.`, `z.n.`, `d.c.p.`, `d.s. monit.`,
`d.c. prohib.`, `d.i.m.m.`, `CITO`, `PIM`

**Forms:** `aq. pur.`, `collut.`, `lin.`, `supp.`, `gtt aur.`, `gtt nas.`,
`gtt ophth.`

**Conditional:** `si nec. sit`

## Not yet supported

- International abbreviations (`Rx`, `Rp`, `sig.`, `prn`, `qd`, `qid`, `bid`,
  `tid`, `hs`, `stat`) — reserved for `#!dialect international` pragma.
- `iter N x` repeat directive — dropped due to lexical conflict with `x`
  appearing in signa phrases (`2 x daags`).
- ISMP error-prone-abbreviation linting — future tooling, not a grammar
  concern.
- Nested language injection inside doc comments — reserved for a later release.

## License

[MIT][License] © Kaj Kowalski

[License]: LICENSE
[npm]: https://npm.im/tree-sitter-recipe
[jsr]: https://jsr.io/@kjanat/tree-sitter-recipe

<!-- rumdl-disable-file MD033 -->
<!-- markdownlint-disable-file MD033 -->
