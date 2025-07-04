# 📝 Checklist d'intégration Figma - Lift App

_Architecture cible_ : **M-C-P** (Model – Controller – Presenter)  
_Figma Kit_ : **Nutrio – Calorie Counter App UI Kit** (`fileKey: EokifkV4EzLIJ1zaU0nAsJ`)
_Approche style_ : **Custom styling** (StyleSheet.create) + **ThemeProvider**  
> Tailwind CSS retiré le 26/05/2025

> Dernière mise à jour : 08/06/2025

---

## 🟢 ÉLÉMENTS TERMINÉS

### Préparation initiale et configuration

- [x] **Créer** la branche `feature/figma-presenter`
- [x] **Tagger** l'état actuel : `git tag ui-before-figma` 
- [x] Vérifier les dépendances Expo : `expo doctor`
- [x] **Supprimer** les dépendances Gluestack : `npm uninstall @gluestack-*`
- [x] Générer / vérifier le **token Figma API** `FIGMA_API_KEY`
- [x] Mettre à jour `.env` avec `FIGMA_FILE_KEY=EokifkV4EzLIJ1zaU0nAsJ`

### Design Tokens

- [x] Couleurs : exporter → créer `theme/colors.ts`
- [x] Typographie Urbanist : exporter → créer `theme/typography-urbanist.ts`
- [x] Typographie Playfair Display : exporter → créer `theme/typography-playfair.ts`
- [x] Typographie Roboto Flex : exporter → créer `theme/typography-roboto.ts`
- [x] Spacing & radii → `theme/spacing.ts` et `theme/radii.ts`
- [x] Ombres & opacités → `theme/shadows.ts`
- [x] Télécharger les **icônes SVG** (frame « Iconography ») → `assets/icons/` (✅ 1825 icônes intégrées le 18/05/2025)
- [x] Télécharger les **polices .ttf** → `assets/fonts/` (✅ Intégré le 18/05/2025)
  - [x] Télécharger Urbanist depuis Google Fonts
  - [x] Télécharger Playfair Display depuis Google Fonts
  - [x] Télécharger Roboto Flex depuis Google Fonts
  - [x] Mettre à jour app.json avec les chemins des polices
- [x] Normaliser les unités typographiques (remplacer %, em par valeurs numériques) (✅ 20/05/2025)

### Design System (DS) Custom

- [x] Créer dossier `theme/` avec fichiers de tokens ci-dessus
- [x] Créer `theme/index.ts` avec un hook `useTheme()` personnalisé (✅ Intégré le 18/05/2025)
  - [x] Exposer l'API des couleurs
- [x] Définir composants **Atoms** génériques personnalisés (✅ Intégré le 18/05/2025) :
  - [x] `Box.tsx` (conteneur de base avec styling)
  - [x] `Text.tsx` (texte avec styling)
  - [x] `Button.tsx` (bouton avec variants)
  - [x] `Icon.tsx` (wrapper pour les icônes SVG)
  - [x] `Input.tsx` (champs de saisie) (✅ Intégré le 18/05/2025)
  - [x] `Divider.tsx` (séparateurs) (✅ Intégré le 18/05/2025)
  - [x] `Badge.tsx` (indicateurs visuels) (✅ Intégré le 18/05/2025)
  - [x] Émojis fluents (26 composants SVG) (✅ Intégré le 20/05/2025)

### Composants Molecules

