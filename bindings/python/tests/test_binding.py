from unittest import TestCase

from tree_sitter import Language, Parser
import tree_sitter_prescription


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            Parser(Language(tree_sitter_prescription.language()))
        except Exception:
            self.fail("Error loading Prescription grammar")
