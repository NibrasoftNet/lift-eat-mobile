# Plan de Refactorisation des Tabs - Lift-Eat-Mobile

## État Actuel
L'application Lift-Eat-Mobile dispose actuellement de 6 tabs:
- **Assistant**
- **Plans**
- **Meals** (repas)
- **Scanner**
- **Progress** (progrès/analytics)
- **IA** (avec sous-écrans: ia-chat, meal-generator, nutrition-analysis, plan-generator)

## Plan de Refactorisation

### Objectif: Réduire à 5 tabs
Nous allons conserver les tabs suivants:
1. **Assistant** - Tab enrichi avec les fonctionnalités IA
2. **Plans** - Gestion des plans nutritionnels
3. **Meals** - Gestion des repas
4. **Progress** - Suivi des progrès
5. **Analytics** - Analyses détaillées

### Modifications Principales

#### 1. Suppression du Tab Scanner
Le tab Scanner sera supprimé de la barre de navigation.

#### 2. Réorganisation du Tab IA
Les écrans suivants du tab IA seront déplacés pour devenir des composants dans le tab Assistant:
- `ia-chat.tsx`
- `index.tsx`
- `meal-generator.tsx`
- `nutrition-analysis.tsx`
- `plan-generator.tsx`

#### 3. Enrichissement du Tab Assistant
Le tab Assistant servira désormais de point central pour toutes les fonctionnalités basées sur l'IA:
- Chat avec l'IA
- Génération de repas
- Analyse nutritionnelle
- Génération de plans

## Étapes de Mise en Œuvre

1. Modifier `_layout.tsx` pour ajuster la navigation
2. Transformer les écrans IA en composants réutilisables
3. Intégrer ces composants dans le tab Assistant
4. Réacheminer les navigations pour refléter la nouvelle structure
5. Mettre à jour les références et les importations dans le code

## Avantages de cette Refactorisation

- **Simplification de l'Interface**: Interface utilisateur plus intuitive avec moins d'onglets
- **Centralisation des Fonctionnalités IA**: Regroupement logique des fonctionnalités liées
- **Cohérence UX**: L'assistant devient véritablement un point d'accès complet pour l'aide IA
- **Modularité**: Les composants IA pourront être réutilisés plus facilement
