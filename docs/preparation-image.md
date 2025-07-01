# Checklist – Préparation des images d'ingrédients (approche **require → Base64**)

> Suivez chaque étape pour garantir que les images d’ingrédients soient correctement empaquetées, converties en Base64 et affichées sans erreur "Invalid call" de Metro.

## 1. Organisation des fichiers

- [x] Créer (ou vérifier l’existence de) `lift/assets/images/ingredients/`
- [x] Nommer les fichiers de façon claire (ex. `tomato.jpg`, `olive_oil.png`)
- [x] Éviter les espaces et caractères spéciaux dans les noms de fichier (utiliser _ ou -)

## 2. Mapping statique des images

- [x] Créer (ou mettre à jour) `db/ingredientImages.ts`
- [x] Y définir (un début de mapping est présent; à compléter si besoin) :
  ```ts
  // db/ingredientImages.ts
  export const ingredientImages: Record<string, number> = {
    '../assets/images/seed/Céréales-et-Pâtes/Amidon_de_Maïs.jpg': require('../assets/images/seed/Céréales-et-Pâtes/Amidon_de_Maïs.jpg'),
    '../assets/images/seed/Volailles/Foie_de_Volaille_Cru.jpg': require('../assets/images/seed/Volailles/Foie_de_Volaille_Cru.jpg'),
    // … compléter (une entrée par image)
  };
  ```
- [x] Committer le fichier pour qu’il soit détecté par Metro (fait)

## 3. Mise à jour des seeds

- [x] Dans chaque fichier seed (`db/*.ts`), la valeur `image` correspond déjà à la clé du mapping (validé via script) :
  ```ts
  // Exemple dans un seed
  image: '../assets/images/seed/Céréales-et-Pâtes/Amidon_de_Maïs.jpg', // clé présente dans ingredientImages
  ```
- [x] Vérifier qu’aucun chemin relatif ne subsiste hors du mapping (fait via script `generate:ingredient-images`)

## 4. Conversion Base64 dans `addDummyData.ts`

- [x] Importer le mapping :
  ```ts
  import { ingredientImages } from '@/db/ingredientImages';
  ```
- [x] Dans `prepareIngredientStandardWithImages()` :
  1. Supprimer le bloc `require(ingStandard.image)`
  2. Ajouter :
     ```ts
     const assetId = ingredientImages[ingStandard.image as string];
     if (assetId) {
       buffer = await getImageBuffer(assetId);
     }
     ```
- [x] Conserver le fallback `getImageBuffer(ingStandard.image)` si l’on veut encore accepter des URI distantes (mais attention à ne pas utiliser `require(variable)`)

## 5. Nettoyage du code

- [x] Supprimer toute utilisation restante de `require(variable)` (hors mapping) – dynamic requires supprimés des seeds & addDummyData
- [x] Lancer `npx expo start -c` pour vider le cache Metro

## 6. Validation

- [ ] Lancer l’app sur Android & iOS → vérifier qu’aucune erreur **Invalid call** n’apparaît
- [ ] Vérifier qu’un ingrédient affiche bien son image (ouvrir un détail de repas ou via l’écran de recherche)

## 7. Bonnes pratiques

- Ajouter toute nouvelle image **via le mapping** et refaire tourner la conversion.
- Conserver la structure : images → mapping → Base64 → DB → UI.
- Pour des images distantes (CDN), sauter l’étape `require` et passer directement l’URL (Asset.fromURI).

## 8. Génération automatique du mapping (optionnel)

- [x] Créer un script `scripts/generateIngredientImages.ts` qui :
  1. Parcourt tous les fichiers `db/*.ts` et extrait les valeurs `image:`
  2. Vérifie l’existence du fichier sur le disque
  3. Génère (ou met à jour) `db/ingredientImages.ts` avec les `require(...)`
- [ ] Lancer `npm run generate:ingredient-images` pour générer / mettre à jour le mapping avant chaque build.

Tâches encore en attente :

* Validation (lancer Metro & tests visuels)
