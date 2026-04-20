# tree-sitter-prescription

A tree-sitter grammar for Dutch/Latin medical prescription notation.

## Overview

Parses `.prescription` files following KNMP/FNA standards and international pharmacopoeia conventions. Supports multi-line prescriptions with structured ingredient lists, dispensing instructions, and patient dosage directions.

## Format

### Basic Structure

```
R/   [ingredients with doses]
Da/  [total quantity to dispense]
S/   [patient instructions]
```

### Example

```
R/ zinc 100mg
Da/ 30
S/ take once daily

R/ aspirin 500mg
   ibuprofen 200mg
Da/ 60
S/ 2 dd with meals
```

## Features

- **R/ (Recipe)** section: Drug names and doses
  - Supports percentages: `0.1%`
  - Weight/volume: `100mg`, `50ml`
  - ad/aa quantities: `ad 100g`, `aa 50mg`
  - q.s. (quantum satis): `q.s. ad 100g`

- **Da/ (Dispense)** section: Total quantity
  - Case-insensitive: `Da/`, `da/`, `D/`, `d/`
  - Optional (may be omitted)

- **S/ (Signa)** section: Patient instructions
  - Frequency: `2 dd` (twice daily), `3 x` (3 times)
  - Timing: `a.c.` (before meals), `p.c.` (after meals), `mane` (morning), `nocte` (night)
  - Route: `s.c.` (subcutaneous), `i.m.` (intramuscular), `i.v.` (intravenous)
  - Warnings: `CITO` (urgent), `PIM` (danger if delayed), `non rep.` (no repeats)
  - Free text: arbitrary Dutch instructions

## Grammar Highlights

- **Multi-line ingredients**: Ingredients can span multiple lines in R/ section
- **Dutch decimals**: Supports both `.` and `,` as decimal separators (e.g., `0,5` and `0.5`)
- **Flexible whitespace**: Auto-skips all whitespace (extras: `/\s/`)
- **Keyword extraction**: Built-in word property enables efficient keyword matching

## Node Types

### Main Sections

- `recipe_section` → ingredients and preparation
- `da_section` → dispensing quantity
- `signa_section` → patient instructions

### Ingredients

- `ingredient` → drug name + optional dose
- `drug_name` → identifier sequence
- `dose` → concentration | amount | ad_quantity | qs_ad_quantity | aa_quantity

### Signa Tokens

- `frequency` → integer + (dd | x) + optional daags
- `timing` → a.c., p.c., a.n., z.n., s.o.s., p.r.n., mane, nocte, stat
- `administration` → s.c., i.m., i.v., subling., o.d., o.s.
- `warning` → d.c.p., CITO, PIM, non rep.

## Usage

### Building

```bash
npm install
tree-sitter generate
tree-sitter test
```

### Parsing

```bash
tree-sitter parse example.prescription
```

### Node.js Binding

```javascript
const Parser = require("tree-sitter");
const Prescription = require("./index.js");

const parser = new Parser();
parser.setLanguage(Prescription);

const tree = parser.parse(`R/ aspirin 500mg\nS/ once daily`);
console.log(tree.rootNode.toString());
```

## Test Coverage

3 corpus tests covering:

1. Simple single-ingredient prescription
2. Multi-ingredient compound with dispense
3. Multiple ingredients with frequency notation

Run tests: `tree-sitter test` (100% pass)

## Files

- `grammar.js` — Grammar definition
- `test/corpus/prescriptions.txt` — Test cases
- `queries/highlights.scm` — Syntax highlighting
- `src/parser.c` — Auto-generated parser (do not edit)

## License

MIT

## Author

Kaj Kowalski <info@kajkowalski.nl>
