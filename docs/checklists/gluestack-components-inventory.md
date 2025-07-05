# Inventaire des composants Gluestack UI dans l'application Lift

## Composants UI de base

| Composant | Module Gluestack        | Usage                                    | Complexité de migration |
| --------- | ----------------------- | ---------------------------------------- | ----------------------- |
| Box       | @gluestack-ui/box       | Conteneur fondamental, largement utilisé | Moyenne                 |
| Text      | @gluestack-ui/text      | Affichage de texte, utilisé partout      | Basse                   |
| Heading   | @gluestack-ui/heading   | Titres et sous-titres                    | Basse                   |
| VStack    | @gluestack-ui/vstack    | Layout vertical, très utilisé            | Basse                   |
| HStack    | @gluestack-ui/hstack    | Layout horizontal                        | Basse                   |
| Pressable | @gluestack-ui/pressable | Composant interactif de base             | Basse                   |
| Icon      | @gluestack-ui/icon      | Affichage d'icônes                       | Moyenne                 |
| Image     | @gluestack-ui/image     | Affichage d'images                       | Basse                   |
| Divider   | @gluestack-ui/divider   | Séparateur visuel                        | Basse                   |
| Center    | @gluestack-ui/center    | Centrage de contenu                      | Basse                   |
| Grid      | @gluestack-ui/grid      | Layout en grille                         | Moyenne                 |

## Composants de formulaire

| Composant   | Module Gluestack           | Usage                            | Complexité de migration |
| ----------- | -------------------------- | -------------------------------- | ----------------------- |
| Input       | @gluestack-ui/input        | Champs de saisie, formulaires    | Moyenne                 |
| TextArea    | @gluestack-ui/textarea     | Saisie de texte long             | Moyenne                 |
| Select      | @gluestack-ui/select       | Menus déroulants, sélection      | Haute                   |
| Button      | @gluestack-ui/button       | Actions, formulaires, navigation | Moyenne                 |
| FormControl | @gluestack-ui/form-control | Structure de formulaires         | Haute                   |
| NumberInput | @gluestack-ui/number-input | Saisie numérique                 | Haute                   |
| Slider      | @gluestack-ui/slider       | Sélection de valeurs sur échelle | Haute                   |
| Chip        | @gluestack-ui/chip         | Sélection multiple, tags         | Moyenne                 |
| Calendar    | @gluestack-ui/calendar     | Sélection de dates               | Très haute              |
| RulerPicker | (composant personnalisé)   | Sélection sur règle              | Très haute              |

## Composants de feedback et interaction

| Composant        | Module Gluestack                | Usage                       | Complexité de migration |
| ---------------- | ------------------------------- | --------------------------- | ----------------------- |
| Modal            | @gluestack-ui/modal             | Fenêtres modales, dialogues | Haute                   |
| Drawer           | @gluestack-ui/modal (adapté)    | Tiroirs latéraux            | Haute                   |
| Toast            | @gluestack-ui/toast             | Notifications               | Moyenne                 |
| ActionSheet      | @gluestack-ui/actionsheet       | Menus contextuels           | Haute                   |
| Spinner          | @gluestack-ui/spinner           | Indicateurs de chargement   | Basse                   |
| Progress         | @gluestack-ui/progress          | Barres de progression       | Moyenne                 |
| CircularProgress | @gluestack-ui/circular-progress | Progression circulaire      | Moyenne                 |
| Menu             | @gluestack-ui/menu              | Menus contextuels           | Haute                   |
| FAB              | @gluestack-ui/fab               | Bouton d'action flottant    | Moyenne                 |

## Composants personnalisés basés sur Gluestack

| Composant        | Base Gluestack      | Usage                                       | Complexité de migration |
| ---------------- | ------------------- | ------------------------------------------- | ----------------------- |
| Card             | Box, VStack         | Affichage des repas, statistiques           | Haute                   |
| MealCard         | Card, Box, Text     | Cartes de repas avec affichage nutritionnel | Très haute              |
| ProfileStepper   | Box, Button         | Étapes d'inscription                        | Haute                   |
| ProgressionStats | Box, Text, Progress | Statistiques de progression                 | Haute                   |
| Accordion        | (personnalisé)      | Affichage des détails extensibles           | Haute                   |
| MealFilters      | Box, Chip, Select   | Filtrage des repas                          | Très haute              |
| Selectors        | Box, Pressable      | Sélecteurs personnalisés                    | Haute                   |

## Utilitaires et outils Gluestack

| Outil            | Module                                          | Usage                  | Impact sur la migration |
| ---------------- | ----------------------------------------------- | ---------------------- | ----------------------- |
| tva              | @gluestack-ui/nativewind-utils/tva              | Système de variants    | Critique                |
| withStyleContext | @gluestack-ui/nativewind-utils/withStyleContext | Contexte de style      | Critique                |
| isWeb            | @gluestack-ui/nativewind-utils/IsWeb            | Adaptation web/mobile  | Critique                |
| gluestackPlugin  | @gluestack-ui/nativewind-utils/tailwind-plugin  | Configuration Tailwind | Critique                |
| VariantProps     | @gluestack-ui/nativewind-utils                  | Typage des variants    | Élevé                   |

## Composants liés à l'affichage nutritionnel (100g)

Ces composants nécessitent une attention particulière car ils sont directement liés à la fonctionnalité clé d'affichage normalisé à 100g:

| Composant           | Base Gluestack | Fonctionnalité spécifique           | Complexité |
| ------------------- | -------------- | ----------------------------------- | ---------- |
| MealCard            | Card, Box      | Affichage nutritionnel à 100g       | Très haute |
| MealDetail          | VStack, Text   | Détail avec ajustement nutritionnel | Très haute |
| NutritionTable      | Table, Box     | Tableau des valeurs nutritionnelles | Haute      |
| AdjustmentIndicator | Text, Box      | Indicateur de facteur d'ajustement  | Moyenne    |

## Services UI liés à Gluestack

Plusieurs services UI interagissent directement avec les composants Gluestack et devront être adaptés:

- `drawer-ui.service.ts`
- `ingredient-ui.service.ts`
- `formatting-ui.service.ts`
- `preferences-ui.service.ts`
- `cooking-method-ui.service.ts`

## Problématiques spécifiques à surveiller

1. **Hooks personnalisés liés aux composants UI**:

   - `useNormalizedNutrition` (crucial pour l'affichage à 100g)
   - `useCookingMethodAdjustment`

2. **Intégration avec NativeWind/Tailwind**:

   - Le système de style est fortement couplé aux utilitaires Gluestack

3. **Composants conditionnels Web/Native**:

   - Plusieurs composants ont des versions spécifiques (.tsx/.web.tsx)

4. **Dépendances circulaires impliquant des composants UI**:
   - À vérifier si certains cycles impliquent des composants Gluestack

## Prochaines étapes de vérification

- [ ] Analyser la couverture des composants Gluestack dans les pages principales
- [ ] Vérifier les variants et thèmes personnalisés pour chaque composant
- [ ] Identifier les cas d'utilisation spécifiques du hook useNormalizedNutrition
- [ ] Examiner les interactions entre les services UI et les composants
- [ ] Évaluer l'impact de la migration sur les fonctionnalités du module IA
