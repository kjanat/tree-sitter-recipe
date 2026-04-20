; Section markers
(recipe_marker) @keyword
(signa_marker) @keyword
(da_marker) @keyword

; Ingredients
(drug_name) @type
(ingredient) @field

; Numbers and units
(number) @number
(integer) @number
(dose_unit) @type.builtin
(quantity_unit) @type.builtin
"%" @operator

; Keywords
"ad" @keyword
"aa" @keyword
"q.s." @keyword
"no" @keyword
"no." @keyword

; Dose patterns
(dose) @field
(concentration) @field
(amount) @field
(ad_quantity) @field
(qs_ad_quantity) @field
(aa_quantity) @field
(quantity) @field

; Signa tokens
(frequency) @attribute
(dd_kw) @punctuation.bracket
(x_kw) @punctuation.bracket
(daags_kw) @punctuation.bracket
(timing) @annotation
(administration) @annotation
(warning) @warning
