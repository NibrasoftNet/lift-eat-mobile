# Lift-Eat-Mobile

**Lift-Eat-Mobile** est une application mobile de gestion nutritionnelle et de planification de repas, pensée pour offrir une expérience utilisateur fluide, une architecture moderne (MCP), et une base de code robuste et maintenable.

---

## Sommaire

1. Présentation générale
2. Architecture technique
3. Structure du projet
4. Fonctionnalités principales
5. Standards & conventions
6. Flux de développement
7. Optimisations & bonnes pratiques
8. Tests & qualité
9. Roadmap & TODO
10. Ressources & documentation

---

## 1. Présentation Générale

- **Plateforme** : Mobile (React Native + Expo)
- **Objectif** : Suivi nutritionnel, création de plans de repas personnalisés, gestion d’ingrédients et analyse de progrès.
- **Technos principales** : React Native, Expo, GlueStack UI, NativeWind, SQLite (Drizzle ORM), Zustand, React Query, React Hook Form, Zod.

---

## 2. Architecture Technique

### MCP (Model-Controller-Persistence)
- **Modèle** : Centralisation des accès DB via SQLiteMCPServer et des handlers spécialisés (meals, plans, etc.).
- **Contrôleur** : Services métiers (ex : mealService, ingredientService, userService) qui encapsulent la logique métier, les validations et la gestion des erreurs.
- **Persistence** : Accès unique à la base via Drizzle ORM, système de cache intégré, transactions et batch operations pour la performance.

### UI/UX
- **Composants** : Forms, Cards, Drawers, Modals, tous typés et organisés.
- **Navigation** : Expo Router, structure modulaire (auth, tabs, user).
- **Design System** : GlueStack UI, NativeWind, animations Reanimated, retour haptique.

---

## 3. Structure du Projet

```
/app         # Pages & routes (auth, tabs, user, etc.)
/components  # Composants réutilisables (forms, cards, drawers, modals)
/db          # Schéma, configuration et seed SQLite (Drizzle)
/utils       # Services (UI, modals, forms, logique métier), validations, providers
/docs        # Checklists, audits, documentation technique (MCP, workflows, JSON MPC)
/types       # Types et interfaces partagés
/hooks       # Custom hooks (état, logique métier)
/assets      # Images, icônes, ressources statiques
```

---

## 4. Fonctionnalités Principales

- **Gestion des repas** : Création, modification, suppression, ajout d’ingrédients, calcul automatique des macros.
- **Plans nutritionnels** : Création, édition, duplication, gestion journalière, suivi des progrès.
- **Gestion des ingrédients** : Recherche, pagination, optimisation des données, quick-add.
- **Profil utilisateur** : Authentification (OTP/JWT), préférences, photo de profil, historique.
- **Analytics** : Suivi des calories, macros, progression, feedback IA.
- **Expérience offline** : Gestion du cache, persistance locale, synchronisation différée.

---

## 5. Standards & Conventions

- **Nommage** :
  - Composants : PascalCase (ex : MealCard.tsx)
  - Hooks : camelCase avec prefix `use`
  - Utils/services : kebab-case
- **Typage** : TypeScript strict, interfaces pour toutes les props et services.
- **Services** :
  - Préfixe `ui-` pour services UI
  - Singleton exporté pour chaque service
  - Logging intégré (catégories : DATABASE, NETWORK, UI, etc.)
- **Tests** : Jest, React Native Testing Library, coverage sur logique métier et UI critique.
- **Qualité** : ESLint, Prettier, conventions de commit.

---

## 6. Flux de Développement

- **Refactorisation progressive** : Migration MCP terminée, anciennes méthodes marquées @deprecated et redirigées.
- **Checklists** : Toutes les étapes (drawers, forms, migration MCP, audit, etc.) sont documentées dans `/docs`.
- **CI/CD** : Scripts d’audit, lint, et tests automatisés.
- **Documentation** : Fichiers JSON MPC dans `/docs/mpc-json` pour la génération automatique de docs.

---

## 7. Optimisations & Bonnes Pratiques

- **Logging structuré** : Service dédié, logs catégorisés, mesures de performance.
- **Optimisation DB** : Transactions, batch, index, cache, requêtes parallèles.
- **Sécurité** : Authentification JWT/OTP, gestion de session sécurisée, validation stricte des entrées (Zod).
- **Performance** : Lazy loading, pagination, invalidation de cache, gestion offline-first.

---

## 8. Tests & Qualité

- **Tests unitaires** : Couverture sur les services métiers, handlers MCP, UI critique.
- **Tests d’intégration** : Flux utilisateur, navigation, synchronisation DB.
- **Audit de code** : Checklists d’audit et de refactorisation dans `/docs`.
- **Lint & formatage** : ESLint, Prettier, hooks pre-commit.

---

## 9. Roadmap & TODO

- Finaliser les handlers manquants (updateMeal, deleteMeal, etc.)
- Étendre la couverture de tests (unitaires et intégration)
- Améliorer la gestion des tokens et la sécurité session
- Ajouter des features IA avancées et analytics
- Finaliser la documentation JSON MPC et automatiser la génération de docs
- Optimiser le support offline et la synchronisation

---

## 10. Ressources & Documentation

- Documentation technique MCP : `/docs/architecture_mcp.md`, `/docs/MPC.md`
- Checklists et audits : `/docs/`
- Documentation JSON du projet : `/docs/mpc-json/`
- Scripts et outils : `/scripts/`, `/utils/`

---

**Pour toute contribution, se référer aux standards du projet et consulter les checklists dans `/docs`.**

---

© 2025 Lift-Eat-Mobile | Tous droits réservés.
