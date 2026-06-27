# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2026-06-27

### Fixed

- `postinstall` no longer runs a raw `.ts` file. node refuses to
  type-strip TypeScript under `node_modules`, so `node
  scripts/ensure-native.ts` crashed every `npm install` of this
  package (and of anything depending on it) with
  `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`. The script is now
  bundled to `dist/ensure-native.js` and run from there.

## [0.3.0] - 2026-06-26

### Added

- Dutch dosing vocabulary now ships numeric helpers — `NUMBER_WORD_VALUE`,
  `countWordValue()`, `countValue()` — so a consumer maps a `count_word`
  ("driemaal") or a digit to an integer without rebuilding the lookup itself.
- The `×` (U+00D7) sign is recognised as a frequency counter alongside `x`,
  so the grammar tokenises "3× daags".
- The Node binding's types now declare the native-free `construct` metadata
  export the runtime already provided.

### Changed

- Every typed subpath export (`.`, `./grammar`, `./grammar/dutch`,
  `./grammar/latin`, `./grammar/units`) carries an explicit `types` condition,
  so tooling resolves the bundled `.d.ts` without adjacent-file fallback.
- `CHANGELOG.md` now ships in the published npm and JSR packages.

### Fixed

- The `postinstall` no longer recompiles the addon when a matching prebuild is
  already present. It keyed its check off `build/Release/` (never in the
  tarball), so every install rebuilt from source and demanded a C toolchain,
  defeating the shipped prebuilds.

## [0.2.0] - 2026-06-26

### Added

- Dutch patient-label dosing frequencies. `frequency` now parses the prose a
  label actually carries — "3 keer per dag", "driemaal daags", "om de 8 uur" —
  and exposes it with `count:` / `every:` / `period:` fields, plus a
  `count_word` node for spelled-out counts.
- Prebuilt native binaries ship with the npm and JSR packages, so consumers no
  longer compile the addon on install.
- `tree-sitter-recipe.wasm` is reachable through a dedicated subpath export.

### Changed

- Packaging is built around a bundled `dist/` output (tsdown), with subpath
  exports for the grammar vocabulary modules.

### Fixed

- The Node binding's default export is the native language object again, so
  `parser.setLanguage(require("tree-sitter-recipe"))` works instead of throwing
  "Invalid language object".
- JSR `exports` point at the real built file paths, and the package now ships
  its `dist/` and `prebuilds/` instead of silently dropping them.

## [0.1.0] - 2026-04-23

### Added

- Initial release: a tree-sitter grammar for pharmacological recipe notation —
  `R/` ingredient, `Da/` dispense, and `S/` signa sections, Latin abbreviations
  grouped by semantic role, dosage units by measurement kind, dose ranges, and
  layered comments. Ships highlight queries and multi-language bindings.

[Unreleased]: https://github.com/kjanat/tree-sitter-recipe/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/kjanat/tree-sitter-recipe/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/kjanat/tree-sitter-recipe/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kjanat/tree-sitter-recipe/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kjanat/tree-sitter-recipe/releases/tag/v0.1.0

<!-- markdownlint-disable-file MD024 -->
