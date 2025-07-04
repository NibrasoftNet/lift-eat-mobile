# Checklist de Refactorisation du Système Nutritionnel

Ce document présente un plan détaillé pour améliorer l'architecture du système nutritionnel de l'application Lift, en se concentrant sur la séparation des responsabilités, la cohérence des calculs et la maintenabilité du code, tout en s'alignant avec le pattern MCP (Model-Controller-Presenter) déjà utilisé dans le projet.

## 1. Analyse des Composants Actuels

### Architecture MCP
- ✅ **sqliteMCPServer** : Singleton bien conçu pour l'accès à la base de données
- ✅ **handlers MCP** : Organisation modulaire par domaine fonctionnel
- ⚠️ **Intégration avec nutritionEngine** : Non existante, opportunity d'amélioration

### Moteur Central (Core)
- ✅ **nutritionEngine** : Bien conçu comme façade pour les calculs nutritionnels
- ✅ **nutritionCoreService** : Fournit des fonctions de base solides

### Helpers
- ⚠️ **macroCalculations.helper.ts** : Déprécié mais encore utilisé
- ⚠️ **nutrition-calculation.helper.ts** : Duplication partielle avec le moteur
- ✅ **nutritionConverter.helper.ts** : Utilitaires de conversion bien structurés
- ✅ **cookingAdjustment.helper.ts** : Gestion cohérente des méthodes de cuisson
- ✅ **macroBalance.helper.ts** : Évaluation de l'équilibre nutritionnel

### Hooks React
- ⚠️ **useNormalizedNutrition** : Fonctionnel mais utilisé inconsistamment
- ⚠️ **useNutritionCalculation** : Mélange des préoccupations UI/business
- ⚠️ **useCookingMethodAdjustment** : Logique complexe avec recalculs fréquents
- ❌ **useMealNutrition** : Manquant, devrait intégrer MCP et nutritionEngine

### Composants UI
- ❌ **MealCard** : Contient de la logique métier directement dans le rendu
- ❌ **MacrosInfoCard** : Inconsistance dans l'affichage des valeurs normalisées
- ❌ **NutritionAdjuster** : Trop de responsabilités (calcul et UI)

## 2. Problèmes Identifiés

1. **Mélange des responsabilités** :
   - Logique métier intégrée directement dans les composants UI
   - Manque d'abstraction entre la couche données et la couche présentation

2. **Non-conformité avec le pattern MCP** :
   - Système nutritionnel pas complètement aligné avec l'architecture MCP du projet
   - Absence d'un handler MCP dédié aux calculs nutritionnels standardisés

3. **Inconsistance dans les calculs** :
   - Différentes approches pour calculer le poids total (estimation vs. réel)
   - Multiples implémentations pour des calculs similaires

4. **Utilisation irrégulière des hooks** :
   - Les hooks ne sont pas utilisés systématiquement dans tous les composants
   - Paramètres inconsistants entre différentes parties du code
   - Manque d'un hook qui servirait de façade entre le MCP et les composants UI

5. **Duplication de code** :
   - Fonctions de calcul similaires dans différents helpers
   - Logique de normalisation répétée dans les composants

6. **Manque de tests unitaires** :
   - Couverture de test insuffisante pour les fonctionnalités clés
   - Tests incomplets pour les scénarios complexes

## 3. Plan de Refactorisation — Priorisé

**Légende des priorités**  
🚨 **P0** : Bloquant / indispensable avant toute autre tâche  
🟠 **P1** : Important pour la stabilité à court terme  
🟢 **P2** : Améliorations ou optimisation

---

### 🚨 P0 – Fondations MCP et Normalisation

- [x] **Créer un handler MCP pour les calculs nutritionnels**
  - [x] Générer `nutrition-handlers.ts` dans `/utils/mcp/handlers`
    - ✅ Implémenté le 04/05/2025 avec fonctions pour normalisation des macros
  - [x] Ajouter `calculateNormalizedNutrition`, `getMealWeight`, `getMacroBreakdown`
    - ✅ Toutes les fonctions supportées et utilisées avec le schema standard
  - [x] Exposer ces fonctions depuis `SQLiteMCPServer`
    - ✅ Ajout des méthodes "ViaMCP" dans le singleton du serveur
  - [ ] ✅ **Sous-tests :** écrire des tests unitaires pour chaque fonction

- [x] **Développer le hook `useMealNutrition`**
  - [x] Consommer les méthodes du handler MCP
    - ✅ Intégration avec `calculateNormalizedNutritionViaMCP` et `getMacroBreakdownViaMCP`
  - [x] Retourner un objet complet avec toutes les données nutritionnelles
    - ✅ Format standardisé : `{normalizedNutrition, adjustmentFactor, macroBreakdown, etc.}`
  - [x] Gérer le cache avec `useMemo` pour éviter les recalculs
    - ✅ Optimisation des calculs et gestion des états de chargement
  - [x] Correction des incohérences dans les interfaces
    - ✅ Standardisation sur `fat` (singulier) au lieu de `fats` (pluriel) pour alignement avec `MacroNutrientsBase`

