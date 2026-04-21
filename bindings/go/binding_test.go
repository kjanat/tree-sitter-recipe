package tree_sitter_prescription_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_prescription "github.com/kjanat/tree-sitter-prescription/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_prescription.Language())
	if language == nil {
		t.Errorf("Error loading Prescription grammar")
	}
}
