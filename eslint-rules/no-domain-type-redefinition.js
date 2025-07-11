/**
 * ESLint local rule: forbid redeclaration of core domain types inside TS/TSX files.
 * Instead, developers must import them from the dedicated `types/` folder or `db/schema`.
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow redeclaring shared domain types (Meal, FoodItem, etc.)',
    },
    schema: [], // no options
  },

  create(context) {
    const FORBIDDEN = new Set([
      'Meal',
      'FoodItem',
      'Ingredient',
      'IngredientWithUniqueId',
      'Plan',
    ]);

    function reportIfForbidden(node) {
      const name = node.id && node.id.name;
      if (name && FORBIDDEN.has(name)) {
        context.report({
          node,
          message: `Do not redeclare domain type \"${name}\". Import it from the shared types folder instead.`,
        });
      }
    }

    return {
      TSInterfaceDeclaration: reportIfForbidden,
      TSTypeAliasDeclaration: reportIfForbidden,
    };
  },
};
