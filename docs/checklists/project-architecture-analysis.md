# Analyse de l'Architecture du Projet Lift

Ce document présente une analyse complète de l'architecture actuelle du projet Lift, identifiant les forces, les faiblesses et proposant des recommandations d'amélioration.

_Dernière mise à jour: 13 mai 2025 - Analyse basée sur l'examen détaillé de la codebase_

## 1. Structure Générale du Projet

### Organisation des Répertoires

```
/app                     → Pages et routage (structure Expo Router)
  /(root)               → Routes principales
    /(tabs)             → Interface à onglets
    /(auth)             → Flux d'authentification
    /(user)             → Pages spécifiques à l'utilisateur
/components             → Composants réutilisables
  /ui                   → Composants UI de base
  /boxes                → Composants d'affichage des données
  /cards                → Cartes d'information
  /forms                → Formulaires
  /froms                → [Duplication probable, erreur de nommage]
  /accordions           → Composants accordions
  /adjusters            → Composants pour ajuster les valeurs
/db                     → Schéma de base de données (SQLite/Drizzle)
/utils                  → Utilitaires et services
  /mcp                  → Implémentation du pattern MCP (Model-Controller-Presenter)
  /engines              → Moteurs de calcul spécifiques
  /helpers              → Fonctions d'aide
  /hooks                → Hooks React personnalisés
  /services             → Services pour l'accès aux données
    /core               → Services fondamentaux
    /pages              → Services liés aux pages
  /enum                 → Énumérations partagées
  /constants            → Constantes de l'application
  /providers            → Providers React pour le contexte global
/assets                 → Ressources statiques (images, polices)
```

### Architecture Technique

- **Framework UI** : React Native avec Expo
- **Navigation** : Expo Router (navigation déclarative basée sur le système de fichiers)
- **Base de données** : SQLite avec ORM Drizzle
- **Pattern d'architecture** : MCP (Model-Controller-Presenter) personnalisé
- **Gestion d'état** : Approche mixte (hooks React, contextes)
- **Style** : Classnames/Tailwind avec personnalisation

## 2. Analyse de la Couche Données

### Schéma de Base de Données

- **Entités principales** :

  - `users` - Informations utilisateur et préférences
  - `ingredientsStandard` - Informations nutritionnelles des ingrédients
  - `mealIngredients` - Relation entre repas et ingrédients
  - `meals` - Définitions des repas
  - `dailyPlan` - Plans journaliers
  - `plan` - Plans nutritionnels complets
  - `dailyProgress` - Suivi de progression journalière
  - `nutritionAdvice` - Conseils nutritionnels générés par l'IA

- **Relations clés** :
  - Un utilisateur peut avoir plusieurs plans
  - Un plan contient plusieurs plans journaliers
  - Un plan journalier contient plusieurs repas
  - Un repas contient plusieurs ingrédients

### Forces

- Schéma bien structuré avec relations clairement définies
- Utilisation d'énumérations pour garantir la cohérence des données
- Support de types TypeScript générés automatiquement via Drizzle

### Faiblesses

- Types composés complexes pouvant causer des problèmes de typage
- Duplication potentielle dans les calculs de valeurs nutritionnelles

## 3. Architecture des Composants UI

### Hiérarchie de Composants

- **Composants de base** (`/ui`) : Éléments fondamentaux (Text, Box, Button)
- **Composants composés** (`/cards`, `/boxes`) : Composants réutilisables de niveau supérieur
- **Composants de page** (`/app`) : Assemblage de composants pour créer des pages complètes

### Forces

- Bonne séparation des composants par fonctionnalité
- Réutilisation des composants de base dans toute l'application

### Faiblesses

- Mélange de la logique métier et de la présentation dans certains composants
- Duplications des composants similaires (`/forms` et `/froms`)
- Organisation parfois inconsistante des responsabilités

## 4. Architecture de la Logique Métier

### Structure de la Logique

- **Pattern MCP** : Architecture principale pour l'accès aux données
- **Services** : Accès aux données et opérations CRUD
- **Helpers** : Fonctions utilitaires pour des opérations spécifiques
- **Engines** : Moteurs de calcul complexes (ex: nutritionEngine)
- **Hooks personnalisés** : Encapsulation de la logique d'état et des effets

### Forces

- Séparation des préoccupations par domaine (nutrition, repas, plans)
- Réutilisation de la logique via des hooks personnalisés
- Pattern MCP bien implémenté pour la communication avec la base de données

