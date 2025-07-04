# Analyse de la page de détail des repas

## Objectif
Ce document analyse l'écran de détail des repas actuel et propose une implémentation avec le nouveau thème en suivant l'architecture MCP (Model-Controller-Presenter) de l'application Lift.

## Structure actuelle
La page actuelle (`meals/my-meals/details/[id].tsx`) est organisée comme suit:

1. **Interfaces et types**:
   - `MealIngredientDetailProps`: Interface pour les ingrédients
   - `IngredientWithStandardOrmProps`: Interface pour les ingrédients avec leurs standards
   - `MealDetailData`: Interface pour les données complètes de la page

2. **Composants principaux**:
   - `MealDetailsComponent`: Affiche les détails du repas (UI)
   - `MealDetailsPage`: Composant de page
   - `MealDetailsScreen`: Composant principal exporté qui gère la logique et les données

3. **Fonctionnalités clés**:
   - Affichage des détails du repas (nom, calories, type, etc.)
   - Affichage des ingrédients dans un accordéon
   - Calcul des macronutriments (protéines, lipides, glucides)
   - Navigation vers l'édition du repas
   - Suppression du repas avec confirmation

4. **Services utilisés**:
   - `mealPagesService`: Service de la couche Presenter pour la gestion des repas
   - `useQuery/useMutation`: Pour la gestion de l'état et des requêtes
   - `invalidateCache`: Pour invalider le cache après les modifications

## Composants UI actuels vs nouveaux composants

| Composant actuel | Nouveau composant | Description |
|------------------|-------------------|-------------|
| `VStack` | `View` (avec styles) | Conteneur vertical |
| `HStack` | `View` (avec styles flexDirection: 'row') | Conteneur horizontal |
| `Box` | `View` | Conteneur simple |
| `Card` | `components-new/ui/molecules/cards/Card` | Carte avec bordure et ombre |
| `Text` | `components-new/ui/atoms/base/Text` | Texte avec variantes |
| `Avatar` | `components-new/ui/atoms/Avatar` | Affichage d'image de profil |
| `Icon` | Icônes SVG directes | Icônes du système |
| `Divider` | `components-new/ui/atoms/Divider` | Séparateur visuel |
| `FlashList/FlatList` | `components-new/ui/molecules/lists/FlashList` | Liste performante pour les ingrédients |
| `Accordion` | `components-new/ui/molecules/Accordion` | Accordéon pour les listes extensibles |
| `Button` | `components-new/ui/atoms/Button` | Bouton d'action |
| `MacrosInfoCard` | `components-new/ui/molecules/tracking/CircularNutritionProgress` | Visualisation circulaire des macronutriments |
| `DeletionModal` | `components-new/ui/molecules/modals/ConfirmationModal` | Modal de confirmation |

## Icônes à utiliser (selon convention du projet)

Selon la convention du projet, les icônes doivent être importées directement:

```typescript
import { ArrowLeftRegularBoldIcon } from '../../../assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
```

Les icônes requises pour la page détail:
- `ArrowLeftRegularBoldIcon`: Pour le bouton de retour
- `EditRegularBoldIcon`: Pour le bouton d'édition
- `DeleteRegularBoldIcon`: Pour le bouton de suppression
- `UtensilsCrossedRegularBoldIcon`: Pour le type de repas
- `WeightRegularBoldIcon`: Pour le poids
- `ClockRegularBoldIcon`: Pour le temps de préparation
- `InfoRegularBoldIcon`: Pour les instructions

## Services et API à utiliser

Conformément à l'architecture MCP, nous utiliserons:

1. **Model**:
   - `MealOrmProps` et `IngredientOrmProps` du schéma de la base de données

2. **Controller (Core Services)**:
   - `nutrition-core.service.ts` pour la logique des calculs nutritionnels

3. **Presenter (Page Services)**:
   - `meal-pages.service.ts` pour orchestrer les opérations pour l'UI

## Implémentation proposée

### 1. Structure de fichier

```typescript
/**
 * Écran de détail d'un repas - Version améliorée
 * Conforme au design Figma
 * Architecture MCP: Couche Presenter
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Text } from '@/components-new/ui/atoms/base';
import { Card } from '@/components-new/ui/molecules/cards/Card';
import { Divider } from '@/components-new/ui/atoms/Divider';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
import { EditRegularBoldIcon } from '@/assets/icons/figma/regular-bold/EditRegularBoldIcon';
import { DeleteRegularBoldIcon } from '@/assets/icons/figma/regular-bold/DeleteRegularBoldIcon';
import { UtensilsCrossedRegularBoldIcon } from '@/assets/icons/figma/regular-bold/UtensilsCrossedRegularBoldIcon';
import { WeightRegularBoldIcon } from '@/assets/icons/figma/regular-bold/WeightRegularBoldIcon';
import { ClockRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ClockRegularBoldIcon';
import { InfoRegularBoldIcon } from '@/assets/icons/figma/regular-bold/InfoRegularBoldIcon';

// Services et helpers
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

// Interfaces et types (reprendre les mêmes que dans le fichier original)
// ...

```

