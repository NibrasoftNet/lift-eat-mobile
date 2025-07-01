# Checklist de Refactorisation des Services MCP

Ce document détaille les problèmes identifiés dans les services de l'application Lift et propose des étapes concrètes pour les résoudre, conformément à l'architecture MCP complète.

## 1. Architecture MCP Complète

Rappel de l'architecture complète de l'application Lift:

```
UI (React/React Native Components)
    ↓ ↑
Services UI (UI spécifique)
    ↓ ↑
Services Forms (Gestion des formulaires)
    ↓ ↑
Services Pages (Presenter)
    ↓ ↑
Services Core (Controller)
    ↓ ↑
Handlers MCP (Model)
    ↓ ↑
Base de données (SQLite)
```

### 1.1 Responsabilités par Couche

#### UI (React/React Native)
- Composants d'interface utilisateur
- Interactions utilisateur basiques
- Utilisation des hooks pour obtenir les données

#### Services UI (`utils/services/ui`)
- Formatage des données pour l'affichage
- Gestion des classes CSS dynamiques
- Utilitaires spécifiques à l'UI

#### Services Forms (`utils/services/forms`)
- Validation des entrées utilisateur
- Préparation des données de formulaire
- Gestion des états de formulaire

#### Services Pages (`utils/services/pages`) - Presenter
- Orchestration des opérations pour l'UI
- Délégation aux services core
- Gestion des erreurs orientée UI

#### Services Core (`utils/services/core`) - Controller
- Logique métier pure
- Calculs et transformations de données
- Orchestration des handlers MCP

#### Handlers MCP (`utils/mcp`) - Model
- Accès direct à la base de données
- Validation des données au niveau DB
- Gestion des transactions

## 2. Problèmes Identifiés

### 2.1 Problèmes de Nommage et Organisation

| Problème | Fichiers concernés | Impact | Statut |
|----------|-------------------|--------|--------|
| Incohérence dans le nommage des services | ~~`cooking-method.service.ts`~~ → `cooking-method-pages.service.ts` | Difficulté à identifier les services pages vs core | ✅ Corrigé |
| Constants mélangées dans les services | ~~`cooking-method.service.ts` (COOKING_METHODS_INFO)~~ → `cooking-method-info.constants.ts` | Duplication potentielle, difficile à réutiliser | ✅ Corrigé |
| Interfaces définies dans les services | Plusieurs services pages | Fragmentation de la définition des types | 🔄 En cours |

### 2.2 Problèmes de Responsabilité

