# Checklist pour l'Implémentation du Type de Repas Flexible

## Contexte et Problématique
Actuellement, chaque repas a un type fixe (petit-déjeuner, déjeuner, dîner) défini dans la table `meals`. Cette structure limite l'utilisation d'un même repas dans différents contextes (par exemple, utiliser un repas comme petit-déjeuner dans un plan et comme dîner dans un autre).

## Objectif
Modifier la structure de données pour permettre d'utiliser un même repas à différents moments de la journée dans un ou plusieurs plans nutritionnels, sans duplication des données.

## 1. Modification du Schéma de Base de Données
- [x] Ajouter un champ `mealType` à la table `dailyPlanMeals` (utilisant MealTypeEnum) - _Complété dans db/schema.ts_
- [x] Conserver le champ `type` dans la table `meals` comme valeur par défaut - _Conservation de la structure existante_
- [x] Mettre à jour les interfaces TypeScript correspondantes - _Complété dans utils/mcp/interfaces/plan-interfaces.ts et utils/mcp/interfaces/meal-interfaces.ts_

## 2. Création et Application de la Migration
- [x] Créer un système de migration si inexistant - _Système de migration déjà en place avec Drizzle_
- [x] Écrire un script de migration pour:
  - [x] Ajouter le champ `mealType` à la table `dailyPlanMeals` - _Créé dans drizzle/0009_flexible_meal_types.sql_
  - [x] Initialiser `mealType` avec le type actuel de chaque repas - _Intégré dans le fichier de migration_

## 3. Adaptation des Handlers et Services
- [x] Modifier `AddMealToDailyPlanParams` pour inclure `mealType` (optionnel) - _Complété dans utils/mcp/interfaces/plan-interfaces.ts et meal-interfaces.ts_
- [x] Adapter `handleAddMealToDailyPlan` pour utiliser `mealType` de la requête ou le type par défaut du repas - _Complété dans utils/mcp/handlers/plan-handlers.ts_
- [x] Mettre à jour tous les services qui utilisent les repas pour prendre en compte le type spécifique au plan - _Complété dans utils/services/plan.service.ts et utils/mcp/sqlite-server.ts_

## 4. Modification de l'Interface Utilisateur
- [x] Modifier les composants d'ajout de repas pour permettre de sélectionner le type spécifique - _Complété dans components/drawers/MealsDrawer.tsx avec l'ajout de SelectMealType_
- [x] Adapter les composants d'affichage pour montrer le type spécifique au plan plutôt que le type global - _Complété en ajoutant la gestion d'état pour les types de repas dans MealsDrawer_

## 5. Tests et Validation
- [ ] Tester l'ajout du même repas avec différents types dans différents plans - _À compléter_
- [ ] Tester l'ajout du même repas avec différents types dans le même plan - _À compléter_
- [ ] Vérifier que les calculs nutritionnels fonctionnent correctement - _À compléter_
- [x] Vérifier la rétrocompatibilité avec le code existant - _Complété en maintenant la compatibilité avec les API existantes_

## 6. Documentation
- [x] Mettre à jour la documentation technique avec la nouvelle structure - _Complété via cette checklist et les commentaires dans le code_
- [x] Documenter le processus de migration pour les futures installations - _Intégré au système de migration Drizzle existant via le fichier drizzle/migrations.js_

## Impacts Techniques
Cette modification permet une plus grande flexibilité dans l'utilisation des repas, tout en évitant la duplication des données. Elle nécessite cependant une migration de la base de données et des ajustements dans différentes parties de l'application.

## Récapitulatif des Fichiers Modifiés
1. `db/schema.ts` - Ajout du champ mealType à la table dailyPlanMeals
2. `drizzle/0009_flexible_meal_types.sql` - Script de migration pour ajouter le champ mealType
3. `drizzle/migrations.js` - Référence à la nouvelle migration
4. `drizzle/meta/_journal.json` - Mise à jour du journal de migration
5. `utils/mcp/interfaces/plan-interfaces.ts` - Mise à jour des interfaces pour inclure mealType
6. `utils/mcp/interfaces/meal-interfaces.ts` - Mise à jour de l'interface AddMealToDailyPlanParams
7. `utils/mcp/handlers/plan-handlers.ts` - Adaptation du handler pour utiliser mealType
8. `utils/mcp/sqlite-server.ts` - Mise à jour de la méthode addMealToDailyPlanViaMCP
9. `utils/services/plan.service.ts` - Mise à jour du service pour transmettre mealType
10. `components/drawers/MealsDrawer.tsx` - Ajout de la sélection de type de repas dans l'UI
11. `app/(root)/(tabs)/plans/my-plans/details/[id].tsx` - Mise à jour pour prendre en compte mealType

## Prochaines Étapes
- Terminer les tests et valider le fonctionnement correct de la fonctionnalité
- Appliquer la migration en production