### Faiblesses

- Parfois trop de responsabilités dans les composants UI
- Duplication de code entre différents helpers et services
- Manque de standardisation dans l'accès aux données

## 5. Pattern MCP (Model-Controller-Presenter)

Le projet utilise une implémentation personnalisée du pattern MCP :

- **Model** : Représenté par le schéma de base de données et les interfaces TypeScript
- **Controller** : Implémenté dans `/utils/mcp/handlers` avec des fonctions spécifiques par domaine
- **Presenter** : Fourni via `SQLiteMCPServer` qui expose des méthodes standardisées aux composants

### Implémentation

- **MCPProvider** : Fournit le contexte MCP à l'ensemble de l'application
- **sqliteMCPServer** : Singleton qui centralise toutes les interactions avec la base de données
- **Handlers spécialisés** : Organisés par domaine métier (repas, plans, utilisateurs, etc.)

### Avantages de cette approche

- Centralisation des accès à la base de données
- Interface cohérente pour les requêtes
- Possibilité d'ajouter des logs et de la gestion d'erreurs à un seul endroit
- Facilité d'extension pour de nouvelles fonctionnalités

## 6. Cas du Système Nutritionnel

Le système nutritionnel est un exemple représentatif des problèmes d'architecture globaux :

- **Moteur central** bien conçu (`nutritionEngine`)
- **Hooks spécialisés** pour les calculs complexes (`useNormalizedNutrition`)
- **Logique d'affichage** dispersée dans les composants UI

### 6.1 Standardisation Nutritionnelle

Une standardisation de l'affichage des valeurs nutritionnelles à 100g a été implémentée dans toute l'application :

- Affichage cohérent dans les cartes de repas, l'écran de détail et les formulaires
- Indication claire avec le texte "Pour 100g" et l'affichage du facteur d'ajustement

L'analyse du code montre que cette standardisation suit l'architecture MCP :

- Les composants comme `MealCard.tsx` utilisent `nutritionPagesService.getMealNutritionForDisplay()`
- Ce service présentateur délègue au `nutritionEngine.getMealNutrition()`
- Le moteur centralise les calculs et la normalisation des valeurs nutritionnelles

Cette approche assure une cohérence dans l'affichage des valeurs nutritionnelles à travers l'application.

### 6.2 Problèmes Identifiés

- Logique métier dispersée dans les composants UI (calculs nutritionnels)
- Incohérences dans le calcul des valeurs nutritionnelles (multiplication par 100)
- Utilisation directe de hooks (useNormalizedNutrition) au lieu de services
- Directive `@ts-nocheck` utilisée dans la page de détail pour résoudre temporairement un problème de type TypeScript

Ces problèmes reflètent des défis architecturaux plus larges dans l'application.

## 7. Analyse des Patterns de Design

### 7.1 Architecture MCP Actuelle

L'application suit le pattern MCP (Model-Controller-Presenter) structuré comme suit :

- **Model (M)** : Défini dans les schémas de base de données (`db/schema.ts`), interfaces dans `utils/mcp/interfaces`
- **Controller (C)** : Services "core" dans `utils/services/core`, notamment `nutrition-core.service.ts` (46 KB)
- **Presenter (P)** : Services "pages" dans `utils/services/pages` orchestrant les opérations pour l'UI

#### Implementation actuelle

Le serveur MCP est implémenté via `SQLiteMCPServer` (singleton, 79 KB) qui délègue aux handlers spécialisés :

- `meal-handlers.ts` (32 KB) pour les opérations liées aux repas
- `nutrition-handlers.ts` (21 KB) pour les calculs nutritionnels
- `plan-handlers.ts` (42 KB) pour la gestion des plans
- `ingredient-handlers.ts` (8 KB) pour la gestion des ingrédients

Le façade `nutritionEngine` (18 KB) fournit une interface simplifiu00e9e pour les calculs nutritionnels et sert de point d'entrée unique pour ces fonctionnalités.

#### Flux de données

Le flux typique des données suit le schéma :

1. Le composant UI appelle le service "pages" approprié (présentateur)
2. Le service "pages" délègue au service "core" (contrôleur) ou au moteur (engine)
3. Le service "core" effectue les calculs métier nécessaires
4. Le service "core" dialogue avec SQLiteMCPServer pour les accès aux données
5. SQLiteMCPServer utilise les handlers pour les opérations sur la base de données

### 7.2 Patterns Utilisés

