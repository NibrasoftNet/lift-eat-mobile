# Workflow pour l'Intégration du Module IA avec MCP Server

Ce document détaille les étapes précises pour terminer l'intégration du module IA de Lift-Eat-Mobile en utilisant exclusivement le MCP Server SQLite pour les interactions avec la base de données.

## 📋 Analyse actuelle

L'architecture actuelle présente plusieurs points à améliorer:

1. **Problème principal**: Le module IA (`iaActions.ts`) interagit directement avec `nutrition-database.service` au lieu de passer par le MCP Server.
2. **MCP Server incomplet**: Le serveur MCP (`sqlite-server.ts`) ne propose que des méthodes de lecture, sans méthodes d'écriture.
3. **Architecture fragmentée**: Le module IA est dispersé entre plusieurs fichiers sans service central.

## 🛠️ Workflow d'Implémentation

### Phase 1: Enrichissement du MCP Server
- [x] **1.1 Ajouter les méthodes d'écriture au MCP Server**
  - [x] Implémenter `addMealViaMCP` dans `sqlite-server.ts`
  - [x] Implémenter `addPlanViaMCP` dans `sqlite-server.ts`
  - [x] Implémenter `addIngredientViaMCP` dans `sqlite-server.ts`
  - [x] Implémenter `updateUserPreferencesViaMCP` dans `sqlite-server.ts`

- [ ] **1.2 Améliorer le typage**
  - [x] Remplacer les `any` par des types précis
  - [x] Utiliser les types générés par Drizzle ORM
  - [ ] Documenter les paramètres et retours

- [x] **1.3 Ajouter la gestion des transactions**
  - [x] Implémenter des transactions atomiques pour toutes les opérations d'écriture
  - [x] Assurer le rollback en cas d'erreur

### Phase 2: Refactorisation du Module IA

- [x] **2.1 Créer un service IA centralisé**
  - [x] Implémenter `IAService` comme classe centrale
  - [x] Intégrer les fonctionnalités existantes
  - [x] Mettre en place des événements/observables pour notification

- [x] **2.2 Adapter iaActions.ts**
  - [x] Modifier `processDatabaseAction` pour utiliser le MCP Server
  - [x] Supprimer les références directes à `nutrition-database.service`
  - [x] Ajouter la journalisation des opérations
  - [x] Gérer les erreurs de manière centralisée

- [ ] **2.3 Améliorations UX**
  - [ ] Ajouter des feedbacks utilisateur pour les actions IA
  - [ ] Implémenter des confirmations pour les actions importantes
  - [ ] Afficher des indicateurs de chargement

### Phase 3: Implémentation des Fonctionnalités IA Avancées

- [ ] **3.1 Reconnaissance d'intentions**
  - [ ] Améliorer `promptBuilder.ts` pour mieux détecter les intentions
  - [ ] Ajouter des modèles de prompts pour différents scénarios
  - [ ] Implémenter des suggestions contextuelles

- [ ] **3.2 Analyse nutritionnelle**
  - [ ] Créer un module d'analyse des habitudes alimentaires
  - [ ] Implémenter des recommandations basées sur l'historique
  - [ ] Ajouter des visualisations de données

- [ ] **3.3 Optimisation des plans**
  - [ ] Intégrer l'IA pour optimiser les plans existants
  - [ ] Permettre des ajustements basés sur les préférences
  - [ ] Suggérer des alternatives aux repas

### Phase 4: Tests et Validation

- [ ] **4.1 Tests unitaires**
  - [ ] Tester les services IA individuellement
  - [ ] Vérifier l'intégrité des données
  - [ ] Tester les scénarios d'erreur

- [ ] **4.2 Tests d'intégration**
  - [ ] Vérifier le flux complet depuis l'UI jusqu'à la BD via MCP
  - [ ] Tester les performances avec des volumes importants
  - [ ] Simuler des scénarios utilisateur complexes

- [ ] **4.3 Tests de charge**
  - [ ] Évaluer les performances avec de nombreuses requêtes simultanées
  - [ ] Identifier les goulots d'étranglement
  - [ ] Optimiser les requêtes critiques

## 📝 Détails d'Implémentation

### Implémentation de `addMealViaMCP`

```typescript
/**
 * Ajoute un repas via le MCP server
 */
public async addMealViaMCP({
  name,
  type = MealTypeEnum.BREAKFAST,
  description = '',
  cuisine = CuisineTypeEnum.GENERAL,
  calories = 0,
  carbs = 0,
  protein = 0,
  fat = 0,
  quantity = 10,
  unit = MealUnitEnum.GRAMMES,
  creatorId,
  ingredients = []
}: IaMealType & { creatorId: number }): Promise<{ success: boolean; mealId?: number; error?: string }> {
  try {
    if (!this.db) throw new Error("Database not initialized");
    
    // Utiliser une transaction pour assurer l'intégrité des données
    return await this.db.transaction(async (tx) => {
      // 1. Créer le repas
      const mealResult = await tx
        .insert(meals)
        .values({
          name,
          type,
          description,
          cuisine,
          calories,
          carbs,
          protein,
          fat,
          quantity,
          unit,
          creatorId
        })
        .returning({ id: meals.id });
      
      if (!mealResult || mealResult.length === 0) {
        throw new Error('Failed to create meal');
      }
      
      const mealId = mealResult[0].id;
      
      // 2. Ajouter les ingrédients si fournis
      if (ingredients && ingredients.length > 0) {
        for (const ingredient of ingredients) {
          // Créer ou obtenir l'ingrédient standard
          // ...
        }
      }
      
      return { success: true, mealId };
    });
  } catch (error) {
    console.error('Error in addMealViaMCP:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
```

### Modification de `iaActions.ts`

```typescript
/**
 * Traite l'action d'ajout de repas
 */
async function processMealAction(mealData: IaMealType, userId: number): Promise<void> {
  try {
    // Remplacer l'appel direct à nutritionDatabaseService
    // AVANT:
    // await nutritionDatabaseService.addMeal({...});
    
    // APRÈS:
    const result = await sqliteMCPServer.addMealViaMCP({
      ...mealData,
      creatorId: userId
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    console.log('Meal added to database via MCP:', mealData.name);
  } catch (error) {
    console.error('Error processing meal action:', error);
    throw error;
  }
}
```

## ⚠️ Points d'attention

1. **Transactions obligatoires**: Toutes les méthodes d'écriture du MCP Server doivent utiliser des transactions pour garantir l'intégrité des données.

2. **Gestion des erreurs**: Standardiser la gestion des erreurs avec des codes d'erreur spécifiques et des messages utilisateur adaptés.

3. **Performance**: Surveiller les performances des requêtes IA, en particulier pour les opérations complexes comme l'ajout de repas avec de nombreux ingrédients.

4. **Tests exhaustifs**: Toute modification du MCP Server doit être accompagnée de tests rigoureux pour éviter les régressions.

## 📈 Métriques de succès

- Toutes les interactions entre l'IA et la base de données passent par le MCP Server
- Réduction du temps de réponse de l'IA pour les actions complexes
- Amélioration de la qualité des suggestions nutritionnelles
- Augmentation du taux d'adoption des plans générés par l'IA

## 🔄 Prochaine itération

Une fois ces modifications terminées, vous pourrez envisager:

1. L'intégration de capacités d'analyse prédictive
2. L'ajout de fonctionnalités de reconnaissance d'images pour les aliments
3. L'enrichissement du contexte utilisateur avec des données externes (saison, disponibilité des aliments, etc.)