### 2. Composants principaux à développer

#### CircularNutritionProgress
Visualisation des macronutriments sous forme de cercle segmenté avec affichage des calories, protéines, glucides et lipides.

#### IngredientsList
Affiche la liste des ingrédients du repas avec leurs quantités, optimisée avec FlashList.

#### MealDetailHeader
En-tête de la page avec l'image du repas, le nom, et les actions (éditer, supprimer).

### 3. Logique et fonctionnalités

1. **Chargement des données**:
   ```typescript
   const { id } = useLocalSearchParams();
   const mealId = Array.isArray(id) ? id[0] : id;
   
   const { data, isLoading, error } = useQuery({
     queryKey: [DataType.MEAL, mealId],
     queryFn: () => mealPagesService.getMealDetails(Number(mealId)),
   });
   ```

2. **Suppression d'un repas**:
   ```typescript
   const queryClient = useQueryClient();
   const { mutate: deleteMeal } = useMutation({
     mutationFn: () => mealPagesService.deleteMeal(Number(mealId)),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: [DataType.MEALS_LIST] });
       router.back();
     },
   });
   ```

3. **Gestion des erreurs**:
   ```typescript
   if (error) {
     return (
       <View style={styles.errorContainer}>
         <Text variant="body">Une erreur est survenue lors du chargement des détails</Text>
         <TouchableOpacity onPress={() => router.back()}>
           <Text variant="button">Retour</Text>
         </TouchableOpacity>
       </View>
     );
   }
   ```

## Maquette de l'interface

La nouvelle interface devrait s'organiser comme suit:

1. **En-tête**
   - Image du repas (grande taille)
   - Nom du repas (grand titre)
   - Calories (sous-titre)
   - Boutons d'action (Retour, Éditer, Supprimer)

2. **Informations nutritionnelles**
   - Carte avec macronutriments
   - Représentation visuelle (barres ou cercles)

3. **Informations générales**
   - Type de repas
   - Poids
   - Temps de préparation

4. **Ingrédients**
   - Liste des ingrédients avec quantités
   - Option pour voir les détails de chaque ingrédient

5. **Instructions**
   - Description/instructions du repas

## Recommandations pour l'implémentation

1. **Utiliser FlashList** pour les listes d'ingrédients si leur nombre est important.
2. **Suivre les styles du thème** en utilisant `useAppTheme()` pour les couleurs et styles.
3. **Implémenter la gestion d'erreurs** robuste pour chaque requête.
4. **Utiliser les icônes SVG** selon la convention du projet.
5. **Respecter l'architecture MCP** en séparant clairement les responsabilités.

