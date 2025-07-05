# Checklist de refactorisation des modules IA

## Liste des tâches par priorité

### Phase 1: Correction de la logique métier

- [x] Modifier `handleCreateMeal` pour insérer les entrées dans `mealIngredients`
- [x] Ajouter une fonction d'association d'ingrédients existants
- [x] Assurer que les quantités d'ingrédients sont correctement traitées
- [x] Implémenter la vérification de l'existence des ingrédients avant l'association
- [x] Implémenter le système de suggestion d'ingrédients manquants (backend)
  - [x] Détecter et retourner les ingrédients manquants via l'API
  - [x] Implémenter l'interface utilisateur pour la gestion des ingrédients manquants
    - [x] Créer un composant `MissingIngredientsModal` pour afficher les ingrédients manquants
    - [x] Implémenter le state management pour gérer les ingrédients manquants dans `MealGeneratorForm`
    - [x] Ajouter la logique d'affichage conditionnel du modal après génération de repas
    - [x] Styliser le modal selon les standards de design de l'application
  - [x] Implémenter la création rapide d'ingrédients
    - [x] Créer le formulaire d'ajout rapide d'ingrédient dans le modal
    - [x] Développer la méthode `createIngredient` dans `IngredientService`
    - [x] Ajouter la validation des données pour les nouveaux ingrédients
    - [x] Implémenter la logique de mise à jour de l'UI après création
  - [x] Développer le système de persistance de suggestions
    - [x] Créer une table `ingredientSuggestions` dans la base de données
    - [x] Implémenter les méthodes CRUD pour les suggestions dans le serveur MCP
    - [x] Ajouter un service côté client pour gérer les suggestions persistantes
    - [x] Intégrer la récupération des suggestions dans le processus de génération de repas
- [x] Standardiser le schéma des données IA avec celui de la base de données
- [x] Créer des fonctions de transformation de données cohérentes
  - [x] Implémenter transformIaIngredientToDbFormat et transformDbIngredientToIaFormat
  - [x] Implémenter transformIaMealToDbFormat et transformDbMealToIaFormat
  - [x] Implémenter transformIaIngredientsToMealIngredientsFormat
- [x] Normaliser les valeurs numériques (calories, macros) avec le même format
  - [x] Implémenter calculateMealNutritionFromIngredients avec arrondis à 1 décimale
  - [x] Standardiser le traitement des valeurs zéro ou nulles dans les transformateurs
- [x] Assurer la cohérence des énumérations (types de repas, types de cuisine)
  - [x] Vérifier que toutes les énumérations sont importées depuis le fichier central
  - [x] Documenter les fonctions de normalisation et leur utilisation
  - [x] Créer une documentation des énumérations pour faciliter la maintenance
- [x] Renforcer la validation des réponses de l'IA
  - [x] Créer un module dédié `responseValidation.ts` avec des validations renforcées
  - [x] Implémenter des mécanismes de récupération pour les données invalides
  - [x] Ajouter une extraction avancée de JSON dans les réponses textuelles
  - [x] Intégrer les validations renforcées dans le parser de réponses IA
- [x] Améliorer la gestion des erreurs et cas limites
  - [x] Créer un système centralisé de gestion d'erreurs avec `errorHandler.ts`
  - [x] Implémenter une classification des erreurs avec `IaErrorType`
  - [x] Ajouter un mécanisme uniforme de journalisation des erreurs
  - [x] Créer un service IA robuste avec gestion automatique des cas limites
- [x] Implémenter un système de retries plus robuste
  - [x] Créer un utilitaire de retry avec backoff exponentiel dans `retryUtils.ts`
  - [x] Ajouter une détection intelligente des erreurs récupérables
  - [x] Implémenter un système de jitter pour éviter les tempêtes de requêtes
  - [x] Intégrer les mécanismes de retry dans le service IA principal
- [x] Ajouter des logs plus détaillés pour le debugging
  - [x] Créer un système de journalisation contextuel avec `loggingEnhancer.ts`
  - [x] Implémenter différents niveaux de détail (MINIMAL, NORMAL, VERBOSE, DEBUG)
  - [x] Ajouter des métriques de performance pour mesurer les durées d'opération
  - [x] Intégrer des fonctionnalités de masquage des données sensibles