- **MCP** : Architecture principale pour les données et l'interaction avec la base de données
- **Façade** : `nutritionEngine` offre une interface simplifiée pour les calculs nutritionnels
- **Hooks personnalisés** : Encapsulation de la logique d'état et des effets
- **Services** : Abstractions pour l'accès aux données
- **Singleton** : `SQLiteMCPServer` est implémenté comme un singleton pour garantir une instance unique

### 7.3 Patterns Manquants

- **Container/Presenter** : Séparation claire de la logique et de l'affichage dans les composants UI
- **Domain-Driven Design** : Organisation plus stricte du code autour du domaine métier
- **Repository (complet)** : Bien que MCP soit une forme de repository, une implémentation plus complète serait bénéfique
- **Injection de dépendances** : Permettrait de résoudre les cycles de dépendances identifiés

## 8. Problèmes Architecturaux Critiques

### 8.1 Cycles de Dépendances

L'analyse du code source confirme la présence de cycles de dépendances entre plusieurs modules clés :

1. **Premier cycle** :
   `sqlite-server.ts → meal-handlers.ts → nutrition-core.service.ts → sqlite-server.ts`

2. **Second cycle** :
   `sqlite-server.ts → meal-handlers.ts → nutrition-core.service.ts → userContext.ts → sqlite-server.ts`

Le détail de ces cycles montre que :

- `meal-handlers.ts` importe `nutritionCoreService` pour les calculs nutritionnels
- `nutrition-core.service.ts` utilise `getCurrentUserIdSync()` de `userContext.ts`
- `userContext.ts` importe `sqliteMCPServer` pour obtenir l'utilisateur par défaut
- `sqliteMCPServer` importe les handlers, créant ainsi un cycle complet

Ces cycles génèrent des avertissements au démarrage et représentent un risque technique significatif pour la stabilité de l'application.

### 8.2 Problèmes de l'Architecture Actuelle

L'analyse détaillée du code source révèle plusieurs problèmes d'architecture :

1. **Couplage fort entre les couches** :

   - Les services "core" comme `nutrition-core.service.ts` dépendent directement de `userContext.ts`
   - Les services "pages" comme `meal-pages.service.ts` dépendent de `sqliteMCPServer`
   - Le façade `nutritionEngine` dépend à la fois des services "core" et du système de logging

2. **Mélange des responsabilités dans les services** :

   - Le service `userContext.ts` mélange la gestion de l'état (via useSessionStore) et les accès à la base de données (via sqliteMCPServer)
   - Les services "core" dépendent de l'UI via le contexte utilisateur (`getCurrentUserIdSync`)

3. **Duplication de fonctionnalités** :
   - Méthodes similaires entre `nutritionEngine` et `nutritionPagesService`
   - Validation des données répétée à plusieurs niveaux de l'architecture

## 9. Recommandations d'Amélioration de l'Architecture

### 9.1 Architecture Globale

1. **Adopter une architecture en couches plus stricte** :

   - Couche de présentation (UI)
   - Couche de logique métier (services, hooks)
   - Couche d'accès aux données (MCP)
   - Couche de domaine (modèles, entités)

2. **Renforcer le pattern MCP** :

   - Étendre l'utilisation du MCP pour toutes les opérations de données
   - Standardiser les interfaces des handlers MCP
   - Améliorer la documentation du pattern MCP pour faciliter son utilisation

3. **Résoudre les cycles de dépendances** :

   - Utiliser des patterns d'architecture (Repository, Façade)
   - Implémenter l'injection de dépendances
   - Renforcer le nutritionEngine comme point d'accès centralisé

4. **Réorganiser les composants UI** :
   - Séparer les composants en `components/presentational` et `components/container`
   - Corriger la duplication `/forms` et `/froms`
   - Standardiser l'utilisation des composants UI modernes (Box, VStack, HStack)

### Architecture des Données

1. **Optimiser le schéma de base de données** :

   - Réviser les relations pour éliminer les redondances
   - Standardiser les colonnes communes (createdAt, updatedAt)

2. **Améliorer la gestion d'état** :
   - Adopter un gestionnaire d'état centralisé (Zustand, Redux)
   - Créer un système de cache cohérent pour les données fréquemment utilisées

### 9.3 Architecture de la Logique Métier

1. **Séparer strictement la logique métier de l'UI** :

   - Créer des services pour chaque domaine de l'application
   - Utiliser des hooks comme façade entre les services et les composants
   - Centraliser tous les calculs nutritionnels dans nutrition-core.service.ts

