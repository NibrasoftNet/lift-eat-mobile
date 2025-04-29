# Checklist de Migration vers l'Architecture MCP

Cette checklist définit les étapes progressives pour migrer les composants de Lift-Eat-Mobile vers l'architecture MCP, en éliminant les accès directs à la base de données.

## Phase 1: Préparation et planification

- [x] **Documenter l'architecture MCP existante**
  - [x] Définir clairement le rôle de chaque couche (UI, Service, MCP, Handler)
  - [x] Documenter les conventions de nommage et les patterns existants

- [x] **Créer ou compléter les services manquants**
  - [x] `progressService.ts` pour les fonctionnalités de suivi et d'analyse <!-- Service migré vers MCP. Toutes les opérations de progression (création, mise à jour, récupération, marquage repas consommé) passent désormais par progressService et les méthodes MCP. Accès DB direct supprimé. Cache invalidé via React Query. -->
  - [x] `nutritionService.ts` pour les calculs de nutrition <!-- Service complet et conforme MCP. Centralise tous les calculs nutritionnels (repas, journée, macros, validation). Utilise MCP en priorité, fallback helper local si besoin. Gestion d'erreur et logs intégrés. Prêt pour extension future (besoins caloriques, analyses avancées). -->
  - [x] `authService.ts` pour l'authentification et la gestion des utilisateurs <!-- Migration finalisée : toute la logique métier (login, register, reset, update) est centralisée dans authService.ts, conforme MCP. Les services pages (auth-pages.service.ts) ne font qu'orchestrer pour la UI. Gestion d'erreur et logs intégrés. Aucun accès DB direct ni logique métier dans les pages. -->
  - [x] `userService.ts` pour la gestion des utilisateurs <!-- Migration finalisée : toute la logique métier (profil, préférences, détails) est centralisée dans userService.ts, conforme MCP. Les services pages (user-pages.service.ts) ne font qu'orchestrer pour la UI. Aucun accès DB direct ni logique métier dans les pages. Séparation claire des responsabilités. -->
  - [x] Logique assistant/IA centralisée dans `ia.service.ts` <!-- Toute la logique métier liée à l'assistant (conseils, IA, feedback) est centralisée dans ia.service.ts. Les services pages (assistant-pages.service.ts) ne font qu'orchestrer pour la UI. Aucun accès DB direct ni logique métier dans les pages. Vérifié et conforme à l'architecture MCP. -->

- [x] **Créer ou compléter les services de pages manquants**
  - [x] `userPagesService.ts` pour les pages utilisateur <!-- Service pages utilisateur conforme MCP : ne fait qu'orchestrer, toute logique métier dans userService.ts. Aucun TODO, prêt pour extension/tests. -->
  - [x] `mealPagesService.ts` pour les pages de repas <!-- Service pages repas conforme MCP : délégation stricte vers mealService.ts, typage strict respecté, aucune logique métier ni TODO. -->
  - [x] `analyticsPagesService.ts` pour les pages d'analyse <!-- Squelette conforme MCP, prêt à être étendu dès que la logique métier analytics sera définie. Aucun TODO. -->


## Phase 2: Migration des composants simples

- [ ] **Formulaires**
  - [x] `CalculateCaloriesIntakeForm`
    - [x] Identifier les accès directs à la base de données : accès direct à sqliteMCPServer et à useDrizzleDb repéré.
    - [x] Créer les méthodes équivalentes dans `nutritionService` : méthode calculateCaloriesIntake implémentée avec la formule Mifflin-St Jeor et updateUserNutritionPreferences ajoutée.
    - [x] Remplacer les appels DB par des appels au service : création de nutritionPagesService et remplacement de sqliteMCPServer par nutritionPagesService.
    - [x] Tester la fonctionnalité : migrations terminées et fonctionnelles.

  - [x] `UserDetailsForm`
    - [x] Identifier les accès directs à la base de données : accès direct à useDrizzleDb repéré, userDetailsFormService utilisé mais à auditer.
    - [x] Créer les méthodes équivalentes dans `userService` : implémentation de updateUserProfile, updateUserPreferences et updateUserDetails pour centraliser la logique métier.
    - [x] Remplacer les appels DB par des appels au service : remplacer useDrizzleDb par userPagesService et restructuration de userDetailsFormService pour séparer la préparation des données de la persistance.
    - [x] Tester la fonctionnalité : migration terminée et fonctionnelle.

  - [x] `UserProfileForm`
    - [x] Identifier les accès directs à la base de données : accès direct très important via useDrizzleDb avec update/where/eq, imports de schema et drizzle-orm.
    - [x] Créer les méthodes équivalentes dans `userService` : implémentation de updateUserProfileData qui convertit les données de profil en format compatible avec le MCP.
    - [x] Remplacer les appels DB par des appels au service : suppression des imports de drizzle et mise à jour via userPagesService.updateUserProfileData.
    - [x] Tester la fonctionnalité : migration terminée et fonctionnelle.

  - [x] `NutritionGoalForm`
    - [x] Identifier les accès directs à la base de données : accès directs via useDrizzleDb, sqliteMCPServer.createPlanViaMCP découverts.
    - [x] Créer les méthodes équivalentes dans `nutritionService` : implémentation de createPlan pour centraliser la création de plans.
    - [x] Remplacer les appels DB par des appels au service : suppression de useDrizzleDb et remplacement des appels directs à sqliteMCPServer par nutritionPagesService.createPlan.
    - [x] Tester la fonctionnalité : migration terminée et fonctionnelle.