- [x] Créer un mécanisme de fallback pour les réponses incorrectes
  - [x] Implémenter un gestionnaire de fallback centralisé avec `fallbackHandler.ts`
  - [x] Créer des générateurs de repas, ingrédients et plans par défaut
  - [x] Adapter les réponses textuelles en fonction du contexte de la requête
  - [x] Intégrer la journalisation détaillée des fallbacks générés

### Phase 2: Refactorisation de l'architecture

- [x] Créer des hooks personnalisés pour la logique métier d'IA
  - [x] Implémenter `useMealGeneration` pour encapsuler la génération de repas
  - [x] Implémenter `usePlanGeneration` pour encapsuler la génération de plans nutritionnels
  - [x] Implémenter `useMissingIngredients` pour la gestion des ingrédients manquants
- [x] Créer une couche d'abstraction pour les interactions avec Gemini
  - [x] Définir une interface commune pour les providers IA (IaProvider)
  - [x] Implémenter un provider Gemini (GeminiProvider)
  - [x] Créer une factory pour les providers IA (IaProviderFactory)
  - [x] Adapter iaService pour utiliser l'abstraction
- [x] Séparer les appels API dans des services dédiés
- [x] Séparer l'état UI de l'état du formulaire
  - [x] Extraire la logique d'état UI (loading, errors, etc.) dans des hooks spécifiques
  - [x] Isoler l'état du formulaire avec useForm (react-hook-form)
  - [x] Créer des contextes dédiés pour le partage d'état si nécessaire
  - [x] Implémenter des adaptateurs entre l'état du formulaire et les API services
  - [x] Mettre en place un modèle de flux de données unidirectionnel
- [x] Créer des composants dédiés pour les différentes sections du formulaire
  - [x] Extraire MealGeneratorBasicForm pour les informations de base du repas
  - [x] Créer IngredientsSelector pour la gestion des ingrédients
  - [x] Développer MealNutritionDisplay pour l'affichage des valeurs nutritionnelles
  - [x] Implémenter MealGenerationResult pour afficher le résultat de la génération
  - [x] Créer PlanConfigurationForm pour les paramètres du plan nutritionnel
- [x] Implémenter `useForm` avec validation Zod
  - [x] Définir le schéma Zod pour la validation du formulaire de génération de repas
  - [x] Définir le schéma Zod pour la validation du formulaire de génération de plan
  - [x] Intégrer useForm avec les schémas de validation dans les composants
  - [x] Mettre en place les transformateurs pour convertir les données du formulaire en format API
  - [x] Implémenter la validation des champs en temps réel
- [x] Créer un schéma Zod approprié pour les formulaires IA si nécessaire
- [x] Utiliser `Controller` pour les champs de formulaire
- [x] Ajouter la gestion des erreurs de validation
  - [x] Créer des composants d'affichage d'erreurs réutilisables
  - [x] Implémenter la logique d'affichage des erreurs de validation
  - [x] Ajouter des messages d'erreur personnalisés pour chaque type d'erreur
  - [x] Gérer les erreurs au niveau des champs et au niveau du formulaire
- [x] Standardiser le flux de soumission du formulaire
  - [x] Implémenter un pattern cohérent pour la soumission des formulaires
  - [x] Créer des hooks de soumission réutilisables
  - [x] Gérer les états de chargement et d'erreur pendant la soumission
  - [x] Implémenter la logique de redirection après soumission réussie
  - [x] Ajouter des feedbacks visuels pour les différents états de soumission

### Phase 3: Harmonisation du style et du thème

- [x] Remplacer `ThemedView` par `Box`
- [x] Remplacer `TextInput` par `Input` et `InputField`
- [x] Remplacer `TouchableOpacity` par `Pressable`
- [x] Remplacer `View` par `Box`
- [x] Remplacer `ThemedText` par `Text`
- [x] Remplacer `Modal` par `ActionSheet` ou le composant modal personnalisé de l'application
- [x] Utiliser `VStack` et `HStack` au lieu de Flexbox direct
- [x] Remplacer `StyleSheet.create` par l'approche de style de l'application

#### 3.1 Composants refactorisés

- [x] Plan-generator/PlanConfigurationForm.tsx
- [x] Plan-generator/PlanGeneratorForm.tsx
- [x] Plan-generator/PlanGenerationResult.tsx
- [x] MissingIngredientsModal.tsx
- [x] PlanPreview.tsx
- [x] meal-generator/IngredientsSelector.tsx
- [x] meal-generator/MealGenerationResult.tsx
- [x] MealPreview.tsx
- [x] meal-generator/MealGeneratorBasicForm.tsx

