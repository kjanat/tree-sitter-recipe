# tree-sitter-recipe

## OVERVIEW

This repo owns the `recipe` Tree-sitter grammar and thin multi-language
bindings. Real language work belongs in grammar, vocab, query, and test files.

## WHERE TO LOOK

| Task                          | Location                  | Notes                                       |
| ----------------------------- | ------------------------- | ------------------------------------------- |
| Change grammar shape          | `grammar.js`              | Node names, aliases, conflicts, extras      |
| Add abbreviations             | `grammar/latin/*.js`      | Parser vocab source                         |
| Add units                     | `grammar/units/*.js`      | Keep longest/rate-sensitive ordering intact |
| Update highlighting semantics | `queries/highlights.scm`  | Must track exact node names and aliases     |
| Update parser tests           | `test/corpus/*.txt`       | Tree-sitter corpus goldens                  |
| Update highlight fixtures     | `test/highlight/*.recipe` | Reused by TextMate verifier too             |
| Inspect metadata/bindings     | `tree-sitter.json`        | Query registration and binding matrix       |

## GENERATED FILES

Do not hand-edit these.

- `src/parser.c`
- `src/grammar.json`
- `src/node-types.json`
- `prebuilds/`
- `build/`
- `target/`
- `*.wasm`

Regenerate from `grammar.js` and vocab files.

## CONVENTIONS

- `word` is load-bearing. It enables context-sensitive keyword promotion.
- Comments live in `extras`; they parse almost anywhere without changing section
  structure.
- `dispense_marker` intentionally accepts both `D/` and `Da/`.
- Keep accented Latin support in `word`; do not shrink regexes to ASCII.
- Grammar, vocab, queries, and tests move together.

## TEST FLOWS

```bash
bun install
bun run generate
bunx tree-sitter test
bun test
bunx tree-sitter highlight test/highlight/latin.recipe
```

- Run both `bunx tree-sitter test` and `bun test` after grammar changes.
- Corpus tests catch AST regressions.
- `bun test` catches Node binding/native loading breakage.

## ANTI-PATTERNS

- Do not edit bindings first when semantics change; fix grammar/query/test source
  instead.
- Do not rename nodes or aliases in `grammar.js` without updating `queries/highlights.scm`.
- Do not trust binding tests alone; they do not replace corpus coverage.
- Do not treat `tree-sitter/` vendored checkout as project-owned source.

## GOTCHAS

- `latin_abbrev` is a supertype; downstream queries usually capture concrete categories.
- Aliases like `"fill_marker"`, `"dtd_keyword"`, and `"dtd_no"` are part of
  downstream contracts.
- `bindings/node/index.js` tolerates missing `queries/tags.scm`; absence is not
  current bug.
