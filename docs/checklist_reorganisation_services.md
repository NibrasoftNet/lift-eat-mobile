# Checklist de Réorganisation des Services

Ce document détaille les étapes nécessaires pour réorganiser les services de l'application Lift-Eat-Mobile afin d'améliorer la structure, la maintenabilité et la clarté du code.

## Objectifs

- Standardiser les conventions de nommage
- Regrouper les services par fonctionnalité et responsabilité
- Éliminer les services redondants ou vides
- Structurer les dossiers de manière logique
- Améliorer la documentation du code

## 1. Standardisation des Conventions de Nommage

- [ ] **Services de Pages** : Renommer tous en kebab-case avec suffixe `-pages.service.ts`
  - [ ] Renommer `analyticsPagesService.ts` → `analytics-pages.service.ts`
  - [ ] Vérifier que tous les autres respectent cette convention

- [ ] **Services Métier** : Renommer tous en kebab-case avec suffixe `.service.ts`
  - [ ] Renommer `userService.ts` → `user.service.ts`
  - [ ] Renommer `nutritionService.ts` → `nutrition.service.ts`
  - [ ] Renommer `authService.ts` → `auth.service.ts`
  - [ ] Vérifier les autres services métier

- [ ] **Services de Formulaires** : Renommer tous en kebab-case avec préfixe `form-` et suffixe `.service.ts`
  - [ ] Standardiser tous les services *-form.service.ts en `form-*.service.ts`
  - [ ] Exemple: `user-details-form.service.ts` → `form-user-details.service.ts`

- [ ] **Services d'Interface Utilisateur** : Préfixe `ui-` et suffixe `.service.ts`
  - [ ] Exemple: `drawer.service.ts` → `ui-drawer.service.ts`
  - [ ] Exemple: `deletion-modal.service.ts` → `ui-deletion-modal.service.ts`

## 2. Réorganisation par Dossiers

- [ ] **Créer Structure de Dossiers** dans `utils/services/`

  - [ ] `pages/` - Orchestration UI vers Services (garder le dossier existant)
    - Déplacer tous les services avec suffixe `-pages.service.ts`

  - [ ] `core/` - Services Métier Principaux
    - [ ] Déplacer `user.service.ts` (renommé)
    - [ ] Déplacer `nutrition.service.ts` (renommé)
    - [ ] Déplacer `meal.service.ts`
    - [ ] Déplacer `plan.service.ts`
    - [ ] Déplacer `progress.service.ts`
    - [ ] Déplacer `auth.service.ts` (renommé)
    - [ ] Déplacer `ingredient.service.ts`
    - [ ] Déplacer `external-api-service.ts`

  - [ ] `forms/` - Services de Validation et Préparation de Formulaires
    - [ ] Déplacer tous les services `form-*.service.ts` (renommés)
    
  - [ ] `ui/` - Services d'Interface Utilisateur
    - [ ] Déplacer tous les services `ui-*.service.ts` (renommés)
    
  - [ ] `common/` - Services Utilitaires Communs
    - [ ] Déplacer `logging.service.ts`
    - [ ] Déplacer `scanner.service.ts`
    - [ ] Déplacer tous les autres services d'utilité générale

## 3. Consolidation des Services Similaires

- [ ] **Regrouper les Services de Formulaires**
  - [ ] Évaluer la fusion des services de formulaires communs
    - [ ] Regrouper `form-gender.service.ts`, `form-physical-activity.service.ts` → `form-user-attributes.service.ts`
    - [ ] Regrouper services d'input similaires → `form-inputs.service.ts`

- [ ] **Regrouper les Services UI**
  - [ ] Fusionner les services de modal → `ui-modals.service.ts`
  - [ ] Fusionner les services de drawer → `ui-drawers.service.ts`

## 4. Nettoyage et Documentation

- [ ] **Supprimer ou Finaliser les Services Non Implémentés**
  - [ ] Service `analytics-pages.service.ts` - Soit l'implémenter soit le supprimer
  - [ ] Identifier et traiter tous les autres stubs
  
- [ ] **Documenter l'Architecture**
  - [ ] Créer `README.md` dans `/utils/services/` expliquant la structure
  - [ ] Définir clairement les responsabilités de chaque type de service
  - [ ] Ajouter des diagrammes explicatifs

- [ ] **Standardiser les Interfaces**
  - [ ] S'assurer que tous les services suivent le pattern MCP
  - [ ] Vérifier que tous les services retournent `OperationResult<T>`
  - [ ] S'assurer de la cohérence des interfaces entre services liés

## 5. Phase de Tests et Migration

- [ ] **Tests de Régression**
  - [ ] S'assurer que toutes les fonctionnalités existantes fonctionnent après refactorisation
  - [ ] Vérifier que tous les imports sont mis à jour

- [ ] **Mise à Jour des Composants**
  - [ ] Réviser tous les composants utilisant les services pour refléter les changements
  - [ ] Mettre à jour les importations dans les fichiers
  - [ ] S'assurer que toute l'application pointe vers les nouveaux emplacements

## 6. Documentation des Modifications

- [ ] **Mettre à Jour la Documentation Technique**
  - [ ] Réviser les commentaires JSDoc dans les fichiers de service
  - [ ] Mettre à jour la checklist de migration MCP pour refléter ces changements
  - [ ] Créer une documentation d'architecture à jour

## Étapes Prioritaires

1. Standardiser les noms de fichiers des services existants
2. Créer la structure de dossiers
3. Déplacer les fichiers dans leurs nouveaux dossiers
4. Mettre à jour les imports dans l'application
5. Finaliser la consolidation des services similaires
6. Tester et documenter les changements
