import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.recipe.TreeSitterRecipe;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterRecipeTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterRecipe.language()));
    }
}
