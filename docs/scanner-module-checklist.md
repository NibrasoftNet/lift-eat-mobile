# Checklist de Création du Module Scanner

## Contraintes techniques
- Aucun composant Gluestack UI (`@gluestack-ui/*`) ne doit être utilisé dans ce module.
- Tous les composants doivent être soit custom (dans `components-new/ui/...`), soit natifs React Native.
- Le style doit être géré avec `StyleSheet.create`, le `ThemeProvider` du projet, et les couleurs définies localement.


## 1. Préparation de l'environnement
- **Dépendances**
  - [x] Assurez-vous que toutes les dépendances sont à jour dans `package.json`.
  - [x] Vérifiez que le `ThemeProvider` est correctement configuré pour appliquer les styles globaux.
  - [x] Vérifiez que les icônes SVG sont disponibles dans `assets/icons/figma`.

## 2. Création des Composants Atomiques
- **Box**
  - [x] `Box` déjà créé dans `components-new/ui/atoms/base`.
- **Text**
  - [x] `Text` déjà créé dans `components-new/ui/atoms/base`.
- **Button**
  - [x] `Button` déjà créé dans `components-new/ui/atoms/inputs`.
- **Image**
  - [x] `Image` déjà créé dans `components-new/ui/atoms/display`.

## 3. Mise en page et disposition
- **Convention de layout**
  - [x] Utilisez le composant `Box` (custom) avec la prop `flexDirection: 'row'` ou `'column'` et `gap` pour remplacer le comportement de `VStack` et `HStack`.
  - [x] Il n'est pas nécessaire de créer de nouveaux composants `VStack`/`HStack` : suivez la convention utilisée dans les nouveaux écrans repas.
  - Exemple :
    ```tsx
    <Box style={{ flexDirection: 'row', gap: 8 }}>
      {/* éléments alignés horizontalement */}
    </Box>
    <Box style={{ flexDirection: 'column', gap: 12 }}>
      {/* éléments empilés verticalement */}
    </Box>
    ```

## 4. Création des Composants du Scanner
- **CameraView**
  - [x] Afficher le flux caméra en plein écran (Expo Camera)
  - [x] Gérer les permissions (demande + états)
  - [x] Ajouter un bouton retour (icône "CloseSquareRegularBoldIcon") en haut à gauche
  - [x] Ajouter un bouton flash ON/OFF (icône "FlashRegularBoldIcon") en haut à droite
  - [x] Ajouter un indicateur de scan (state loading) le cas échéant
- **ScanOverlay**
  - [x] Afficher un cadre de détection (rectangle arrondi blanc semi-transparent) centré
  - [x] Ajouter un masque sombre/blur autour du cadre
  - [x] Ajouter une ligne d’animation (scan line) qui se déplace verticalement
  - [x] Afficher un texte d’instruction "Align the barcode within the frame" sous le cadre
  - [x] Afficher un indicateur lorsqu’un code est détecté (bordure/couleur verte)
