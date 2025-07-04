# Checklist de refactorisation des dépendances circulaires

## Contexte et problématique

Des cycles de dépendances ont été identifiés dans l'architecture actuelle de Lift :

```
Cycle 1: sqlite-server.ts → meal-handlers.ts → nutrition-core.service.ts → sqlite-server.ts
Cycle 2: sqlite-server.ts → meal-handlers.ts → nutrition-core.service.ts → userContext.ts → sqlite-server.ts
```

Ces cycles peuvent provoquer des comportements imprévisibles, des problèmes d'initialisation et compliquer la maintenance. Cette checklist propose une approche structurée pour résoudre ces problèmes en alignement avec l'architecture MCP.

## Phase 1 : Analyse et préparation

- [ ] **Cartographier les dépendances actuelles**
  - [ ] Documenter toutes les imports/exports entre les modules impliqués
  - [ ] Identifier les fonctionnalités spécifiques qui créent les cycles

- [ ] **Établir un environnement de test**
  - [ ] Créer des tests unitaires pour les fonctionnalités touchées
  - [ ] Mettre en place des tests d'intégration pour valider le comportement global

## Phase 2 : Restructuration de l'architecture

### 1. Restructuration des services centraux

- [ ] **Créer un module d'interfaces partagées**
  - [ ] Définir les interfaces pour les services de base de données
  - [ ] Définir les interfaces pour les services nutritionnels
  - [ ] Placer ces interfaces dans `utils/interfaces/services.interface.ts`

- [ ] **Appliquer le pattern d'injection de dépendances**
  - [ ] Modifier `nutrition-core.service.ts` pour accepter une implémentation de l'interface DB
  - [ ] Rendre `sqlite-server.ts` conforme à l'interface DB définie

### 2. Implémentation du pattern Façade

- [ ] **Renforcer le rôle du Nutrition Engine**
  - [ ] Faire de `nutritionEngine.ts` la façade officielle pour toutes les opérations nutritionnelles
  - [ ] Rediriger les imports directs vers cette façade
  - [ ] Éliminer les références directes entre couches

- [ ] **Créer un service de contexte indépendant**
  - [ ] Extraire le `userContext` dans un service autonome
  - [ ] Implémenter un mécanisme d'abonnement/publication plutôt que des imports directs

### 3. Application du pattern Repository

- [ ] **Isoler l'accès aux données**
  - [ ] Créer des repositories pour chaque domaine (repas, nutrition, utilisateurs)
  - [ ] Faire passer les handlers MCP par ces repositories plutôt que par le serveur SQLite directement

## Phase 3 : Implémentation et transition

- [ ] **Implémenter les changements par domaine**
  - [ ] Domaine nutrition : briser le cycle nutrition-core → sqlite-server
  - [ ] Domaine utilisateur : briser le cycle userContext → sqlite-server
  - [ ] Domaine repas : restructurer meal-handlers pour suivre le nouveau pattern

- [ ] **Introduire stratégiquement des lazy-loading**
  - [ ] Identifier les endroits stratégiques pour des imports dynamiques
  - [ ] Utiliser `setTimeout(() => import('...'), 0)` pour les initialisations critiques

## Phase 4 : Validation et déploiement

- [ ] **Vérifier l'absence de cycles**
  - [ ] Utiliser des outils d'analyse de dépendances
  - [ ] Vérifier les logs de démarrage de l'application

- [ ] **Tests complets**
  - [ ] Valider le fonctionnement de toutes les fonctionnalités nutritionnelles
  - [ ] Tester particulièrement les cas à la frontière entre modules

- [ ] **Documentation de la nouvelle architecture**
  - [ ] Mettre à jour les diagrammes d'architecture
  - [ ] Documenter les patterns utilisés pour référence future

## Approche recommandée

Pour minimiser les risques, il est conseillé d'adopter une approche incrémentale :

1. D'abord créer le module d'interfaces partagées
2. Ensuite renforcer le pattern Façade avec nutritionEngine
3. Finalement restructurer les imports problématiques un par un

Cette approche permettra de maintenir l'application fonctionnelle à chaque étape et facilitera l'identification d'éventuels problèmes.

## Résultat attendu

```
DB Access Layer (sqlite-server.ts)
        ↑  ↓
Repository Layer (repositories)
        ↑  ↓
Controller Layer (nutrition-core.service.ts)
        ↑  ↓
Façade Layer (nutritionEngine.ts)
        ↑  ↓
Presenter Layer (services/pages)
        ↑  ↓
UI Components
```

Cette structure éliminera les dépendances circulaires tout en renforçant l'architecture MCP existante.
