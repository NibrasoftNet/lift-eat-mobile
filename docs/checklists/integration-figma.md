# ✅ Checklist d'intégration de la maquette Figma dans la **couche Presenter**

_Architecture cible_ : **M-C-P** (Model – Controller – Presenter)  
_Figma Kit_ : **Nutrio – Calorie Counter App UI Kit** (`fileKey: EokifkV4EzLIJ1zaU0nAsJ`)
_Approche style_ : **Custom styling** (sans Gluestack ni autres bibliothèques)

> Cette checklist est exhaustive. Cochez chaque action au fur et à mesure pour garantir une migration maîtrisée et traçable.

---

## 0. Préparation initiale

- [ ] **Créer** la branche `feature/figma-presenter`
- [ ] **Tagger** l'état actuel : `git tag ui-before-figma`
- [ ] Vérifier les dépendances Expo : `expo doctor`
- [ ] **Supprimer** les dépendances Gluestack : `npm uninstall @gluestack-*`
- [ ] Générer / vérifier le **token Figma API** `FIGMA_API_KEY`
- [ ] Dupliquer le fichier Figma dans votre espace et partager au token
- [ ] Mettre à jour `.env` avec `FIGMA_FILE_KEY=EokifkV4EzLIJ1zaU0nAsJ`

## 1. Extraction des design-tokens

- [ ] Couleurs : exporter → créer `theme/colors.ts`
- [ ] Typographie : familles, tailles, poids → `theme/typography.ts`
- [ ] Spacing & radii → `theme/spacing.ts` et `theme/radii.ts`
- [ ] Ombres & opacités → `theme/shadows.ts`
- [ ] Télécharger les **icônes SVG** (frame « Iconography ») → `assets/icons/`
- [ ] Télécharger les **polices .ttf** → `assets/fonts/`

## 2. Mise en place du Design System (DS) Custom

- [ ] Créer dossier `theme/` avec fichiers ci-dessus
- [ ] Créer `theme/index.ts` avec un hook `useTheme()` personnalisé
- [ ] Implémenter `ThemeProvider` custom dans `app/_layout.tsx`
- [ ] Charger les polices via `useFonts` d'Expo
- [ ] Créer utilitaire `applyStyles.ts` pour faciliter le styling sans bibliothèque
- [ ] Définir composants **Atoms** génériques personnalisés : `Box`, `Text`, `Icon`, `Button`, `Input`, `Divider`, `Badge`
- [ ] Créer conventions de style standard (padding, margin, shadow, etc.)
- [ ] Ajouter **Storybook** (ou expo-storybook) pour les Atoms

## 3. Construction des **Molecules** & **Organisms**

- [ ] Lister depuis Figma : cartes nutritions, progress bars, tabs, bottom navigation…
- [ ] Créer `components/ui/molecules/`
- [ ] Créer `components/ui/organisms/`
- [ ] Respecter la règle : _0 logique métier_ ; données via props
- [ ] Ajouter tests unitaires pour chaque molecule/organism

## 4. Création des **Templates** et Layouts

- [ ] `components/ui/templates/MainLayout.tsx`
- [ ] `components/ui/templates/AuthLayout.tsx`
- [ ] Intégrer Header, Footer, SafeArea, StatusBar

## 5. Migration des écrans (Présenters)

- [ ] Créer dossier `screens-new/`
- [ ] Écran « Home » (`HomePresenter`) ✦ inclut BottomTabs + DailySummary
- [ ] Écran « Meal Detail » (`MealDetailPresenter`) ✦ nutrition & ingrédients
- [ ] Écran « Add Meal » (`MealFormPresenter`) ✦ formulaire complet
- [ ] Écrans Onboarding + Profile + Settings
- [ ] Mettre à jour la navigation (`app/navigation/index.tsx`) avec les styles personnalisés
- [ ] Connecter chaque Presenter aux **services/pages** existants (Controller)

## 6. Tests & Qualité

- [ ] Mettre à jour snapshots Jest des nouveaux composants
- [ ] Vérifier l’accessibilité (labels, contrastes, focus order)
- [ ] E2E tests (Detox / Playwright) sur flux principaux
- [ ] Profiler les rendus (React DevTools) → pas de re-renders inutiles

## 7. Phase de **Feature-flag** (optionnel)

- [ ] Ajout d’un flag `USE_FIGMA_UI` dans config Expo
- [ ] Conditionner la navigation pour basculer entre anciennes/nouvelles vues
- [ ] Beta-test interne avant suppression définitive

## 8. Nettoyage & dépréciation

- [ ] Supprimer anciens composants `components/*` obsolètes
- [ ] Retirer imports morts : `pnpm ts-prune`
- [ ] Mettre à jour `docs/mcp/*` et `README.md`
- [ ] Supprimer feature-flag si tout est stable

## 9. Documentation & Livraison

- [ ] Compléter `CHANGELOG.md` — section `## [X.Y.0] – Figma Presenter overhaul`
- [ ] Mettre à jour captures d’écran App Store / Play Store
- [ ] Tag et release : `git tag vX.Y.0-figma-presenter`
- [ ] Déployer TestFlight + Google Play Internal

---

### Suivi visuel d'avancement

> Copiez ce tableau dans votre outil de gestion (Jira, Trello, Linear) pour le suivi sprint.

| Phase | Tâche                    | Assignee | Status |
| ----- | ------------------------ | -------- | ------ |
| 0     | Préparation              |          | ☐      |
| 0     | Suppression de Gluestack |          | ☐      |
| 1     | Tokens – Couleurs        |          | ☐      |
| 1     | Tokens – Typo            |          | ☐      |
| 2     | ThemeProvider Custom     |          | ☐      |
| 2     | Utils – applyStyles      |          | ☐      |
| 3     | Atoms – Button           |          | ☐      |
| …     | …                        |          | ☐      |

---

**Important :**

- Respecter l'isolation des couches MCP : le Presenter _ne doit pas_ contenir de logique métier ou de persistance.
- Surveiller les cycles de dépendances (voir `docs/refactorisation-dependances-circulaires.md`).
- Maintenir la cohérence des calculs nutritionnels via `nutrition-core.service.ts` – ne pas dupliquer la logique dans l'UI.
- Standardiser l'approche de style sans bibliothèque tierce : utiliser une composition cohérente de styles (StyleSheet.create ou direct) et éviter le style inline ad hoc.