- [x] Analyser et lister les molecules depuis Figma (✅ Intégré le 18/05/2025)
  - [x] Section Navigation & Controls (TopBar, NavigationItem, Toolbar)
  - [x] Section Forms & Inputs (InputForm, Search, Dropdown)
  - [x] Section Progress & Stats (InsightCharts, ProgressBar, CircularProgress)
  - [x] Nutrition Specifics (NutritionCard, FoodCard, FoodEmoji)
  - [x] User Interaction (DrinkTypes, CupSize, MoodComponent)
  - [x] InputForm (node-id=442-3249)
  - [x] InputForm2 (node-id=1953-213380)
  - [x] Dropdown (node-id=2766-23992)
  - [x] Search (node-id=442-3286)
  - [x] Chips (node-id=1953-213392)
  - [x] WaterTracker - HistoryEmpty (node-id=48500-33216)
  - [x] WaterTracker - CustomizeCupSize (node-id=48500-33110)
  - [x] WaterTracker - DrinkTypeSelector (node-id=48500-33104)
  - [x] WaterTracker - WaterIntake (node-id=48500-35710)
  - [x] WaterTracker - HistoryList (node-id=48501-24041)
  - [x] Grid (node-id=435-5225)
  - [x] Avatar (node-id=433-884)
  - [x] Checkbox (node-id=442-3260)
  - [x] Toggle (node-id=442-3264)
  - [x] Radio (node-id=442-3262)
  - [x] Keyboard (node-id=2766-23996)
  - [x] Modal (node-id=2766-23998)
  - [x] TopBar (node-id=433-887)
  - [x] Tag (node-id=2766-24001)
  - [x] HomeIndicator (node-id=2766-23984)
  - [x] Divider (node-id=3391-22177) - déjà implémenté
  - [x] AppLogo (node-id=2766-24005)
  - [x] Alert (node-id=442-3276)
  - [x] HorizontalTab (node-id=442-3274)
  - [x] Navbar (node-id=1644-48374)
  - [x] FoodDetailsPersonal (node-id=48468:22898)
  - [x] Menu Bar (node-id=3404-17376)
  - [x] Bottom Bar Button Action (node-id=1644-48346)
  - [x] SearchForm (node-id=3404-17378)
  - [x] CategoryMenu (node-id=3167-91902)
  - [x] AutoLayout (node-id=3404-17380)
  - [x] PagingHorizontalTab (node-id=42454-57940)
  - [x] NutritionCard (node-id=30490-90168, Frame: Elements, Section: Insights & Nutrio Elements) (✅ 22/05/2025)
  - [x] CircularProgress (node-id=48534-38029, Frame: Elements, Section: Step Counter & Tracker) (✅ 22/05/2025)
  - [x] AccountListItem (node-id=560-15440, Frame: Elements, Section: Account List) (✅ 23/05/2025)
  - [x] Goals percentage (node-id=46495-32349, Frame: Elements) (✅ 20/05/2025)
  - [ ] Date & Progress (node-id=24498-52421, Frame: Elements)
  - [ ] Payment Methods (node-id=28524-46860, Frame: Elements)
  
  ## Sous-composants Calorie Tracker (Approche modulaire)
  - [x] Calorie Circle Progress (node-id=48469-23065) (✅ 20/05/2025)
  - [x] Liste des composants déjà implémentés en tant que molecules
    - [x] Macronutrient Indicators (implémenté dans MacronutrientDistributionBar - 21/05/2025)
    - [x] Meal List Item (node-id=48500-29904) (✅ 20/05/2025)
    - [x] Meal Nutritional Values (node-id=48488-31442) (✅ 20/05/2025)
    - [x] Quantity Selector (node-id=48485-28633) (✅ 20/05/2025)
    - [x] Food List (implémenté dans FoodList - 21/05/2025)
  
  - [✅] Calorie Tracker principal (node-id=48453-12171 light mode et 48453-12170 dark mode) - Implémentation pixel par pixel (21/05/2025)
    - [✅] DateNavigationHeader - En-tête avec navigation de date
    - [✅] MainProgressCircle - Section principale avec cercle de progression
    - [✅] TitleDivider - Séparateurs avec titre pour les sections
    - [✅] MacronutrientDistributionBar - Distribution complète des macronutriments
    - [✅] CaloriesBurnedSection - Section des calories brûlées
    - [✅] FoodList - Liste des aliments consommés
  
  - [ ] Écrans complémentaires du Calorie Tracker (en cours d'implémentation)
    - [✅] Food Details (node-id=48469-23065 dark mode, node-id=48468-22898 light mode) - Implémenté le 21/05/2025
    - [✅] Food Image Picker - Composant pour la sélection d'images de repas (implémenté le 21/05/2025)
      - Permet de sélectionner une icône SVG prédéfinie parmi 13 options
      - Permet de prendre une photo avec l'appareil photo
      - Permet de choisir une image depuis la galerie
    - [✅] Food Details Personal (node-id=48485-28856 dark mode, node-id=48485-28633 light mode) - Implémenté le 21/05/2025
    - [x] Edit Food Intake (node-id=48467-14697 dark mode, node-id=48467-14696 light mode) - Implémenté le 25/05/2025
    - [x] Add Food Intake (node-id=48466-14320 dark mode, node-id=48466-14319 light mode) - Implémenté le 25/05/2025
    - [x] Meal Form (node-id=48488-31447 dark mode, node-id=48488-31446 light mode) - Implémenté le 25/05/2025
    - [x] Add Food Intake Bottom Bar Action (node-id=48465-13632 dark mode, node-id=48465-13595 light mode) - Implémenté le 25/05/2025
  - [x] Water Tracker (node-id=48453-12260 et 48453-12259)

### Onboarding Components (✅ 28/05/2025)

- [✅] **Composants de formulaire Onboarding**
  - [✅] AgeSelector - Sélecteur d'âge simplifié avec options de sélection rapide
  - [✅] HeightSelector - Sélecteur de taille avec visualisation intuitive
  - [✅] CurrentWeightSelector - Sélecteur de poids actuel avec options
  - [✅] TargetWeightSelector - Sélecteur de poids cible avec options
  - [✅] NameInput (node-id=48444-18418, node-id=48444-18415) - Champ de saisie du nom avec styles de texte adaptés
  - [✅] Icônes de genre
    - [✅] MaleIcon - Icône pour le genre masculin
    - [✅] FemaleIcon - Icône pour le genre féminin

- [✅] **Service d'onboarding MCP** (✅ 28/05/2025)
  - [✅] `onboarding.service.ts` (couche Model) - Gère les opérations de base des données d'onboarding
  - [✅] `onboarding-pages.service.ts` (couche Presenter) - Orchestre les opérations entre UI et logique métier
  - [✅] Tous les écrans onboarding (1-5) migrés vers l'architecture MCP de sélection rapide

### Migration StyleSheet (✅ 26/05/2025)

- [x] **Suppression des composants Tailwind**
  - [x] Suppression de tous les fichiers avec suffixe 'TW'
  - [x] Vérification et nettoyage des imports
  - [x] Suppression de tailwind-components.ts

- [x] **Migration vers StyleSheet**
  - [x] MenuBar.tsx et MenuItem.tsx migrés vers StyleSheet
  - [x] Vérification des composants existants
    - [x] BottomBarButtonAction.tsx - déjà en StyleSheet
    - [x] CategoryMenu.tsx - déjà en StyleSheet



### Composants Organisms

- [x] Analyser et lister les organisms depuis Figma (✅ Intégré le 18/05/2025)
- [x] SearchBarWithFilter (Frame: Elements, Section: Search form & Category)
- [x] ProfileView (Frame: Elements, Section: Account List & Goals)
- [x] NutritionalDashboard (Frame: Elements, Section: Insights & Tracker)
- [x] CalorieTracker (node-id=48453-12171 et 48453-12170) (✅ 20/05/2025)

### Écrans terminés

- [x] Écrans d'onboarding (implémentés le 22/05/2025) ✅
  - [x] Splash Screen (node-id=3821-124001)
  - [x] Walkthrough 1 (node-id=4237-8611)
  - [x] Walkthrough 2 (node-id=4238-13767)
  - [x] Walkthrough 3 (node-id=4238-13801)

- [x] Welcome (`app/(root)/(auth)/welcome.tsx`) - Terminé ✅ (21/05/2025)
  - [x] Persistance immédiate de l'ID utilisateur après SSO + mise à jour du `sessionStore`
  - [x] Redirection automatique si utilisateur déjà authentifié
  - [x] Gestion de l'erreur Clerk « You're already signed in »
  - [x] Logo et titre 
  - [x] Boutons de connexion sociale (Google, Apple, Facebook)

- [x] Login (`app/(root)/(auth)/loginNew.tsx`) et LoginTW (`app/(root)/(auth)/loginTW.tsx`) - Terminé ✅ (22/05/2025)
  - [x] Formulaire d'authentification conforme au design Figma
  - [x] Integration du ThemeProvider
  - [x] Ajout des boutons sociaux avec divider

### Plan de migration et documentation

- [x] Établir un plan de migration par ordre de priorité (mise à jour le 22/05/2025)
  - [x] Définir la séquence des écrans à migrer
  - [x] Déterminer les dépendances entre écrans
  - [x] **Nouvelle approche**: Recréer les écrans complets selon le design Figma en conservant les fonctionnalités

### Mises à jour récentes (08/06/2025)

### 7.1 Correction des erreurs de navigation Expo Router (02/06/2025)
- [x] Correction des routes dans `app/(root)/(tabs)/_layout.tsx` pour résoudre les avertissements "No route named X exists in nested children"
  - [x] Modification de `assistant` → `assistant/index`
  - [x] Modification de `progress` → `progress/index` 
  - [x] Modification de `analytics` → `analytics/index`
- [x] Résolution de la boucle infinie de rafraîchissement des données utilisateur
  - [x] Ajout d'une variable `isInitialized` pour éviter les appels multiples
  - [x] Utilisation d'un tableau de dépendances vide `[]` dans le useEffect
  - [x] Ajout d'une condition pour ne rafraîchir que si l'ID utilisateur a changé

### 7.2 Correction des composants d'ingrédients
- [x] Correction de la propriété `ingredientsStandard` dans le composant `IngredientCard` pour l'affichage correct des images et noms d'ingrédients
- [x] Ajout de logs de débogage pour vérifier la structure des données
- [x] Amélioration de l'espacement entre les éléments (photo du repas et son nom)

### 7.2 Adaptation de la palette de couleurs
- [x] Changement des éléments bleus (#6C5CE7) vers la couleur verte primaire (#A1CE50) pour:
  - [x] Bordures d'images (Avatar)
  - [x] Boutons et actions
  - [x] Icônes (flèche de retour, modification, suppression)
  - [x] Textes et noms
- [x] Conservation des couleurs originales pour les éléments nutritionnels (cercles et indicateurs)

### 7.3 Vérification et documentation
- [x] Audit des fichiers de documentation pour garantir leur cohérence
- [x] Mise à jour des statuts d'implémentation dans les documents de suivi
- [x] Vérification de la conformité visuelle avec les designs Figma

### 7.4 Migration vers Tailwind CSS (25/05/2025)
- [x] Migration complète des composants de sélection d'aliments vers Tailwind CSS
  - [x] CuisineTypeFilterTW (node-id=3167-91902)
  - [x] FoodImagePickerTW
  - [x] IngredientCardTW
  - [x] MealCardTW
  - [x] MealTypeFilterTW

- [x] Migration des composants complexes vers Tailwind CSS
  - [x] CaloriesBurnedSectionTW (node-id=48466-14320)
  - [x] DateNavigationHeaderTW
  - [x] FoodDetailsPersonalTW (node-id=48468:22898) avec support d'images depuis la base de données
  - [x] MacronutrientDistributionBarTW
  - [x] MainProgressCircleTW
  - [x] TitleDividerTW

## 🔴 ÉLÉMENTS À FAIRE (par priorité)

### Haute priorité - Compléter les composants UI critiques

- [x] Composants du Menu Bar (Priorité 1) ✅ (30/05/2025)
  - [x] Menu Bar (node-id=3404-17376) avec variantes
  - [x] Home Menu Item avec icône (node-id=44443:22604)
  - [x] Tracker Menu Item avec icône (node-id=48453:12903)
  - [x] Insights Menu Item avec icône (node-id=48453:12930)
  - [x] Articles Menu Item avec icône (node-id=44443:23757)
  - [x] Account Menu Item avec icône (node-id=48453:15801)

- [ ] Organisms essentiels (Priorité 1)
  - [x] BottomNavigation ✅ (26/05/2025)
  - [x] HeaderBar ✅ (26/05/2025)
  - [ ] Listes avec recherche et filtres

- [x] Templates principaux (Priorité 1) ✅ (26/05/2025)
  - [x] `components/ui/templates/MainLayout.tsx` (avec navigation bottom)
  - [x] `components/ui/templates/AuthLayout.tsx` (pour écrans connexion/inscription)
  - [x] `components/ui/templates/FormLayout.tsx` (pour formulaires)
  - [x] `components/ui/templates/DetailLayout.tsx` (pour vues détail)

- [x] Intégration de composants de base (Priorité 1) ✅ (26/05/2025)
  - [x] Header commun avec SafeArea (`HeaderWithSafeArea.tsx`)
  - [x] Footer avec navigation (`FooterWithNavigation.tsx`)
  - [x] StatusBar personnalisé (`CustomStatusBar.tsx`)
  - [x] Tests de rendu sur plusieurs tailles d'écran (`ResponsiveLayoutTest.tsx`)

### Migration des flux d'onboarding (28/05/2025)

- [✅] Migration complète du flux onboarding vers l'architecture MCP
  - [✅] Correction des problèmes de typage dans les écrans d'onboarding
  - [✅] Ajout de logs détaillés pour faciliter le débogage
  - [✅] Implémentation correcte de la synchronisation des données utilisateur avec la base de données
  - [✅] Résolution des problèmes de conversion ID (string → number)
  - [✅] Standardisation de la gestion des erreurs à travers tous les écrans
  - [✅] Utilisation cohérente du UserContext pour l'accès aux données utilisateur

### Écrans d'authentification et d'onboarding (✅ 28/05/2025)

- [✅] LoginNew (`app/(root)/(auth)/loginNew.tsx`) (node-id=40432-41582)
  - [✅] Implémentation complète conforme au design Figma
  - [✅] Intégration avec Clerk pour l'authentification
  - [✅] Gestion des erreurs et validation des formulaires

- [✅] RegisterNew (`app/(root)/(auth)/registerNew.tsx`) (node-id=40432-39018)
  - [✅] Implémentation complète conforme au design Figma
  - [✅] Intégration avec Clerk pour la création de compte
  - [✅] Redirection vers la vérification email
  - [✅] Logs détaillés pour le débogage

- [✅] Verification (`app/(root)/(auth)/verification.tsx`)
  - [✅] Nouveau composant OTP amélioré avec design cercles/cases
  - [✅] Gestion des erreurs et resend code
  - [✅] Redirection vers onboarding après succès

- [✅] Onboarding (5 étapes)
  - [✅] Step1 - Nom et genre (`onboarding-step1.tsx`)
  - [✅] Step2 - Date de naissance (`onboarding-step2.tsx`)
  - [✅] Step3 - Taille (`onboarding-step3.tsx`)
  - [✅] Step4 - Poids actuel (`onboarding-step4.tsx`)
  - [✅] Step5 - Poids cible (`onboarding-step5.tsx`)

### Priorité moyenne - Écrans d'authentification restants


- [ ] Reset Password (`app/(root)/(auth)/reset-password.tsx`) (Basse Priorité - Planifié pour Octobre 2025)
  - [ ] Écran de demande d'email
  - [ ] Écran de vérification du code
  - [ ] Écran de nouveau mot de passe
  - [ ] Confirmation de changement

### Écrans principaux (Tabs)

#### Écrans implémentés ✅
- [x] **MealsNew** (`app/(root)/(tabs)/MealsNew/index.tsx`) (30/05/2025)
  - [x] Liste des repas avec filtres par cuisine et type
  - [x] Navigation vers les détails du repas
  - [x] Fonctionnalité de suppression avec confirmation
  - [x] Affichage correct des images avec fallback

#### Écrans à implémenter (Juin 2025) 🟡

##### Tracking & Analyse
- [ ] **Analytics Dashboard** (`app/(root)/(tabs)/analytics.tsx`)
  - [ ] Graphiques d'évolution (poids, calories, macros)
  - [ ] Résumé hebdomadaire et mensuel
- [ ] **Progress Tracking** (`app/(root)/(tabs)/progress.tsx`)
  - [ ] Suivi visuel des objectifs
  - [ ] Badges et récompenses

##### Trackers spécifiques
- [ ] **Water Tracker** (`app/(root)/(tabs)/(tracker)/water.tsx`)
  - [ ] Ajout/suppression de consommation d'eau
  - [ ] Personnalisation des tailles de verre
- [ ] **Step Counter** (`app/(root)/(tabs)/(tracker)/step-counter.tsx`)
  - [ ] Intégration avec capteurs de l'appareil
  - [ ] Historique des pas

##### Gestion des repas (Juillet 2025)
- [x] **Meal Search** (`app/(root)/(tabs)/meals/search.tsx`)
  - [x] Recherche par nom/ingrédient (OpenFoodFacts)
  - [x] Filtres avancés (cuisine, type de repas, etc.) - 10/06/2025
- [x] **My Meals List** (`app/(root)/(tabs)/meals/my-meals/index.tsx`)
  - [x] Liste des repas personnels avec filtres (type & cuisine)
  - [x] Actions rapides (éditer, supprimer, dupliquer*)
- [x] **Create Meal** (`app/(root)/(tabs)/meals/my-meals/create-v2.tsx`)
  - [x] Formulaire de création avec ajout d'ingrédients
  - [x] Upload d'image (gallerie/appareil photo) - 10/06/2025
  - [x] Calcul automatique des valeurs nutritionnelles (nutrition-engine)
- [x] **Meal Details** (`app/(root)/(tabs)/meals/my-meals/details/[id].tsx`)
  - [x] Affichage détaillé des valeurs nutritionnelles
  - [ ] Historique des consommations (à implémenter)
- [x] **Edit Meal** (`app/(root)/(tabs)/meals/my-meals/edit/[id].tsx`)
  - [x] Modification des ingrédients et des quantités
  - [x] Mise à jour des valeurs nutritionnelles (recalcul en temps réel)

#### Fonctionnalités secondaires (Septembre 2025) 🔵

##### Outils avancés
- [ ] **Assistant IA** (`app/(root)/(tabs)/assistant.tsx`)
  - [ ] Recommandations personnalisées
  - [ ] Ajustements de plan automatiques
  - [ ] Conseils nutritionnels contextuels

##### Outils de suivi
- [ ] **Weight Tracker** (`app/(root)/(tabs)/(tracker)/weight.tsx`)
  - [ ] Saisie manuelle du poids
  - [ ] Graphique d'évolution
  - [ ] Rappels programmés
- [ ] **Meal Scanner** (`app/(root)/(tabs)/meals/scanner.tsx`)
  - [ ] Reconnaissance d'image d'aliment
  - [ ] Lecture de code-barres
  - [ ] Suggestions automatiques d'aliments similaires
- [ ] **Sleep Tracker** (`app/(root)/(tabs)/(tracker)/sleep.tsx`)
  - [ ] Saisie des heures de sommeil
  - [ ] Graphique de qualité du sommeil
  - [ ] Intégration avec montres connectées

#### Plans nutritionnels (Août 2025) 🔵

##### Gestion des plans
- [ ] **Plans List** (`app/(root)/(tabs)/plans/my-plans/index.tsx`)
  - [ ] Liste des plans personnels
  - [ ] Statistiques d'adhérence au plan
- [ ] **Create Plan** (`app/(root)/(tabs)/plans/my-plans/create/index.tsx`)
  - [ ] Assistant de création de plan
  - [ ] Sélection d'objectif nutritionnel
- [ ] **Plan Target** (`app/(root)/(tabs)/plans/my-plans/create/target/index.tsx`)
  - [ ] Définition des objectifs caloriques et macro
  - [ ] Planification par jours/semaines
- [ ] **Plan Details** (`app/(root)/(tabs)/plans/my-plans/details/[id].tsx`)
  - [ ] Vue détaillée du plan
  - [ ] Suivi des progrès

##### Plans communautaires
- [ ] **Community Plans** (`app/(root)/(tabs)/plans/community.tsx`)
  - [ ] Parcourir les plans de la communauté
  - [ ] Filtres par objectif et popularité
- [ ] **Company Plans** (`app/(root)/(tabs)/plans/company.tsx`)
  - [ ] Plans recommandés par des nutritionnistes
  - [ ] Programmes spécifiques

#### Profil utilisateur (Septembre 2025) 🔵

##### Informations personnelles
- [ ] **User Profile** (`app/(root)/(user)/profile/[id].tsx`)
  - [ ] Affichage du profil utilisateur
  - [ ] Stats et tendances personnelles
  - [ ] Badges et réalisations
- [ ] **User Details** (`app/(root)/(user)/details/index.tsx`)
  - [ ] Édition des informations personnelles
  - [ ] Mise à jour des objectifs
- [ ] **Profile** (node-id=48445:41267)
  - [ ] Section photos de profil
  - [ ] Mise en page conforme au design Figma

##### Paramètres et configuration
- [ ] **Settings** (node-id=48445:41342)
  - [ ] Options d'application
  - [ ] Préférences d'affichage
  - [ ] Gestion des unités de mesure
- [ ] **Notifications** (node-id=48470:24001)
  - [ ] Configuration des rappels
  - [ ] Préférences de notification
- [ ] **Aide et Support** (node-id=48471:25043)
  - [ ] FAQ et guide utilisateur
  - [ ] Formulaire de contact
  - [ ] Documentation intégrée

## ⚙️ Tests et qualité (transversal)

### Architecture MCP
- [ ] **Séparation stricte des responsabilités**
  - [x] Model: Schémas dans `db/schema.ts`
  - [x] Controller: Services core dans `utils/services/core`
  - [x] Presenter: Composants UI et services pages dans `utils/services/pages`
- [ ] **Vérification des services**
  - [ ] Audit du code pour garantir _0 logique métier_ dans le Presenter
  - [ ] Vérifier que toutes les données sont injectées via props
  - [ ] S'assurer que les validations sont dans la couche Controller

### Tests
- [ ] **Tests unitaires**
  - [ ] Créer des tests pour chaque molecule/organism
  - [ ] Tester les services individuellement
  - [ ] Simuler les interactions utilisateur
- [ ] **Tests d'accessibilité**
  - [ ] Vérifier les labels et descriptions alt
  - [ ] Valider les contrastes des couleurs
  - [ ] Tester la navigation au clavier et ordre de focus
- [ ] **Tests E2E**
  - [ ] Tester le flux d'ajout/édition de repas
  - [ ] Tester le flux d'onboarding complet
  - [ ] Tester le processus d'authentification

### Performance
- [ ] **Optimisation des rendus**
  - [ ] Identifier et corriger les re-renders inutiles
  - [ ] Utiliser React.memo et useCallback où nécessaire
  - [ ] Optimiser les listes avec tailles virtualisées
- [ ] **Gestion des ressources**
  - [ ] Compression des images et ressources
  - [ ] Lazy loading des composants non critiques
  - [ ] Mesure des performances avec React DevTools

## 📍 Nettoyage et finalisation

### Finalisation de la navigation

- [ ] Mettre à jour la navigation avec les nouveaux écrans (Priorité 1)
  - [ ] Modifier `app/navigation/index.tsx`
  - [ ] Appliquer les styles personnalisés
- [ ] Supprimer les références aux anciens composants (Priorité 1)
- [ ] Connecter chaque Presenter aux services/pages existants (Controller) (Priorité 1)

### Documentation et guides

- [ ] Documenter les conventions Tailwind utilisées (Priorité 2)
- [ ] Créer une documentation du système de design (Priorité 2)
- [ ] Guide d'utilisation des composants pour les développeurs (Priorité 2)

---
**Important :**
- Respecter l'isolation des couches MCP : le Presenter _ne doit pas_ contenir de logique métier ou de persistance.
- Maintenir la cohérence des calculs nutritionnels via `nutrition-core.service.ts` – ne pas dupliquer la logique dans l'UI.
- Standardiser l'approche de style sans bibliothèque tierce : utiliser une composition cohérente de styles (StyleSheet.create ou direct) et éviter le style inline ad hoc.

## 🔄 Mises à jour récentes (08/06/2025)

### Palette et composants
- 🎨 **Nouvelle couleur d’action primaire** `#8BC255` avec texte/icônes blancs.
  - Appliquée aux boutons **CreateMealButton** et **FilterButton** (écran *My Meals*).
- ♻️ Migration complète des composants de l’écran *My Meals* vers `ThemeProvider` :
  - `SearchBarWithScanner`, `FilterButton`, `CreateMealButton`, `MealListItem`.
  - Suppression des couleurs codées en dur, bordures dynamiques selon mode light/dark.
- 🚫 Désactivation de la suppression d’ingrédient dans la vue détail (*[id].tsx*).

### Règles d’icônes SVG
- Utilisation **obligatoire** des icônes via import direct (`assets/icons/figma/...`) – voir mémoire projet.

## 8. Nettoyage & finalisation
- [ ] Supprimer les composants legacy
- [ ] Retirer les imports non utilisés avec `pnpm ts-prune`
- [ ] Mettre à jour la documentation
  - [ ] Actualiser `docs/mcp/` 
  - [ ] Actualiser `README.md`
- [ ] Préparer le déploiement
  - [ ] Mettre à jour `CHANGELOG.md`
  - [ ] Tag et release : `git tag vX.Y.0-figma-presenter`

---
### Suivi visuel d'avancement

#### Phase 1: Design Tokens (✅ Terminé 20/05/2025)
- [x] Tokens – Couleurs (16/05/2025)
- [x] Tokens – Typographie (16/05/2025)
- [x] Tokens – Spacing (16/05/2025)
- [x] Tokens – Ombres (16/05/2025)
- [x] Icônes SVG (18/05/2025)
- [x] Polices TTF (18/05/2025)
- [x] Normaliser les unités typographiques (20/05/2025)

#### Phase 2: Configuration Thème (✅ Terminé 18/05/2025)
- [x] Hook useTheme() (18/05/2025)
- [x] ThemeProvider Custom (18/05/2025)
- [x] Chargement des polices (18/05/2025)
- [x] Utils – applyStyles (18/05/2025)

#### Phase 3: Fondations (✅ Terminé 18/05/2025)
- [x] Création de la nouvelle structure (18/05/2025)
- [x] Composants Atoms - Box, Text, Button, Icon (18/05/2025)
- [x] Composants Atoms - Input, Divider, Badge (18/05/2025)
- [x] Plan de migration (18/05/2025)

#### Phase 4: Composants complexes (🟡 En cours)
- [x] Analyse des composants Figma (Molecules & Organisms) (18/05/2025)
- [x] Molecules - Navbar (node-id=1644-48374) (19/05/2025)
- [x] Molecules - Menu Bar (node-id=3404-17376) (19/05/2025)
- [x] Molecules - Bottom Bar Button Action (node-id=1644-48346) (19/05/2025)
- [x] Molecules - SearchForm (node-id=3404-17378) (19/05/2025)
- [x] Molecules - CategoryMenu (node-id=3167-91902) (19/05/2025)
- [x] Molecules - AutoLayout (node-id=3404-17380) (19/05/2025)
- [x] Molecules - PagingHorizontalTab (node-id=42454-57940) (19/05/2025)
- [x] Molecules - WaterTracker
  - [x] HistoryEmpty (node-id=48500-33216) (19/05/2025)
  - [x] CustomizeCupSize (node-id=48500-33110) (19/05/2025)
  - [x] WaterIntake (node-id=48500-35710) (19/05/2025)
  - [x] HistoryList (node-id=48501-24041) (19/05/2025)
  - [x] DrinkTypeSelector (node-id=48500-33104) (19/05/2025)
- [x] Molecules - MealCard (node-id=48465-14326) (30/05/2025)
- [x] Molecules - MealListItem (node-id=48500-29904) (30/05/2025)
  - [x] Molecules - NutritionCard (03/06/2025)
  - [x] Organisms – TabBar (03/06/2025)
  - [x] Templates – MainLayout (03/06/2025)

#### Phase 5: Presenters (🟡 En cours)
- [x] Presenter - MealsNew (30/05/2025)
- [ ] Presenter – Home
- [x] Presenter – MealDetail avec affichage d'images d'ingrédients (03/06/2025)

#### Phase 6: Tests et qualité
- [x] Tests unitaires - Nutrition core (06/06/2025)
- [ ] Tests E2E
- [ ] Optimisation performances

---
**Important :**
- Respecter l'isolation des couches MCP : le Presenter _ne doit pas_ contenir de logique métier ou de persistance.
- Maintenir la cohérence des calculs nutritionnels via `nutrition-core.service.ts` – ne pas dupliquer la logique dans l'UI.
- Standardiser l'approche de style sans bibliothèque tierce : utiliser une composition cohérente de styles (StyleSheet.create ou direct) et éviter le style inline ad hoc.
- Les composants de repas (MealCard, MealListItem, NutritionCard) sont maintenant intégrés avec succès dans l'UI.

---
**Important :**
- Respecter l'isolation des couches MCP : le Presenter _ne doit pas_ contenir de logique métier ou de persistance.
- Maintenir la cohérence des calculs nutritionnels via `nutrition-core.service.ts` – ne pas dupliquer la logique dans l'UI.
- Standardiser l'approche de style sans bibliothèque tierce : utiliser une composition cohérente de styles (StyleSheet.create ou direct) et éviter le style inline ad hoc.
