#!/usr/bin/env -S vhs

# Output configuration
Output demo.gif
Output demo.mp4

# Terminal settings
Set FontSize 16
Set Width 750
Set Height 500
Set Theme "Catppuccin Macchiato"

Hide
Type `export TREE_SITTER_RECIPE_GRAMMAR_PATH="$(pwd)"`
Enter
Ctrl+L

Show
Type `tree-sitter highlight test.recipe`
Sleep 500ms
Enter

# Give the viewer time to read the highlighted output
Sleep 4s