2. **Standardiser les patterns** :

   - Utiliser un pattern cohérent pour tous les calculs (comme le nutritionEngine)
   - Implémenter des validateurs pour garantir l'intégrité des données
   - Standardiser les schémas de données IA avec le schéma de la DB

3. **Améliorer l'architecture du module IA** :
   - Créer des fonctions de transformation cohérentes entre IA et DB
   - Ajouter une gestion d'erreurs robuste dans les transformateurs
   - Standardiser les énumérations (types de repas, cuisine)

## 10. Progrès et Plan d'Action

### 10.1 Progrès Réalisés

1. **Phase 3 de la refactorisation UI** : Complétée

   - Remplacement des composants basiques par des composants UI standards
   - Remplacement des modaux par ActionSheet
   - Utilisation de VStack et HStack à la place des Flexbox directs
   - Composants refactorisés : PlanConfigurationForm, PlanGeneratorForm, PlanGenerationResult, MissingIngredientsModal, PlanPreview, IngredientsSelector

2. **Standardisation nutritionnelle** : Implémentée

   - Affichage cohérent des valeurs nutritionnelles à 100g
   - Utilisation du hook useNormalizedNutrition

3. **Refactorisation du module IA** : En cours
   - Correctifs dans la logique métier
   - Standardisation des schémas de données
   - Création de fonctions de transformation cohérentes

### 10.2 Plan d'Action Révisé

#### Phase 1: Analyse et préparation

- [ ] Identifier toutes les méthodes dupliquées entre `nutritionEngine` et `nutritionPagesService`
- [ ] Cartographier les dépendances circulaires (`sqlite-server` → `meal-handlers` → `nutrition-core` → `userContext` → `sqlite-server`)
- [ ] Créer des tests unitaires pour les fonctionnalités critiques avant refactorisation
- [ ] Définir clairement les responsabilités de chaque couche (Core, Engine, Pages)

#### Phase 2: Résolution des cycles de dépendances

- [ ] Implémenter un module indépendant de gestion des utilisateurs (`UserService`) sans dépendance vers SQLiteMCPServer
- [ ] Remplacer la dépendance directe à `getCurrentUserIdSync` dans `nutrition-core.service.ts` par l'injection d'une interface
- [ ] Créer une couche d'abstraction entre les services "core" et le serveur MCP
- [ ] Restructurer les imports pour éliminer les cycles de dépendances

#### Phase 3: Réorganisation des services et élimination des duplications

- [ ] Refactoriser `userContext` pour séparer gestion de session (UI) et gestion utilisateur (métier)
- [ ] Centraliser les méthodes formatForUI et normalizeForDisplay dans un seul service
- [ ] Supprimer les validations redondantes en définissant un point unique de validation
- [ ] Standardiser les mécanismes de gestion d'erreur et les valeurs par défaut
- [ ] Ajouter des interfaces pour les services (`UserServiceInterface`, `NutritionServiceInterface`)

#### Phase 4: Standardisation du module nutritionnel

- [ ] Migrer tous les composants UI pour utiliser exclusivement les services "pages"
- [ ] Supprimer les calculs nutritionnels locaux des composants UI
- [ ] Découpler `userContext.ts` de `sqliteMCPServer`
- [ ] Implémenter un système d'injection de dépendances pour les services

#### Phase 5: Standardisation du module IA

- [ ] Implémenter l'interface utilisateur pour gérer les ingrédients manquants
- [ ] Normaliser les valeurs numériques (calories, macros)
- [ ] Renforcer la validation des réponses de l'IA
- [ ] Créer un module de cache centralisé pour les données fréquemment utilisées

#### Phase 6: Standardisation complète de l'UI

- [ ] Finaliser la migration vers les nouveaux composants UI
- [ ] Implémenter un gestionnaire d'état cohérent
- [ ] Remplacer les instances directes par des références aux interfaces

#### Phase 7: Tests, validation et documentation

- [ ] Exécuter les tests unitaires pour vérifier le maintien des fonctionnalités
- [ ] Vérifier l'absence de cycles de dépendances avec un outil d'analyse statique
- [ ] Documenter l'architecture globale révisée
- [ ] Créer des guides pour les patterns approuvés

Cette analyse sert de complément aux documents `nutrition-refactorisation-checklist.md` et `refactorisation-dependances-circulaires.md` et fournit un contexte plus large sur les améliorations architecturales nécessaires, en particulier sur la résolution des cycles de dépendances et la centralisation de la logique métier.
