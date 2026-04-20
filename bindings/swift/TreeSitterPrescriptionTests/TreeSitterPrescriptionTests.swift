import XCTest
import SwiftTreeSitter
import TreeSitterPrescription

final class TreeSitterPrescriptionTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_prescription())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Prescription grammar")
    }
}
