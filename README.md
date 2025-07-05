# Architecture des Services de Lift-Eat-Mobile

Ce dossier contient l'ensemble des services qui composent l'architecture MCP (Model-Controller-Persistence) de l'application Lift-Eat-Mobile.

## Structure des Dossiers

L'organisation des services est structurée comme suit:

### `/core`

Services métier principaux qui implémentent la logique business centrale de l'application.

- `auth.service.ts` - Authentification et gestion des sessions
- `user.service.ts` - Gestion des utilisateurs (profils, préférences)
- `nutrition.service.ts` - Calculs nutritionnels et gestion des objectifs
- `meal.service.ts` - Gestion des repas et ingrédients
- `plan.service.ts` - Gestion des plans nutritionnels
- `progress.service.ts` - Suivi des progrès et statistiques

### `/pages`

Services d'orchestration qui font l'interface entre l'UI et les services métier.

- `*-pages.service.ts` - Orchestrent les appels entre UI et services business

### `/forms`

Services de validation et préparation des données de formulaires.

- `form-*.service.ts` - Validation et préparation des données avant persistance

### `/ui`

Services liés aux composants d'interface utilisateur.

- `ui-drawer.service.ts` - Gestion des tiroirs (drawers)
- `ui-deletion-modal.service.ts` - Gestion des modales de confirmation

### `/common`

Services utilitaires et partagés.

- `logging.service.ts` - Journalisation centralisée
- Autres utilitaires communs

## Architecture MCP

L'architecture MCP (Model-Controller-Persistence) centralise l'accès aux données via des handlers spécifiques:

1. **UI (Composants)** - Interface utilisateur, ne contient aucune logique métier
2. **Pages Services** - Orchestrent les appels entre UI et services métier
3. **Core Services** - Implémentent la logique métier et appellent le MCP Server
4. **MCP Server** - Point d'accès unique à la base de données via des handlers

### Flux des Données

```
Composant UI → Service Pages → Service Core → MCP Server → Base de données
```

## Conventions de Nommage

- Services métier: `feature.service.ts` (ex: `user.service.ts`)
- Services pages: `feature-pages.service.ts` (ex: `user-pages.service.ts`)
- Services formulaires: `form-feature.service.ts` (ex: `form-user-details.service.ts`)
- Services UI: `ui-feature.service.ts` (ex: `ui-drawer.service.ts`)

## Bonnes Pratiques:

1. **Séparation des Responsabilités**:

   - Les composants UI ne doivent JAMAIS accéder directement à la base de données
   - Toute logique métier doit être dans les services `/core`
   - Les services de pages ne font qu'orchestrer

2. **Gestion des Erreurs**:

   - Tous les services retournent un type `OperationResult<T>`
   - La journalisation est centralisée via `logging.service.ts`

3. **Invalidation du Cache**:
   - L'invalidation du cache utilise React Query
   - Les méthodes d'invalidation sont exposées via les services de pages