#### 3.2 Composants restants à refactoriser

- [ ] meal-generator/MealGeneratorForm.tsx
- [ ] meal-generator/SpecificRequirements.tsx

### Phase 4: Tests et optimisation

- [ ] Tester tous les scénarios
- [ ] Optimiser les performances
- [x] Documenter l'architecture refactorisée

## Actions à entreprendre

### 1. Refactorisation de l'architecture

#### 1.1 Composants UI

- [x] Remplacer `View` par `Box`
- [x] Remplacer `TextInput` par `Input` et `InputField`
- [x] Remplacer `TouchableOpacity` par `Pressable`
- [x] Remplacer `ThemedView` par `Box`
- [x] Remplacer `ThemedText` par `Text`
- [x] Remplacer `Modal` par `ActionSheet` ou le composant modal personnalisé de l'application
- [x] Utiliser `VStack` et `HStack` au lieu de Flexbox direct

#### 1.2 Gestion de formulaire

- [x] Implémenter `useForm` avec validation Zod
  - [x] Définir le schéma Zod pour la validation du formulaire de génération de repas
  - [x] Définir le schéma Zod pour la validation du formulaire de génération de plan
  - [x] Intégrer useForm avec les schémas de validation dans les composants
  - [x] Mettre en place les transformateurs pour convertir les données du formulaire en format API
  - [x] Implémenter la validation des champs en temps réel
- [x] Créer un schéma Zod approprié pour les formulaires IA si nécessaire
- [x] Utiliser `Controller` pour les champs de formulaire
- [x] Ajouter la gestion des erreurs de validation
  - [x] Créer des composants d'affichage d'erreurs réutilisables
  - [x] Implémenter la logique d'affichage des erreurs de validation
  - [x] Ajouter des messages d'erreur personnalisés pour chaque type d'erreur
  - [x] Gérer les erreurs au niveau des champs et au niveau du formulaire
- [x] Standardiser le flux de soumission du formulaire
  - [x] Implémenter un pattern cohérent pour la soumission des formulaires
  - [x] Créer des hooks de soumission réutilisables
  - [x] Gérer les états de chargement et d'erreur pendant la soumission
  - [x] Implémenter la logique de redirection après soumission réussie
  - [x] Ajouter des feedbacks visuels pour les différents états de soumission

#### 1.3 Séparation des responsabilités

- [x] Créer des hooks personnalisés pour la logique métier d'IA
- [x] Séparer les appels API dans des services dédiés
- [x] Créer une couche d'abstraction pour les interactions avec Gemini
- [x] Séparer l'état UI de l'état du formulaire
  - [x] Extraire la logique d'état UI (loading, errors, etc.) dans des hooks spécifiques
  - [x] Isoler l'état du formulaire avec useForm (react-hook-form)
  - [x] Créer des contextes dédiés pour le partage d'état si nécessaire
  - [x] Implémenter des adaptateurs entre l'état du formulaire et les API services
  - [x] Mettre en place un modèle de flux de données unidirectionnel
- [x] Créer des composants dédiés pour les différentes sections du formulaire
  - [x] Extraire MealGeneratorBasicForm pour les informations de base du repas
  - [x] Créer IngredientsSelector pour la gestion des ingrédients
  - [x] Développer MealNutritionDisplay pour l'affichage des valeurs nutritionnelles
  - [x] Implémenter MealGenerationResult pour afficher le résultat de la génération
  - [x] Créer PlanConfigurationForm pour les paramètres du plan nutritionnel

### 2. Correction des problèmes de style et thème

#### 2.1 Harmonisation des styles

- [x] Remplacer `StyleSheet.create` par l'approche de style de l'application
- [x] Supprimer les couleurs codées en dur et utiliser les variables de thème
- [x] Standardiser les espacements et la typographie
- [ ] Aligner les styles sur les directives de conception de l'application
- [ ] Utiliser les tokens de style cohérents avec le reste de l'application

#### 2.2 Composants UI cohérents

- [x] Standardiser les sélecteurs (utiliser `Select` au lieu de modals personnalisés)
- [x] Utiliser les composants `FormControl` pour la gestion des champs
- [x] Standardiser l'affichage des erreurs
- [x] Unifier l'apparence des boutons et actions
- [x] Harmoniser les animations et transitions

