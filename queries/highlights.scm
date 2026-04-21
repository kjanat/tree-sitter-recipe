; Syntax highlighting for .prescription files.
;
; Captures use the Neovim/Helix standard capture vocabulary:
;   https://docs.helix-editor.com/themes.html#syntax-highlighting
;
; ── Seed captures (obvious choices) ──────────────────────────────

; Section markers — the structural backbone: R/, Da/, D/, S/
(recipe_marker)   @keyword.directive
(dispense_marker) @keyword.directive
(signa_marker)    @keyword.directive

; Numbers and units — physical quantities
(number) @number
(unit)   @type.builtin

; Comments — same scheme regardless of tier; doc variants get emphasis via
; a parent-node predicate if your editor supports it.
(line_comment)       @comment
(block_comment)      @comment
(doc_comment_line)   @comment.documentation
(doc_comment_block)  @comment.documentation

; Punctuation — low-visibility glue
(punctuation) @punctuation.delimiter

; ── Design decisions left to you ─────────────────────────────────
;
; TODO: decide capture groups for the Latin abbreviation vocabulary.
; All abbreviations currently parse as a single (latin_abbrev) node —
; but semantically they're not equal:
;
;   Frequency:   b.d.d., t.d.d., q.i.d., s.d.d., d.d.
;   Timing:      a.c., p.c., a.n., m. et v.
;   Route:       i.m., i.v., s.c., subling., o.d., o.s., a.u.e., u.e.
;   Dispensing:  d.s.p., u.c., z.n., d.c.p., d.i.m.m.
;   Warnings:    CITO, PIM            ← emergency / error-prone
;   Forms:       supp., collut., gtt aur., gtt nas., gtt ophth., aq. pur., lin.
;   Conditional: si nec. sit
;
; Possible approaches:
;   (a) One capture for all: (latin_abbrev) @keyword.special
;   (b) Predicate-based split using #match? on the node text:
;         ((latin_abbrev) @keyword.error (#match? @keyword.error "^(CITO|PIM)$"))
;       everything else → @keyword.special
;   (c) Separate highlights per semantic category (most work, best signal).
;
; The choice affects readability of prescriptions at a glance.
; Ask yourself: should a pharmacist's eye be drawn to CITO the same way
; as to `a.c.`? Probably not.

; TODO: (frequency) — currently `1 dd`, `2 dd`, etc. Same or different from
; classical frequency abbreviations above?

; TODO: (fill_to "fill_marker") and (dtd_directive "dtd_keyword")
; The aliased node names were designed so they could carry their own color.
; Decide whether these dispensing directives deserve @keyword.operator
; (distinct from section markers) or share @keyword.directive.

; TODO: (ingredient_line) vs (signa_line) vs (dispense_body) —
; these named line-level nodes exist specifically so consumers can style
; ingredients differently from patient directions. A tool could render
; signa lines in the patient's preferred language style, ingredient lines
; in a medical-name style. Consider:
;   (signa_line (word) @string.documentation)
; to treat signa words as prose.