- [x] **Composants Repas**
  - [x] `MealCard.tsx` migré : suppression et invalidation passent par mealPagesService, plus aucun accès direct à la logique métier ou DB.
  - [x] `MealForm.tsx` : la logique de création/modification passe déjà par mealFormService qui utilise le MCP (sqliteMCPServer). Aucun accès direct à la DB ou handler depuis le composant. Conforme MCP.

  - [x] `MealsClickSelection`
    - [x] Identifier les accès directs à la base de données : suppression de useDrizzleDb, appels directs à progressService pour markMealAsConsumed et invalidateProgressionCache.
    - [x] Créer les méthodes équivalentes dans `progressPagesService` : implémentation de markMealAsConsumed et invalidateProgressionCache pour exposer les fonctionnalités de progressService.
    - [x] Remplacer les appels DB par des appels au service : suppression de l'import drizzleDb et remplacement de progressService par progressPagesService.
    - [x] Tester la fonctionnalité : migration terminée et fonctionnelle.

  - [x] `MealsCompanyStyleV2`
    - [x] Identifier les accès directs à la base de données : suppression de useDrizzleDb, découverte d'appels directs à markMealAsConsumed via drizzleDb dans mealsCompanyStyleService.
    - [x] Créer les méthodes équivalentes dans `progressPagesService` : utilisation des méthodes markMealAsConsumed et invalidateProgressionCache déjà créées.
    - [x] Remplacer les appels DB par des appels au service : modification de updateMealsStatus pour utiliser progressPagesService et gestion de l'invalidation du cache.
    - [x] Tester la fonctionnalité : migration terminée et fonctionnelle.

  - [x] `ProgressCalendarTab`
    - [x] Identifier les accès directs à la base de données : suppression de useDrizzleDb et sqliteMCPServer remplacés par des appels aux services de pages.
    - [x] Créer les méthodes équivalentes : ajout de getCurrentPlan dans planPagesService pour récupérer le plan courant.
    - [x] Remplacer les appels DB par des appels au service : remplacement des appels directs à sqliteMCPServer par des appels aux services planPagesService, progressPagesService et userPagesService.
    - [x] Tester la fonctionnalité : migration terminée et fonctionnelle.

## Phase 3: Migration des écrans principaux

- [ ] **Écrans Utilisateur**
  - [ ] `profile/[id].tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `userPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `preference/edit/[id].tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `userPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `details/edit/[id].tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `userPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

- [ ] **Écrans de Plans**
  - [ ] `my-plans/create/index.tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `planPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `my-plans/details/[id].tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `planPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

- [ ] **Écrans de Repas**
  - [ ] `my-meals/create.tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `mealPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `my-meals/index.tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `mealPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `my-meals/edit/[id].tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `mealPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

- [ ] **Autres écrans**
  - [ ] `login.tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `authService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `assistant.tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `assistantService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

  - [ ] `analytics.tsx`
    - [ ] Identifier les accès directs à la base de données
    - [ ] Créer les méthodes équivalentes dans `analyticsPagesService`
    - [ ] Remplacer les appels DB par des appels au service
    - [ ] Tester la fonctionnalité

## Phase 4: Validation et Consolidation

- [ ] **Tests d'intégration**
  - [ ] Exécuter des tests couvrant les principaux flux utilisateurs
  - [ ] Vérifier que toutes les fonctionnalités sont opérationnelles

- [ ] **Optimisation des performances**
  - [ ] Identifier et résoudre les requêtes inefficaces
  - [ ] Implémenter des stratégies de mise en cache si nécessaire

- [ ] **Documentation à jour**
  - [ ] Mettre à jour la documentation de l'architecture
  - [ ] Documenter les services et leur utilisation

## Phase 5: Finalisation et Mise en Production

- [ ] **Audit final**
  - [ ] Vérifier qu'aucun accès direct à la DB ne subsiste
  - [ ] Vérifier la cohérence des pratiques entre services

- [ ] **Préparation de la mise en production**
  - [ ] Exécuter les tests de régression
  - [ ] Vérifier la compatibilité avec les différentes plateformes (iOS, Android)

- [ ] **Déploiement**
  - [ ] Déployer les changements en production
  - [ ] Surveiller les métriques d'application

## Conseils et Meilleures Pratiques

1. **Approche par lots**: Migrez les composants par lots fonctionnels plutôt que de façon aléatoire
2. **Tests continus**: Testez après chaque modification importante
3. **Limiter la dette technique**: Évitez les solutions temporaires
4. **Documentation en parallèle**: Documentez au fur et à mesure des modifications
5. **Revues de code**: Effectuez des revues de code pour garantir la qualité

## Outils et Ressources

- Utiliser les gestionnaires de tâches (Jira, Trello) pour suivre la progression
- Utiliser Git avec des branches de fonctionnalités pour isoler les changements
- Mettre en place des pipelines CI/CD pour automatiser les tests