- **ScanResultCard** (Affichage des résultats du scan)
  - [x] Afficher l’image ronde du produit en haut (centrée)
  - [x] Afficher le nom du produit (ex: Kit Kat)
  - [x] Afficher un bouton favori (icône cœur SVG) en haut à droite
  - [x] Afficher le cercle nutritionnel (kcal, macros colorées)
  - [x] Afficher le détail des macros (Carbs, Protein, Fat) avec couleur et pourcentage
  - [x] Afficher un bouton principal « Add » en bas, large, couleur verte (#A1CE50)
  - [x] Respecter la typographie, arrondis, ombres et espacements du design Figma
  - [x] Utiliser uniquement des composants custom ou natifs (pas de Gluestack)
  - [x] Utiliser StyleSheet.create pour tous les styles
- **ProductDetails**
  - [x] Créez `ProductDetails` dans `components-new/ui/molecules/scan` pour afficher les détails du produit scanné (si séparé du card principal).
- **ScanHistory**
  - [x] Créez `ScanHistory` dans `components-new/ui/molecules/scan` pour afficher l'historique des scans.

## 5. Intégration des Icônes SVG
- **Icônes**
  - [x] Utiliser les icônes de notre collection `assets/icons/figma`
  - [x] Importez `BarcodeRegularBoldIcon` pour l'icône de code-barres.
  - [x] Importez `CloseSquareRegularBoldIcon` pour l'icône de fermeture.
  - [x] Importez `FlashRegularBoldIcon` pour l’icône de flash.
  - [x] Importez `HeartRegularBoldIcon` pour le favori.

## 6. Checklist UI technique et conformité Figma
- [ ] Tous les espacements, couleurs, arrondis, ombres et typographies doivent suivre le design Figma (node 50429-110580).
- [ ] Vérifier la responsivité sur différents écrans.
- [ ] Ajouter des commentaires clairs dans chaque composant.
- [x] Valider l’accessibilité (contrastes, tailles de texte, focus, etc.).
- [x] Respecter la typographie.
- [x] Intégration du *dynamic theming* via l’objet `Colors` et `useColorScheme`.

## 6.1. Internationalisation (i18n)
- [x] Intégrer `useTranslation` pour les textes statiques.
- [x] Remplacer les chaînes de caractères en dur par des clés de traduction (ex: `scanner.overlayInstruction`).
- [x] Mettre à jour les fichiers `translation.json` pour `en-US` et `fr-FR`.

## 7. Mise en Œuvre de la Structure de l'Écran
- **Structure**
  - [x] Implémentez la structure de `ScannerScreen` en utilisant les nouveaux composants.
  - [x] Assurez-vous que tous les composants sont correctement intégrés et affichés.
  - [ ] Vérifiez l'affichage sur différentes tailles d'écran pour garantir la réactivité.

## 8. Tests et Validation
- **Tests Unitaires**
  - [ ] Testez chaque composant individuellement pour vérifier leur bon fonctionnement.
- **Intégration**
  - [ ] Vérifiez l'intégration avec le service `scannerService` pour s'assurer de la compatibilité.

- **Fonctionnalité**
  - [ ] Validez le fonctionnement du scanner avec des codes-barres réels pour garantir l'exactitude.

## 9. Documentation
- **Commentaires**
  - [ ] Documentez chaque composant avec des commentaires clairs et explicites pour faciliter la maintenance.
- **Mise à Jour**
  - [x] Mettez à jour la documentation du projet pour inclure le nouveau module scanner et ses fonctionnalités.

## 10. Tâches Backend
- **Ajout dans ingredients_standard**
  - [x] Implémenter le service pages "scanPagesService.addScannedIngredient" (appel ingredientCoreService.createIngredient)
  - [x] Brancher le bouton « Add » du ScanResultCard pour appeler ce service
  - [x] Gérer le toast/feedback utilisateur après ajout (success / already exists)
- **Gestion des images produits**
  - [x] Revenir le champ `image` en `blob` dans `db/schema.ts`
  - [x] Mettre à jour `handleAddIngredient` pour insérer `image` (buffer)
  - [x] Conversion URL/dataURI → Buffer dans `ingredientCoreService.createIngredient`
  - [x] Vérifier la cohérence du seed data
  - [ ] Implémenter la conversion Buffer → URL côté UI pour l'affichage offline

## 11. Refactorisation V2 – Séparation des écrans
- **Structure de dossiers**
  - [x] Déplacer l’actuel `meals/scanner.tsx` vers `meals/scanner/index.tsx`
  - [x] Créer `meals/scanner/history.tsx` pour l’historique des scans
  - [x] Créer `meals/scanner/product/[code].tsx` pour l’affichage des détails produit
- **Navigation**
  - [x] Depuis `index.tsx`, après un scan réussi : `router.push('/meals/scanner/product/' + barcode)`
  - [x] Bouton « Historique » : `router.push('/meals/scanner/history')`
- **Composants & logique**
  - [x] Réutiliser `ScanHistory` et `ScanResultCard` dans les nouveaux écrans
  - [x] Garder la logique d’anti-rebond dans `index.tsx` seulement
  - [x] Aucun traitement métier dans les écrans – déléguer aux services pages
- **Tests & QA**
  - [ ] Vérifier la navigation (back, tabs) sur iOS et Android
  - [ ] Vérifier la persistance de l’historique après ajout / suppression
