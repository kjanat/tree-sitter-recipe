; Syntax highlighting for .recipe files.
;
; Captures use the Neovim/Helix standard capture vocabulary:
;   https://docs.helix-editor.com/themes.html#syntax-highlighting
;
; The grammar exposes Latin abbreviations as a `latin_abbrev` supertype with
; eight concrete categories (frequency_abbrev, timing_abbrev, route_abbrev,
; dispensing_abbrev, warning_abbrev, form_abbrev, compounding_abbrev,
; conditional_abbrev). We capture each with a semantically distinct group so
; a pharmacist's eye is drawn to CITO the way it is to `a.c.` — which is to
; say, not the same way at all.

; ── Section markers — structural backbone: R/, Da/, D/, S/ ───────
(rx_marker)       @keyword.directive
(dispense_marker) @keyword.directive
(signa_marker)    @keyword.directive

; ── Physical quantities ──────────────────────────────────────────
(number) @number
(unit)   @type.builtin

; ── Latin vocabulary, by semantic role ───────────────────────────
; Frequency — rhythm of dosing. Highlighted as repetition. The count and
; cadence inside a structured frequency stay repeat-colored too, overriding
; the generic `(number) @number` so "3 keer per dag" reads as one rhythm.
(frequency)         @keyword.repeat
(frequency_abbrev)  @keyword.repeat
(frequency (number) @keyword.repeat)
(count_word)        @keyword.repeat
(period)            @keyword.repeat

; Timing — when relative to meals/sleep.
(timing_abbrev) @keyword

; Route — physical path of administration. Function-call-ish: "deliver via X".
(route_abbrev) @function.macro

; Dispensing — labeling / pharmacist-facing metadata. Attribute-ish.
(dispensing_abbrev) @attribute

; Warnings — CITO, PIM, etc. MUST catch the eye. Error-colored.
(warning_abbrev) @keyword.error

; Forms — the physical preparation. Type-like.
(form_abbrev) @type

; Compounding — verbs of galenic preparation: mf, aa, q.s.
(compounding_abbrev) @keyword.operator

; Conditional — si nec. sit and friends.
(conditional_abbrev) @keyword.conditional

; ── Structural directives ────────────────────────────────────────
; `ad` fill-to and `dtd no N` dispense-this-dose are aliased inside the
; grammar so we can address them directly here.
(fill_to "fill_marker" @keyword.operator)
(dtd_directive "dtd_keyword" @keyword.operator)
(dtd_directive "dtd_no"      @keyword.operator)

; ── Line-level styling ───────────────────────────────────────────
; Ingredient words = drug substances, identifier-style.
(ingredient_line (word) @variable)
; Signa words = prose directions to the patient.
(signa_line (word) @string)
; Dispense body words (rare — usually just a dose) — treat as identifier.
(dispense_body (word) @variable)

; ── Comments ─────────────────────────────────────────────────────
(line_comment)      @comment
(block_comment)     @comment
(doc_comment_line)  @comment.documentation
(doc_comment_block) @comment.documentation

; ── Punctuation — low-visibility glue ────────────────────────────
(punctuation) @punctuation.delimiter
