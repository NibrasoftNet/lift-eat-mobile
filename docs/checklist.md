# Analyse des Calculs Nutritionnels

## 1. Calcul des Macros pour les Ingrédients

### Logique Actuelle
- Les valeurs nutritionnelles sont stockées pour 100g dans la table `ingredients_standard`
- Lors de l'ajout d'un ingrédient, les macros sont calculés proportionnellement à la quantité :
  ```typescript
  calories = (quantité / quantité_standard) * calories_standard
  carbs = (quantité / quantité_standard) * carbs_standard
  fat = (quantité / quantité_standard) * fat_standard
  protein = (quantité / quantité_standard) * protein_standard
  ```

### Points d'Attention
- ✅ Les valeurs sont arrondies avec Math.round()
- ⚠️ Vérifier que quantité_standard n'est jamais 0 pour éviter une division par zéro
- ⚠️ S'assurer que les unités sont cohérentes (tout en grammes)

## 2. Calcul des Macros pour un Repas

### Logique Actuelle
1. Calcul du total brut des ingrédients :
   ```typescript
   totalCalories = somme(calories_ingrédients)
   totalCarbs = somme(carbs_ingrédients)
   totalFat = somme(fat_ingrédients)
   totalProtein = somme(protein_ingrédients)
   ```

2. Ajustement selon le poids final du repas :
   ```typescript
   facteur = poids_total_ingredients / poids_final_repas
   macros_ajustées = macros_brutes / facteur
   ```

### Points d'Attention
- ✅ Les valeurs sont arrondies après l'ajustement
- ⚠️ Vérifier que poids_final_repas n'est jamais 0
- ⚠️ Vérifier la cohérence du facteur d'ajustement
- ⚠️ Ajouter des validations pour les valeurs négatives

## 3. Calcul des Macros pour un Plan Journalier

### Logique Actuelle
- Simple addition des macros de chaque repas :
  ```typescript
  calories = somme(calories_repas)
  carbs = somme(carbs_repas)
  fat = somme(fat_repas)
  protein = somme(protein_repas)
  ```

### Points d'Attention
- ✅ Initialisation à 0 si pas de repas
- ⚠️ Pas de validation des valeurs maximales
- ⚠️ Pas de vérification de cohérence (ex: somme des % = 100)

## 4. Recommandations d'Amélioration

### Validations à Ajouter
1. Vérifier que les quantités sont toujours positives
2. Ajouter des limites maximales raisonnables
3. Valider que la somme des pourcentages = 100%
4. Vérifier la cohérence des unités

### Optimisations Possibles
1. Mettre en cache les calculs fréquents
2. Utiliser des nombres décimaux pour les calculs intermédiaires
3. N'arrondir qu'à l'affichage final
4. Ajouter des tests unitaires pour les cas limites

### Améliorations UX
1. Afficher des avertissements si les valeurs semblent anormales
2. Montrer le détail des calculs à la demande
3. Permettre d'ajuster manuellement les valeurs calculées
4. Ajouter des tooltips explicatifs sur les facteurs d'ajustement
