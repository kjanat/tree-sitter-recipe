import XCTest
import SwiftTreeSitter
import TreeSitterRecipe

final class TreeSitterRecipeTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_recipe())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Recipe grammar")
    }
}