## Styles globaux suggérés

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: 200,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 10,
  },
  titleContainer: {
    padding: 16,
  },
  mealTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
    color: '#757575',
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#757575',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
```

## Checklist de création de l'écran de détail des repas

### 1. Structure et interfaces (prérequis)

- [ ] Créer les interfaces et types nécessaires
  - [ ] Interface `MealDetailData` pour les données complètes du repas
  - [ ] Interface `IngredientWithStandardOrmProps` pour les ingrédients avec références
  - [ ] Types pour les valeurs nutritionnelles (calories, protéines, lipides, glucides)

### 2. Composants à développer

- [x] **MealDetailHeader** (`components-new/ui/organisms/meal/MealDetailHeader.tsx`)
  - [x] Image du repas avec gradient (utiliser `StyleSheet`)
  - [x] Bouton de retour avec `ArrowLeftRegularBoldIcon` (SVG import direct)
  - [x] Boutons d'action (Modifier avec `EditRegularBoldIcon`, Supprimer avec `DeleteRegularBoldIcon`)
  - [x] Titre du repas et affichage des calories

- [x] **CircularNutritionProgress** (`components-new/ui/molecules/tracking/CircularNutritionProgress.tsx`)
  - [x] Cercle segmenté pour visualiser les macronutriments (remplace `MacrosInfoCard`)
  - [x] Affichage des calories au centre du cercle
  - [x] Légende pour protéines, lipides, glucides avec code couleur
  - [x] Version détaillée avec grammes et pourcentages

- [x] **GeneralInfoSection** (`components-new/ui/molecules/info/GeneralInfoSection.tsx`)
  - [x] Type de repas (utilisant `ChartRegularBoldIcon` comme alternative à `UtensilsCrossedRegularBoldIcon`)
  - [x] Poids (utilisant `InfoCircleRegularBoldIcon` comme alternative à `WeightRegularBoldIcon`)
  - [x] Temps de préparation (utilisant `TimeCircleRegularBoldIcon` comme alternative à `ClockRegularBoldIcon`)
  - [x] Mise en page avec alignement cohérent des icônes

- [x] **IngredientsList** (`components-new/ui/organisms/meal/IngredientsList.tsx`)
  - [x] Liste des ingrédients avec quantités et unités
  - [x] Affichage des images d'ingrédients avec gestion des images par défaut
  - [x] Style épuré avec fond blanc et séparateurs fins (#EEEEEE)
  - [x] Optimisation avec `FlatList` pour les performances 
  - [x] Gestion des ingrédients standards et personnalisés
  - [x] Option pour supprimer les ingrédients avec swipe et confirmation

- [x] **InstructionsSection** (`components-new/ui/molecules/meal/InstructionsSection.tsx`)
  - [x] Affichage des instructions de préparation dans un style épuré
  - [x] Style cohérent avec fond blanc et séparateurs fins (#EEEEEE)
  - [x] Espacement et typographie optimisés pour la lisibilité
  - [x] Icône SVG conforme aux conventions pour le titre de section
  - [x] Gestion de l'absence d'instructions avec message approprié

### 3. Intégration MCP

L'intégration avec l'architecture MCP de l'application est déjà bien avancée, comme en témoigne l'affichage correct des images et des valeurs nutritionnelles :

- [x] **Services Model (Couche M)**
  - [x] Utiliser les interfaces de base `MealOrmProps` et `IngredientOrmProps` définies dans `db/schema.ts`
  - [x] Intégrer les interfaces structurées dans `utils/mcp/interfaces` pour garantir la cohérence des données
  - [x] Assurer la liaison avec les handlers MCP appropriés dans `utils/mcp/handlers` pour l'interaction avec la base de données
  - [x] Gérer correctement les transformations d'interfaces entre la base de données et l'affichage

- [x] **Services Controller (Couche C)**
  - [x] Intégrer `nutrition-core.service.ts` pour tous les calculs de macronutriments et de calories
  - [x] Utiliser `nutritionEngine.ts` comme façade simplifiée pour accéder aux services nutritionnels
  - [x] Adapter les calculs pour prendre en compte les quantités des ingrédients et leur valeur nutritionnelle
  - [x] Vérifier que les calculs restent cohérents avec les données affichées dans les composants visuels

- [x] **Services Presenter (Couche P)**
  - [x] Étendre `meal-pages.service.ts` pour orchestrer la présentation des données dans l'UI
  - [x] Implémenter les hooks `useQuery` pour récupérer les données des repas et ingrédients
  - [x] Mettre en place les `useMutation` pour la suppression de repas
  - [x] Gérer l'invalidation du cache après les mutations pour garantir des données fraiches

### 4. Fonctionnalités

- [x] **Chargement des données**
  - [x] Récupération des paramètres avec `useLocalSearchParams`
  - [x] Conversion et validation de l'ID du repas
  - [x] Requête avec `useQuery` et gestion des états (loading, error, success)

- [x] **Édition et suppression**
  - [x] Implémenter la mutation pour la suppression avec `useMutation`
  - [x] Ajouter une modal de confirmation avant suppression
  - [x] Gérer l'invalidation du cache après suppression
  - [x] Navigation vers l'écran d'édition avec passage de paramètres

### 5. Expérience utilisateur

- [x] **Gestion des états**
  - [x] Écran de chargement pendant la récupération des données
  - [x] Gestion des erreurs avec messages explicites
  - [x] État vide si aucune donnée n'est disponible

- [ ] **Optimisations**
  - [ ] Animations de transition pour améliorer l'expérience
  - [x] Feedback visuel lors des actions (suppression, navigation)
  - [ ] Mémoisation des calculs nutritionnels avec useMemo
  - [x] Performance optimisée avec FlatList pour les listes

## Conclusion

Cette checklist fournit une base complète pour implémenter la nouvelle page de détail des repas avec le nouveau thème. Elle respecte l'architecture MCP du projet, utilise les conventions d'icônes et s'appuie sur les nouveaux composants UI, avec une attention particulière à l'affichage circulaire des macronutriments.