- [x] **Corriger l’affichage normalisé (100 g)**
  - [x] Mettre à jour `MealCard`, `MacrosInfoCard`, `NutritionAdjuster` pour utiliser `useMealNutrition`
    - ✅ `MealCard` utilise maintenant `useMealNutrition` pour l'affichage standardisé à 100g
    - ✅ `MacrosInfoCard` prend en charge le mode MCP ou les données brutes
    - ✅ `NutritionAdjuster` supporte désormais le chargement des données via MCP
  - [x] Supprimer la logique métier actuellement dans ces composants
    - ✅ Logique de calcul nutritionnel déléguée au système MCP

---

### 🟠 P1 – Nettoyage des Helpers & Centralisation

- [x] **Retirer les helpers dépréciés**
  - [x] Remplacer `macroCalculations.helper.ts` par les appels MCP
  - [x] Fusionner/supprimer `nutrition-calculation.helper.ts`

- [x] **Centraliser les constantes & unités**
  - [x] Analyser les fichiers existants dans `/utils/constants` (nutrition-constants.ts, NutritionLimits.ts, NutritionUnits.ts)
    - ✅ Constatation de l'existence d'un fichier centralisé avec point d'entrée unique nutrition-constants.ts
  - [x] Standardiser les noms de fichiers en PascalCase pour cohérence
    - ✅ Renommé `nutrition-constants.ts` en `NutritionConstants.ts`
  - [x] Extraire les constantes de cuisson du helper vers un fichier dédié
    - ✅ Déplacé `CookingMethod` et `CookingMethodFactors` vers `CookingConstants.ts`
    - ✅ Ajout de la constante `STANDARD_WEIGHT` (100g) comme référence
  - [x] Mettre à jour les imports dans tout le code
    - ✅ nutrition-core.service.ts
    - ✅ NutritionAdjuster.tsx
    - ✅ nutrition-calculation.helper.ts
    - ✅ nutrition-engine.ts

- [x] **Optimiser les hooks existants**
  - [x] `useNormalizedNutrition` : rendre paramètres explicites & typés
    - ✅ Transformé `NutritionDisplayMode` en enum pour une meilleure auto-complétion
    - ✅ Ajouté des interfaces exportées pour réutilisation dans l'application
    - ✅ Amélioré la validation et la gestion des erreurs
  - [x] `useNutritionCalculation` : séparer UI vs logique
    - ✅ Extrait les calculs dans des fonctions pures
    - ✅ Mémoïsé les résultats pour éviter les recalculs inutiles
    - ✅ Fourni des exemples d'utilisation et ajouter des types explicites
  - [x] `useCookingMethodAdjustment` : mémoïser les calculs & simplifier l'API
    - ✅ Restructuré pour éviter les effets de bord inutiles
    - ✅ Utilisations des constantes centralisées (STANDARD_WEIGHT, etc.)
    - ✅ Ajout d'interfaces et de documentation complète

---

### 🟢 P2 – Tests, Documentation & UX

- [ ] **Étendre la couverture de tests**
  - [ ] Scénarios limites (poids nul, négatif, extrêmes)
  - [ ] Tests d’intégration du flux (création → MCP → UI)

- [ ] **Documentation**
  - [ ] Diagramme de flux MCP pour la nutrition
  - [ ] Guide développeur : ajouter un nouveau calcul nutritionnel
  - [ ] Guide produit : comment sont calculées les valeurs affichées

- [ ] **UX & Logging**
  - [ ] Ajouter messages d’erreur utilisateur lorsqu’un calcul échoue
  - [ ] Standardiser le format de log (contexte, durée, résultat)

---

## 4. Roadmap Immédiate

1. 🚨 Créer `nutrition-handlers.ts` et l’enregistrer au `SQLiteMCPServer`
2. 🚨 Implémenter `useMealNutrition` et migrer `MealCard`
3. 🟠 Supprimer les helpers dépréciés & déplacer les constantes
4. 🟢 Compléter les tests unitaires et la documentation associée

## 5. Bénéfices Attendus

- **Maintenabilité améliorée** : Code plus facile à comprendre et à modifier
- **Cohérence architecturale** : Alignement avec le pattern MCP utilisé dans le reste du projet
- **Réduction des bugs** : Moins d'erreurs grâce à la centralisation des calculs
- **Performance optimisée** : Réduction des calculs redondants et meilleure gestion du cache
- **Évolutivité** : Facilité d'extension du système nutritionnel grâce à l'architecture MCP
- **Expérience utilisateur cohérente** : Affichage standardisé des valeurs nutritionnelles