| Problème | Fichiers concernés | Impact | Statut |
|----------|-------------------|--------|--------|
| Logique métier dans les services pages | ~~`cooking-method.service.ts` (calculateAdjustmentPercentages, formatPercentage)~~ → déplacé vers `cooking-method-core.service.ts`<br>~~`assistant-pages.service.ts` (validation d'ingrédients, génération de recommandations)~~ → déplacé vers `assistant-core.service.ts`<br>~~`ingredient-pages.service.ts` (formatIngredientForDisplay, optimizeIngredientData)~~ → déplacé vers services UI et core appropriés<br>~~`plan-pages.service.ts` (filtrage, pagination, validation)~~ → déplacé vers `plan.service.ts`<br>~~`progress-pages.service.ts` (limitation à 31 jours, boucle de récupération de données)~~ → déplacé vers `progress.service.ts` | Violation du principe MCP, duplication | ✅ Majoritairement corrigé |
| Accès direct aux données | ~~`cooking-method.service.ts`~~ → corrigé<br>~~`assistant-pages.service.ts` (appels directs à sqliteMCPServer)~~ → corrigé<br>~~`ingredient-pages.service.ts` (appel direct à sqliteMCPServer.getIngredientsListViaMCP)~~ → corrigé<br>~~`plan-pages.service.ts` (appel direct à sqliteMCPServer.getPlansListViaMCP)~~ → corrigé<br>~~`progress-pages.service.ts` (multiple appels directs à sqliteMCPServer)~~ → corrigé | Contournement de la couche Controller | ✅ Corrigé |
| Appels directs entre services non-core | ~~`assistant-pages.service.ts` (appel direct à iaService)~~ → corrigé<br>~~`plan-pages.service.ts` (appel direct à nutritionPagesService)~~ → corrigé | Violation de la hiérarchie MCP | ✅ Corrigé |
| Méthodes d'UI dans les services pages | ~~`cooking-method.service.ts` (getDifferenceClass)~~ → déplacé vers `cooking-method-ui.service.ts`<br>~~`ingredient-pages.service.ts` (formatIngredientForDisplay)~~ → déplacé vers `ingredient-ui.service.ts` | Mélange des responsabilités P et UI | ✅ Partiellement corrigé |

### 2.3 Problèmes de Duplication

| Problème | Fichiers concernés | Impact | Statut |
|----------|-------------------|--------|--------|
| Fichiers dupliqués | ~~`assistant-pages.service.new.ts` et `assistant-pages.service.ts`~~ → supprimé | Confusion dans la maintenance | ✅ Corrigé |
| Méthodes utilitaires dupliquées | formatPercentage, getPercentage | Risque d'incohérence, maintenance difficile | ✅ Corrigé |
| Centralisation des fonctions UI | Fonctions de formatage UI | Améliore la maintenabilité, cohérence | ✅ Implémenté |
| Logique de conversion nutritionnelle | Entre nutrition-pages.service et cooking-method.service | Duplication partielle des calculs | ✅ Corrigé |

## 3. Plan de Refactorisation

### Étape 1: Standardisation des Noms de Services

#### 1.1 Services Pages: renommer avec le suffixe `-pages.service.ts`

- [x] Tous les services pages suivent déjà la convention `-pages.service.ts`
  - [x] `analytics-pages.service.ts`
  - [x] `assistant-pages.service.ts`
  - [x] `auth-pages.service.ts`
  - [x] `cooking-method-pages.service.ts`
  - [x] `ingredient-pages.service.ts`
  - [x] `meal-pages.service.ts`
  - [x] `nutrition-pages.service.ts`
  - [x] `plan-pages.service.ts`
  - [x] `progress-pages.service.ts`
  - [x] `user-pages.service.ts`

#### 1.2 Services Core: standardiser avec le suffixe `-core.service.ts`

- [x] Renommer tous les services core pour inclure le suffixe `-core` (complété le 6 mai 2025)
  - [x] `analytics.service.ts` → `analytics-core.service.ts` (migré le 6 mai 2025)
  - [x] `assistant-core.service.ts` (déjà conforme)
  - [x] `auth.service.ts` → `auth-core.service.ts` (migré le 6 mai 2025)
  - [x] `cooking-method-core.service.ts` (déjà conforme)
  - [x] `gemini.service.ts` → `gemini-core.service.ts` (migré le 6 mai 2025)
  - [x] `ingredient-suggestion.service.ts` → `ingredient-suggestion-core.service.ts` (migré le 6 mai 2025)
  - [x] `ingredient.service.ts` → `ingredient-core.service.ts` (migré le 6 mai 2025)
  - [x] `meal-core.service.ts` (déjà conforme)
  - [x] `nutrition-core.service.ts` (déjà conforme)
  - [x] `plan-core.service.ts` (déjà conforme)
  - [x] `progress-core.service.ts` (déjà conforme)
  - [x] `user.service.ts` → `user-core.service.ts` (migré le 6 mai 2025)

#### 1.3 Services UI: standardiser avec le suffixe `-ui.service.ts`

- [ ] Renommer les services avec préfixe `ui-` vers le suffixe `-ui`
  - [x] `cooking-method-ui.service.ts` (déjà conforme)
  - [x] `ingredient-ui.service.ts` (déjà conforme)
  - [x] `nutrition-ui.service.ts` (déjà conforme)
  - [x] `ui-deletion-modal.service.ts` → `deletion-modal-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-drawer.service.ts` → `drawer-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-forget-password-modal.service.ts` → `forget-password-modal-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-general-settings-drawer.service.ts` → `general-settings-drawer-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-ingredient-drawer.service.ts` → `ingredient-drawer-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-meal-drawer.service.ts` → `meal-drawer-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-meal-options-modal.service.ts` → `meal-options-modal-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-options-drawer.service.ts` → `options-drawer-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-preferences.service.ts` → `preferences-ui.service.ts` (migré le 6 mai 2025)
  - [x] `ui-user-settings-drawer.service.ts` → `user-settings-drawer-ui.service.ts` (migré le 6 mai 2025)
  - [x] `weight-input.service.ts` → `weight-input-ui.service.ts` (migré le 6 mai 2025)

#### 1.4 Services Forms: standardiser avec le préfixe `form-`

- [x] Tous les services Forms suivent déjà la convention `form-*.service.ts`
  - [x] `form-calories-intake.service.ts`
  - [x] `form-duration.service.ts`
  - [x] `form-gender.service.ts`
  - [x] `form-goal.service.ts`
  - [x] `form-input.service.ts`
  - [x] `form-meal.service.ts`
  - [x] `form-nutrition-goal.service.ts`
  - [x] `form-physical-activity.service.ts`
  - [x] `form-user-details.service.ts`
  - [x] `form-user-gender-activity.service.ts`
  - [x] `form-user-profile.service.ts`

#### 1.5 Stratégie de migration

- [ ] Développer un script de migration pour automatiser le processus (optionnel)
- [ ] Migrer par couche, en commençant par les services core
- [ ] Pour chaque service, effectuer les étapes suivantes:
  - [ ] Créer un nouveau fichier avec le nom standardisé
  - [ ] Copier et adapter le contenu
  - [ ] Mettre à jour toutes les importations qui référencent l'ancien service
  - [ ] Supprimer l'ancien fichier

### Étape 2: Externalisation des Constants et Interfaces

- [x] Constantes: déplacer vers le dossier approprié
  - [x] Déplacer `COOKING_METHODS_INFO` vers `utils/constants/cooking-method-info.constants.ts`
  - [x] Externaliser les constantes UI dans `utils/constants/ui-constants.ts`
    - [x] Déplacer `UI_PREFERENCES_KEY` depuis `ui-preferences.service.ts`
    - [x] Déplacer les constantes drawer depuis `ui-drawer.service.ts`

- [x] Interfaces: centraliser dans des fichiers dédiés
  - [x] Déplacer les interfaces génériques vers des fichiers dans `utils/interfaces/`
    - [x] Créer `ui-services.interface.ts` pour les interfaces UI
    - [x] Créer `pages-services.interface.ts` pour les interfaces présentation
    - [x] Créer `forms-services.interface.ts` pour les interfaces formulaires
  - [x] Standardiser les interfaces de service avec le suffixe `*ServiceInterface`

### Étape 3: Séparation selon l'Architecture à 6 Niveaux

#### 3.0 Nettoyage des services existants

- [x] Éliminer les duplications dans les services
  - [x] Supprimer `assistant-pages.service.new.ts` (copie de `assistant-pages.service.ts`)
  - [x] ~~Déprécier~~ → **Supprimer** `nutrition-database.service.ts` (remplacé par sqliteMCPServer)
  - [x] ~~Déprécier~~ → **Supprimer** `cooking-method.service.ts` (remplacé par cooking-method-*.service.ts)

#### 3.1 Séparation UI / Services UI

- [ ] Identifier les méthodes UI dans les services pages
  - [x] Déplacer `getDifferenceClass` de `cooking-method.service.ts` vers `cooking-method-ui.service.ts`
  - [x] Déplacer les méthodes de formatage d'affichage de cuisson vers `cooking-method-ui.service.ts`
  - [x] Déplacer `formatIngredientForDisplay` de `ingredient-pages.service.ts` vers un service UI
  - [ ] Vérifier tous les formateurs de données pour l'affichage

- [ ] Créer ou compléter les services UI appropriés
  - [x] Créer `cooking-method-ui.service.ts` pour les méthodes UI (formatage, classes CSS)
  - [x] Créer `ingredient-ui.service.ts` pour le formatage des ingrédients dans l'UI
  - [ ] Créer ou compléter les autres services UI nécessaires

#### 3.2 Séparation Services Forms / Services Pages

- [ ] Identifier la logique de formulaire dans les services pages
  - [ ] Vérifier tous les validateurs de formulaires dans les services pages
  - [ ] Identifier les transformations de données spécifiques aux formulaires

- [ ] Créer ou compléter les services Forms appropriés
  - [ ] S'assurer que les formulaires complexes ont leur propre service
  - [ ] Vérifier que chaque service form implémente une interface claire

#### 3.3 Séparation Services Pages (Presenter) / Services Core (Controller)

##### 3.3.1 Pour cooking-method.service.ts

- [x] Créer `utils/services/core/cooking-method-core.service.ts` (s'il n'existe pas)
- [x] Déplacer les méthodes de logique métier vers le service core:
  - [x] `calculateAdjustmentPercentages`
  - [x] `getPercentage`
  - [x] `calculateCookingMethodAdjustments`
- [x] Assurer que le service pages ne fait que déléguer au service core

##### 3.3.2 Pour assistant-pages.service.ts

- [x] Créer `utils/services/core/assistant-core.service.ts`
- [x] Déplacer la logique de validation des ingrédients vers ce service core
- [x] Remplacer l'appel direct à `iaService` par un appel au service core
- [x] Supprimer les appels directs à `sqliteMCPServer`

##### 3.3.3 Pour ingredient-pages.service.ts

- [x] Déplacer la méthode `formatIngredientForDisplay` vers un service UI
  - [x] Créer `ingredient-ui.service.ts` avec la logique de formatage
  - [x] Modifier le service pages pour déléguer au service UI
- [x] Déplacer la méthode `optimizeIngredientData` vers le service core
  - [x] Ajouter la méthode au service `ingredient.service.ts`
  - [x] Supprimer la méthode du service pages
- [x] Remplacer l'appel direct à `sqliteMCPServer.getIngredientsListViaMCP` par une délégation au service core
  - [x] Créer la méthode `getIngredientsList` dans le service core
  - [x] Adapter le service pages pour l'utiliser

##### 3.3.4 Pour plan-pages.service.ts

- [x] Ajouter des méthodes au service core existant `utils/services/core/plan.service.ts`
  - [x] Déplacer la logique de filtrage/pagination depuis `getPlansList`
  - [x] Déplacer la logique d'ajustement nutritionnel des repas
- [x] Remplacer les appels à `nutritionPagesService` par des appels au service core approprié

##### 3.3.5 Pour progress-pages.service.ts

- [x] Utiliser `utils/services/core/progress.service.ts` qui existe déjà
- [x] Déplacer la logique de limitation de jours et de récupération de données vers le service core
  - [x] Ajout de la méthode `getProgressHistory` à progress.service.ts avec limitation à 31 jours
  - [x] Utilisation des méthodes existantes comme `updateDailyProgress` et `markMealAsConsumed`
- [x] Refactoriser les méthodes du service pages pour déléguer au service core :
  - [x] `getProgressHistory` délègue à progressService.getProgressHistory
  - [x] `updateProgress` délègue à progressService.updateDailyProgress
  - [x] `markMealAsConsumed` délègue à progressService.markMealAsConsumed
- [x] Standardiser la gestion des erreurs et la journalisation

#### 3.4 Séparation Services Core (Controller) / Handlers MCP (Model)

- [x] Vérifier que tous les services core n'accèdent aux données que via les handlers MCP
  - [x] Tous les services analysés utilisent systématiquement `sqliteMCPServer` pour l'accès aux données
  - [x] Aucun accès direct à la base de données identifié dans les services core
- [x] S'assurer que les méthodes MCP suivent la convention `*ViaMCP`
  - [x] Toutes les méthodes d'accès aux données utilisent le suffixe `ViaMCP` de manière cohérente
  - [x] Les interfaces sont respectées dans tous les appels observés
- [x] Vérifier que toutes les transactions complexes sont gérées au niveau MCP
  - [x] Les opérations CRUD complexes sont encapsulées dans des méthodes MCP dédiées
  - [x] Transactions en deux étapes correctement gérées avec vérification d'erreurs
  - [x] Quelques opérations de filtrage pourraient être optimisées côté MCP plutôt que contrôleur

### Étape 4: Création d'Utilitaires Communs

- [ ] Utilitaires UI
  - [x] Centralisation des calculs nutritionnels dans `nutrition-core.service.ts`
  - [x] Façade unifiée via `nutritionEngine` pour les calculs nutritionnels
  - [x] Créer `nutrition-ui.service.ts` pour standardiser l'affichage des valeurs à 100g
  - [x] Suppression du hook `useNormalizedNutrition` au profit des services MCP
  - [x] Formatage standardisé des valeurs nutritionnelles et facteurs d'ajustement
  - [ ] Créer un service pour les classes CSS dynamiques

- [ ] Utilitaires Forms
  - [ ] Créer un service pour la validation commune des formulaires
  - [ ] Standardiser les transformations de données

- [ ] Utilitaires Core
  - [ ] Centraliser les calculs communs
  - [ ] Créer des helpers de validation UI dédiés
- [ ] S'assurer que les services UI appellent des services pages (et jamais directement core)

### Étape 5: Centralisation des Utilitaires

- [ ] Créer des helpers dédiés pour les fonctions utilitaires communes:
  - [ ] `utils/helpers/formatter.helper.ts` pour les fonctions de formatage
  - [ ] `utils/helpers/percentage.helper.ts` pour les calculs de pourcentage
- [ ] Refactoriser tous les services pour utiliser ces utilitaires



## 5. Synthèse des Services MCP Analysés

### 5.1 Modèles à Suivre par Couche

#### Services UI
- Modèle: `meals-company-style.service.ts`
  - Contient uniquement du formatage UI
  - Pas d'accès aux données
  - Fonctions pures de transformation pour l'affichage

#### Services Forms
- Modèle: `form-user-profile.service.ts`
  - Validation claire des entrées
  - Transformation des données brutes
  - Délégation aux services pages pour la soumission

#### Services Pages (Presenter)
- Modèle: `user-pages.service.ts`
  - Délégation pure au service core
  - Gestion d'erreurs orientée UI
  - Aucune logique métier

#### Services Core (Controller)
- Modèle: `nutrition-core.service.ts`
  - Centralisation de la logique métier
  - Bonne encapsulation des calculs
  - Délégation appropriée aux handlers MCP

### 5.2 Services Nécessitant des Améliorations

#### Priorité Haute
- `progress-pages.service.ts`
  - Problème: Accès direct aux données, pas de service core adéquat
  - Impact: Risque élevé de bugs, duplication, violation de l'architecture

- `cooking-method.service.ts`
  - Problème: Nommage incorrect, mélange UI/logique métier, calculs directs
  - Impact: Confusion dans la structure, difficulté de maintenance

#### Priorité Moyenne
- `assistant-pages.service.ts`
  - Problème: Appels entre services non-core, logique métier mélangée
  - Impact: Violation de la hiérarchie, couplage fort

- `ingredient-pages.service.ts`
  - Problème: Formatage dans le mauvais niveau, accès direct aux données
  - Impact: Confusion des responsabilités

### 5.3 Principes de Communication Entre Couches

1. **Flux de données descendant**:
   - UI → Services UI → Services Forms → Services Pages → Services Core → Handlers MCP → DB

2. **Flux de données ascendant**:
   - DB → Handlers MCP → Services Core → Services Pages → Services Forms → Services UI → UI

3. **Règles strictes de communication**:
   - Chaque couche ne communique qu'avec les couches adjacentes
   - Jamais de saut de niveau (pages vers handlers directement)
   - Jamais d'appels horizontaux entre services du même niveau

## 6. Plan d'Action pour l'Architecture MCP Complète

### 6.1 Documentation et Formation

- [ ] Documentation complète de l'architecture
  - [ ] Mettre à jour les schémas pour inclure toutes les couches
  - [ ] Documenter les responsabilités précises de chaque couche
  - [ ] Créer des exemples pour chaque type de service

- [ ] Guide de développement
  - [ ] Créer un guide de contribution avec exemples modèles pour chaque couche
  - [ ] Documenter les patterns d'interaction entre couches
  - [ ] Établir des conventions de nommage strictes

- [ ] Formation de l'équipe
  - [ ] Former sur les responsabilités de chaque couche
  - [ ] Revoir le processus de revue de code
  - [ ] Mettre en place des linters personnalisés

### 6.2 Validation et Tests

- [ ] Tests unitaires par couche
  - [ ] Tests pour services UI (pure fonctions)
  - [ ] Tests pour services Forms (validation)
  - [ ] Tests pour services Core (logique métier)
  - [ ] Tests pour handlers MCP (accès données)

- [ ] Tests d'intégration entre couches
  - [ ] Tests UI → Services UI
  - [ ] Tests Forms → Pages
  - [ ] Tests Pages → Core
  - [ ] Tests Core → MCP Handlers

### 6.3 Priorité des Refactorisations

#### Semaine 1: Corrections Critiques

- [x] Refactoriser `progress-pages.service.ts`
  - [x] Utiliser le `progress.service.ts` déjà existant
  - [x] Éliminer les appels directs à sqliteMCPServer
  - [x] Ajouter la méthode `getProgressHistory` au service core
  - [x] Refactoriser la méthode `getProgressHistory` du service pages pour déléguer au core
  - [x] Refactoriser `updateProgress` pour déléguer à `updateDailyProgress` du service core
  - [x] Refactoriser `markMealAsConsumed` pour déléguer au service core
  - [x] Corriger les problèmes de logging (utilisation de LogCategory.APP)
  - [x] Améliorer la gestion des erreurs

- [x] Corriger `cooking-method.service.ts`
  - [x] Renommer en cooking-method-pages.service.ts
  - [x] Créer cooking-method-core.service.ts
  - [x] Créer cooking-method-ui.service.ts pour les aspects UI
  - [x] Extraire les constantes vers cooking-method-info.constants.ts
  - [x] Séparer les aspects UI et core

- [x] Refactoriser `ingredient-pages.service.ts`
  - [x] Créer ingredient-ui.service.ts pour les fonctionnalités UI
  - [x] Déplacer formatIngredientForDisplay vers le service UI
  - [x] Ajouter optimizeIngredientData au service core
  - [x] Éliminer l'appel direct à sqliteMCPServer

#### Semaine 2: Séparation UI et Forms

- [ ] Créer les services UI manquants
  - [x] Identifier les méthodes de formatage nutritionnel (normalizeMacrosForDisplay, formatForUI)
  - [x] Créer `nutrition-ui.service.ts` avec les méthodes:
    - [x] `formatNutritionFor100g` - Standardiser l'affichage "Pour 100g"
    - [x] `formatAdjustmentFactor` - Afficher clairement le facteur d'ajustement
    - [x] `formatNutrientValue` - Formater les valeurs nutritionnelles avec unités
    - [x] `createNutritionDisplayText` - Générer des textes combinés pour l'UI
    - [x] `getNutritionCssClasses` - Classes CSS pour l'affichage conditionnel
  - [x] Vérifier que le hook `useNormalizedNutrition` a été correctement remplacé par des services
  - [ ] Identifier les autres méthodes de formatage UI

- [ ] Améliorer les services Forms
  - [ ] Standardiser les validations
  - [ ] Revoir les transformations de données

#### Semaine 3: Refactorisation des autres services

- [x] Corriger `assistant-pages.service.ts` ✅
  - [x] Créer assistant-core.service.ts
  - [x] Déplacer la logique métier dans le core

- [x] Corriger `ingredient-pages.service.ts` ✅
- [x] Corriger `plan-pages.service.ts` ✅
  - [x] Séparer selon l'architecture à 6 niveaux
  - [x] Éliminer tous les appels directs à sqliteMCPServer

## 7. Conclusion

L'application Lift présente une architecture MCP à 6 niveaux qui est partiellement respectée. En suivant ce plan, nous allons:

1. Rétablir une séparation claire des responsabilités entre toutes les couches
2. Améliorer la maintenabilité et la testabilité du code
3. Faciliter l'évolution future de l'application

Chaque couche a un rôle distinct et bien défini:
- UI: Interaction utilisateur
- Services UI: Formatage pour l'affichage
- Services Forms: Validation et transformation de formulaires
- Services Pages: Orchestration pour l'UI
- Services Core: Logique métier pure
- Handlers MCP: Accès aux données

L'application comprend désormais une architecture de calcul nutritionnel standardisée:
- Calculs nutritionnels centralisés dans `nutrition-core.service.ts`
- Valeurs normalisées à 100g pour faciliter la comparaison entre repas
- Séparation claire entre logique métier et formatage d'affichage

Le respect de cette architecture garantira la qualité et la pérennité du code.
