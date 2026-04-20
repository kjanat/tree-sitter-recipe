import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.prescription.TreeSitterPrescription;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterPrescriptionTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterPrescription.language()));
    }
}
