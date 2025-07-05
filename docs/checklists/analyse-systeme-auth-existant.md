# Analyse du système d'authentification existant - Lift

## 1. État actuel du système d'authentification

### 1.1 Architecture générale

Le système d'authentification actuel suit l'architecture MCP (Model-Controller-Presenter) avec:

- **Model (M)**:

  - Schéma `users` dans `db/schema.ts`
  - Définition des interfaces dans `utils/mcp/interfaces/user-interfaces.ts`
  - Absence de modèle pour les sessions ou tokens d'authentification

- **Controller (C)**:

  - Service core dans `utils/services/core/auth-core.service.ts`
  - Handlers d'accès à la base de données dans `utils/mcp/handlers/user-handlers.ts`
  - Point d'accès via `sqliteMCPServer` pour les opérations utilisateur

- **Presenter (P)**:
  - Service pages dans `utils/services/pages/auth-pages.service.ts`
  - Contexte utilisateur dans `utils/providers/UserContextProvider.tsx`
  - Composants UI dans `components/drawers/AuthDrawer.tsx`

### 1.2 Flux d'authentification

1. **Inscription/Connexion**:

   - Saisie d'email (et théoriquement mot de passe) dans les formulaires
   - Utilisation de `findOrCreateUser()` qui:
     - Vérifie si l'utilisateur existe
     - Crée automatiquement l'utilisateur s'il n'existe pas
   - Retourne les données utilisateur au contexte React
   - Génère un "simulated-token" (non fonctionnel)

2. **Session utilisateur**:

   - Géré uniquement via state React (non persistant)
   - Aucun mécanisme de refresh token ou session
   - Stockage en mémoire uniquement, perdu au rechargement de la page

3. **Déconnexion**:
   - Simple effacement de l'état utilisateur dans le contexte React
   - Aucune invalidation de session côté serveur

### 1.3 Technologies intégrées (mais désactivées)

- **Clerk**: Configuration présente mais commentée:

  - `ClerkProvider` et composants associés commentés dans `_layout.tsx`
  - Domaine configuré: `https://amazing-werewolf-65.clerk.accounts.dev/`
  - Dépendances présentes dans le package.json

- **Convex**: Configuration partielle:
  - Schéma défini dans `convex/schema.ts`
  - Webhooks pour la synchronisation Clerk-Convex
  - Mutations pour la création d'utilisateurs

## 2. Fonctionnalités manquantes ou incomplètes

### 2.1 Authentification et sécurité

- **Absence de vérification des mots de passe**:

  - Les mots de passe sont collectés mais jamais vérifiés
  - Absence de hachage et de stockage sécurisé
  - Auto-création d'utilisateurs posant des risques de sécurité

- **Gestion des sessions inexistante**:

  - Pas de tokens JWT ou similaires
  - Aucune persistance des sessions
  - Absence de mécanisme d'expiration ou de révocation

- **Fonctionnalités d'authentification incomplètes**:
  - Méthodes `resetPassword` et `updatePassword` non implémentées
  - Absence de vérification d'email
  - Pas de mécanisme anti-brute force

### 2.2 Intégration OAuth

- **Configuration OAuth partielle**:
  - Code pour l'intégration OAuth commenté
  - Support multiple providers prévu mais inactif
  - Absence de mapping profiles entre OAuth et système local

### 2.3 Gestion des utilisateurs

- **Synchronisation partielle des données**:

  - Webhook pour `user.created` configuré mais non actif
  - Absence de gestion des modifications ou suppressions
  - Pas de stratégie de migration des utilisateurs existants

- **Contrôle d'accès limité**:
  - Champ `role` présent mais non utilisé
  - Absence de middleware de sécurité pour les routes protégées
  - Pas de système de permissions granulaires

## 3. Cycles de dépendances identifiés

### 3.1 Dépendances directes

Le système d'authentification présente plusieurs cycles de dépendances:

1. **Premier cycle**:

   ```
   sqlite-server.ts → user-handlers.ts → auth-core.service.ts → sqlite-server.ts
   ```

2. **Second cycle**:
   ```
   auth-core.service.ts → UserContextProvider.tsx → sqlite-server.ts → auth-core.service.ts
   ```

### 3.2 Impacts et problèmes

- **Chargement initial**: Les cycles de dépendances causent des avertissements et peuvent causer des problèmes d'initialisation
- **Testabilité réduite**: Les composants fortement couplés sont difficiles à tester isolément
- **Maintenance complexifiée**: Les modifications dans un composant peuvent avoir des effets en cascade imprévus

### 3.3 Zones à découpler prioritairement

- **Interface d'accès aux données**: Séparer les interfaces d'accès à la base de données des services métier
- **Gestion d'état utilisateur**: Découpler le contexte utilisateur des services d'authentification directs
- **Services de synchronisation**: Isoler la logique de synchronisation entre systèmes locaux et externes (Clerk/Convex)

## 4. Conclusion et prochaines étapes

Le système d'authentification actuel représente une ébauche fonctionnelle mais très incomplète. Il s'agit davantage d'un système de "gestion d'utilisateurs" que d'une véritable solution d'authentification sécurisée.

Les principales priorités devraient être:

1. Implémenter une authentification réelle avec vérification des mots de passe
2. Mettre en place un système de sessions persistantes avec tokens
3. Résoudre les cycles de dépendances pour améliorer la maintenabilité
4. Activer l'intégration avec Clerk et Convex ou choisir une autre approche

La structure MCP existante offre une base solide pour cette évolution, mais des changements significatifs sont nécessaires pour garantir la sécurité et la robustesse du système.
