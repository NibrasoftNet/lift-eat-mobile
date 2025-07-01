# Checklist de réimplémentation du système d'authentification

## 🔍 Phase 1 : Analyse et préparation

- [ ] **Analyse de l'existant**
  - [ ] Documenter l'état actuel du système d'authentification
  - [ ] Identifier les fonctionnalités manquantes ou incomplètes
  - [ ] Vérifier les cycles de dépendances liés à l'authentification

- [ ] **Configuration de l'environnement**
  - [ ] Mettre à jour les dépendances Clerk et Convex aux versions les plus récentes
  - [ ] Configurer les variables d'environnement requises
    - [ ] `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - [ ] Autres clés API nécessaires
  - [ ] Configurer le compte Clerk avec les bons paramètres
    - [ ] Vérifier/mettre à jour le domaine `amazing-werewolf-65.clerk.accounts.dev`
    - [ ] Configurer les fournisseurs OAuth (Google, etc.)

- [ ] **Planification du modèle de données**
  - [ ] Finaliser le schéma utilisateur avec tous les champs nécessaires
  - [ ] Définir la stratégie de migration pour les utilisateurs existants
  - [ ] Planifier la synchronisation bidirectionnelle entre SQLite et Convex

## 💻 Phase 2 : Implémentation Core

- [ ] **Configuration Clerk**
  - [ ] Activer et configurer `ClerkProvider` dans `_layout.tsx`
  - [ ] Implémenter les hooks d'authentification dans les composants concernés
  - [ ] Configurer les webhooks pour la synchronisation avec Convex

- [ ] **Intégration Convex**
  - [ ] Décommenter et mettre à jour `ConvexProviderWithClerk`
  - [ ] Compléter les fonctions de synchronisation dans `convex/http.ts`
  - [ ] Implémenter la gestion complète des événements (création, mise à jour, suppression)

- [ ] **Architecture MCP**
  - [ ] Refactoriser `auth-core.service.ts` pour utiliser Clerk
  - [ ] Adapter `auth-pages.service.ts` pour la nouvelle architecture
  - [x] Mettre à jour le `UserContextProvider` pour gérer la synchronisation de session (AsyncStorage ⇆ sessionStore)
  - [x] Limiter la persistance de `sessionStore` au token/expire uniquement (`partialize`)
  - [x] Ajouter la persistance immédiate de l'ID utilisateur après SSO (loginNew / registerNew / welcome)
  - [x] Gérer la redirection automatique si l'utilisateur est déjà authentifié (WelcomeScreen)  
    _(Evite l'erreur « You're already signed in. » et boucle vers l'écran Welcome)_

## 🔒 Phase 3 : Sécurité et fonctionnalités avancées

- [ ] **Authentification sécurisée**
  - [ ] Implémenter la vérification d'email
  - [ ] Configurer les politiques de mot de passe
  - [ ] Mettre en place la protection contre les attaques brute force

- [ ] **Gestion des sessions**
  - [ ] Configurer l'expiration des sessions
  - [ ] Implémenter la rotation des tokens
  - [ ] Créer une interface pour la gestion des sessions actives

- [ ] **Fonctionnalités utilisateur**
  - [ ] Finaliser le processus de réinitialisation de mot de passe
  - [ ] Implémenter la mise à jour de mot de passe
  - [ ] Ajouter la gestion des comptes liés (OAuth + email)

## 🧪 Phase 4 : Tests et déploiement

- [ ] **Tests unitaires**
  - [ ] Écrire des tests pour les services d'authentification
  - [ ] Tester les hooks et composants d'authentification
  - [ ] Vérifier la gestion des erreurs et cas limites

- [ ] **Tests d'intégration**
  - [ ] Tester le flux complet d'inscription/connexion
  - [ ] Vérifier la synchronisation des données entre Clerk et Convex
  - [ ] Tester les scénarios de récupération et erreurs

- [ ] **Déploiement progressif**
  - [ ] Déployer en environnement de développement
  - [ ] Effectuer des tests de charge et sécurité
  - [ ] Planifier la migration des utilisateurs existants

## 🔍 Phase 5 : Documentation et maintenance

- [ ] **Documentation technique**
  - [ ] Documenter l'architecture d'authentification
  - [ ] Créer des diagrammes de flux pour les processus clés
  - [ ] Rédiger des guides pour étendre le système

- [ ] **Guide utilisateur**
  - [ ] Documenter les procédures d'inscription et connexion
  - [ ] Créer des guides pour la réinitialisation de mot de passe
  - [ ] Expliquer les options d'OAuth disponibles

- [ ] **Plan de maintenance**
  - [ ] Établir un processus de mise à jour des dépendances
  - [ ] Définir des KPIs pour surveiller la performance
  - [ ] Planifier des audits de sécurité réguliers

## ⚠️ Points d'attention particuliers

- Assurer la rétrocompatibilité avec les utilisateurs existants
- Maintenir l'alignement avec l'architecture MCP
- Résoudre les cycles de dépendances identifiés
- Garantir que les transitions entre les états d'authentification sont fluides
- Implémenter une gestion robuste des erreurs à toutes les étapes