### 3. Correction des problèmes de logique métier

#### 3.1 Association des ingrédients avec les repas

- [x] Modifier `handleCreateMeal` pour insérer les entrées dans `mealIngredients`
- [x] Ajouter une fonction d'association d'ingrédients existants
- [x] Assurer que les quantités d'ingrédients sont correctement traitées
- [x] Implémenter la vérification de l'existence des ingrédients avant l'association

#### 3.2 Alignement des schémas de données

- [x] Standardiser le schéma des données IA avec celui de la base de données
- [x] Créer des fonctions de transformation de données cohérentes
- [x] Normaliser les valeurs numériques (calories, macros) avec le même format
- [x] Assurer la cohérence des énumérations (types de repas, types de cuisine)

#### 3.3 Amélioration du traitement des réponses IA

- [x] Renforcer la validation des réponses de l'IA
  - [x] Créer un module dédié `responseValidation.ts` avec des validations renforcées
  - [x] Implémenter des mécanismes de récupération pour les données invalides
  - [x] Ajouter une extraction avancée de JSON dans les réponses textuelles
  - [x] Intégrer les validations renforcées dans le parser de réponses IA
- [x] Améliorer la gestion des erreurs et cas limites
  - [x] Créer un système centralisé de gestion d'erreurs avec `errorHandler.ts`
  - [x] Implémenter une classification des erreurs avec `IaErrorType`
  - [x] Ajouter un mécanisme uniforme de journalisation des erreurs
  - [x] Créer un service IA robuste avec gestion automatique des cas limites
- [x] Implémenter un système de retries plus robuste
  - [x] Créer un utilitaire de retry avec backoff exponentiel dans `retryUtils.ts`
  - [x] Ajouter une détection intelligente des erreurs récupérables
  - [x] Implémenter un système de jitter pour éviter les tempêtes de requêtes
  - [x] Intégrer les mécanismes de retry dans le service IA principal
- [x] Ajouter des logs plus détaillés pour le debugging
  - [x] Créer un système de journalisation contextuel avec `loggingEnhancer.ts`
  - [x] Implémenter différents niveaux de détail (MINIMAL, NORMAL, VERBOSE, DEBUG)
  - [x] Ajouter des métriques de performance pour mesurer les durées d'opération
  - [x] Intégrer des fonctionnalités de masquage des données sensibles
- [x] Créer un mécanisme de fallback pour les réponses incorrectes
  - [x] Implémenter un gestionnaire de fallback centralisé avec `fallbackHandler.ts`
  - [x] Créer des générateurs de repas, ingrédients et plans par défaut
  - [x] Adapter les réponses textuelles en fonction du contexte de la requête
  - [x] Intégrer la journalisation détaillée des fallbacks générés

### Phase 3: Harmonisation du style et du thème

- [x] Remplacer `ThemedView` par `Box`
- [x] Remplacer `TextInput` par `Input` et `InputField`
- [x] Remplacer `TouchableOpacity` par `Pressable`
- [x] Remplacer `View` par `Box`
- [x] Remplacer `ThemedText` par `Text`
- [x] Remplacer `Modal` par `ActionSheet` ou le composant modal personnalisé de l'application
- [x] Utiliser `VStack` et `HStack` au lieu de Flexbox direct
- [x] Remplacer `StyleSheet.create` par l'approche de style de l'application

#### 3.1 Composants refactorisés

- [x] Plan-generator/PlanConfigurationForm.tsx
- [x] Plan-generator/PlanGeneratorForm.tsx
- [x] Plan-generator/PlanGenerationResult.tsx
- [x] MissingIngredientsModal.tsx
- [x] PlanPreview.tsx
- [x] meal-generator/IngredientsSelector.tsx
- [x] meal-generator/MealGenerationResult.tsx
- [x] MealPreview.tsx
- [x] meal-generator/MealGeneratorBasicForm.tsx

#### 3.2 Composants restants à refactoriser

- [ ] meal-generator/MealGeneratorForm.tsx
- [ ] meal-generator/SpecificRequirements.tsx

### Phase 4: Tests et optimisation

- [ ] Tester tous les scénarios
- [ ] Optimiser les performances
- [x] Documenter l'architecture refactorisée
