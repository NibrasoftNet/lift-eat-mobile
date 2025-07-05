# Analyse approfondie de l’utilisation de Gluestack UI dans l’application **Lift**

> Version : 2025-05-16 – Réalisée suite à la demande d’une migration vers **Shopify Restyle** et l’intégration d’un design Figma.

---

## 1. Objectifs de ce document

1. Dresser un état **quantitatif** et **qualitatif** de l’usage de Gluestack UI.
2. Identifier les **risques techniques** (dépendances, hooks, cycles) liés à la migration.
3. Proposer une **cartographie de migration** vers Restyle / Figma tokens.
4. Prioriser les **lots de travail** et définir des **KPIs** de réussite.

---

## 2. Synthèse chiffrée

| Catégorie                                                    | Nb. de composants | Imports distincts | Complexité moyenne |
| ------------------------------------------------------------ | ----------------- | ----------------- | ------------------ |
| **UI de base** (`Box`, `Text`, `Pressable`, etc.)            | ≈ 15              | 9                 | **Basse**          |
| **Formulaires** (`Input`, `Select`, `Slider`, etc.)          | 12                | 8                 | **Moyenne**        |
| **Feedback / Overlay** (`Modal`, `Toast`, `Drawer`, etc.)    | 10                | 6                 | **Haute**          |
| **Personnalisés** (ex : `MealCard`, `RulerPicker`)           | 8                 | –                 | **Très haute**     |
| **Utilitaires** (`tva`, `withStyleContext`, Tailwind plugin) | 5                 | –                 | **Critique**       |

> Les chiffres sont issus d’un scan automatique (`grep '@gluestack-ui/' -R —count`).

---

## 3. Cartographie des composants majeurs

### 3.1 UI de base

| Composant Gluestack | Fonction(s) principale(s) | Équivalent Restyle                      | Observations migration                             |
| ------------------- | ------------------------- | --------------------------------------- | -------------------------------------------------- |
| `Box`               | Container générique       | `Box` (createBox)                       | 100 + occurrences – migration itérative possible   |
| `Text`              | Affichage texte           | `Text` (createText)                     | Variants typographiques à recréer via Figma tokens |
| `Pressable`         | Zones tap/click           | `Pressable` (createRestyleComponent)    | Vérifier ripple / feedback tactile                 |
| `Icon`              | Icônes SVG / PNG          | `@shopify/restyle` + `react-native-svg` | Figma → SVG via MCP download                       |

### 3.2 Formulaires

| Composant            | Spécificités                               | Risque        | Remarques                                              |
| -------------------- | ------------------------------------------ | ------------- | ------------------------------------------------------ |
| `Input` / `Textarea` | Validation, variants (`error`, `disabled`) | ⚠️ Élevé      | Requiert une couche Formik/Yup existante               |
| `Select`             | Implémenté en **ActionSheet** mobile       | ⚠️ Très élevé | Restyle n’a pas de Select : à recréer                  |
| `Slider`             | Valeur continue, styling personnalisé      | Moyen         | Peut être remplacé par `react-native-slider` + Restyle |

### 3.3 Feedback & Overlay

| Composant     | Usage                    | Migration                              | Points d’attention           |
| ------------- | ------------------------ | -------------------------------------- | ---------------------------- |
| `Modal`       | 9 occurrences            | Wrapper Restyle + `react-native-modal` | Gestion accessibilityFocus   |
| `Drawer`      | 4 occurrences            | idem Modal (position = side)           | GestureHandler compat        |
| `Toast`       | Hook global (`useToast`) | Restyle custom context                 | Adapter aux appels existants |
| `ActionSheet` | 5 occurrences            | React Native ActionSheet               | Vérifier animations Expo 53  |

### 3.4 Composants personnalisés critiques

| Composant     | Dépendances                                         | Rôle métier                 | Impact migration                                   |
| ------------- | --------------------------------------------------- | --------------------------- | -------------------------------------------------- |
| `MealCard`    | `Box`, `Text`, `Pressable`, `Chip`, hooks nutrition | Affichage nutritionnel 100g | **Bloquant** : à refactoriser après création thème |
| `MealFilters` | `Select`, `Chip`, services pages                    | UX filtre de repas          | Adaptation après Select                            |
| `RulerPicker` | `Slider`, `Svg`, animations                         | Sélection quantité          | Risque : animations Expo 53                        |

---

## 4. Utilitaires Gluestack critiques

1. **`tva`** : génération de **variants** (taille, couleur, état). → Migrer vers **Restyle variants** (`createVariant`).
2. **`withStyleContext`** : HOC injectant le contexte de style → Restyle propose `useTheme`.
3. **`isWeb`** : branchements platform-specific → utiliser `Platform.OS` natif.
4. **Tailwind plugin** : génère classes utilitaires → Décider si l’on garde Tailwind ou full Restyle.

---

## 5. Dépendances & cycles

| Cycle identifié | Modules impliqués                                            | Impact                     | Action recommandée                               |
| --------------- | ------------------------------------------------------------ | -------------------------- | ------------------------------------------------ |
| **Cycle #1**    | `sqlite-server` ↔ `meal-handlers` ↔ `nutrition-core.service` | Warnings au démarrage      | Séparer la couche UI de ce cycle avant migration |
| **Cycle #2**    | `sqlite-server` ↔ `userContext` ↔ UI services                | Potentiel crash hot-reload | Introduire interfaces + injection dépendances    |

---

## 6. Mapping Restyle / Figma tokens

| Token Figma   | Catégorie | Mapping Restyle       | Exemple      |
| ------------- | --------- | --------------------- | ------------ |
| `Primary/500` | Couleur   | `colors.primary`      | `#00BFA6`    |
| `Spacing/M`   | Spacing   | `spacing.m`           | `16`         |
| `Font/H1`     | Typo      | `textVariants.header` | `24/32 bold` |

> Un **script automatique** (MCP Figma → JSON → `theme.ts`) sera mis en place.

---

## 7. Roadmap de migration (vue composant)

1. **Phase 0** : Configuration Restyle + ThemeProvider.
2. **Phase 1** : Migration UI de base (`Box`, `Text`, `Pressable`).
3. **Phase 2** : Mise en place des tokens Figma + variants.
4. **Phase 3** : Migration des formulaires.
5. **Phase 4** : Overlays (Modal, Drawer, Toast).
6. **Phase 5** : Composants personnalisés (MealCard etc.).
7. **Phase 6** : Nettoyage Tailwind/tva + suppression Gluestack deps.

---

## 8. KPIs & contrôles qualité (« Toujours vérifier »)

| KPI                               | Seuil      | Outil de vérification     |
| --------------------------------- | ---------- | ------------------------- |
| Couverture des composants Restyle | ≥ 90 %     | Storybook + tests visuels |
| Régression visuelle               | ≤ 2 % diff | Chromatic / Loki          |
| Performances (FPS)                | ≥ 55 fps   | React Dev Tools / Flipper |
| Taille APK/IPA                    | +0 % max   | EAS build size & diff     |

---

## 9. Prochaines actions immédiates

- [ ] Valider ce document avec l’équipe design + dev.
- [ ] Décider de la stratégie Tailwind : conserver ou éliminer.
- [ ] Créer le script prototype d’extraction tokens via **MCP Figma**.
- [ ] Mettre en place Storybook pour composants Restyle.
- [ ] Planifier la migration **Phase 1** (UI de base).
