# Checklist – Compléter `MainProgressCircle`

> Frame Figma : node 48490-25303

- [ ] **Ajouter la colonne “Burned”**
  - [ ] Libellé : icône/emoji 🔥 + texte `Burned`
  - [ ] Valeur : `burnedCalories` + suffixe `kcal`
- [ ] **Mettre à jour l’affichage au centre du cercle**
  - [ ] Afficher la valeur `remainingCalories` (ex. 2101)
  - [ ] Sous-titre `kcal left`
- [ ] **Remplacer les emojis par des icônes vectorielles** (Design System / `react-native-vector-icons`)
  - [x] 🥗 Eaten *(GreenSaladEmoji.tsx prêt)*
  - [x] 🔥 Burned *(FireEmoji.tsx prêt)*
  - [x] 🗓 Calendar *(CalendarEmoji.tsx prêt)*
- [ ] **Support du mode sombre**
  - [ ] Utiliser `theme.isDark` pour inverser les couleurs (fond, texte, primary)
- [ ] **Harmoniser les espacements**
  - [ ] Gap horizontal entre colonnes = 16 px (Figma)
- [ ] **Ajuster la typographie**
  - [ ] Poids, taille et letter-spacing identiques à Figma (Urbanist : Goal 600, labels 500, etc.)
- [ ] **Exploiter 100 % les couleurs du Design System**
  - [ ] Remplacer les constantes manquantes par `theme.color()`
- [ ] **Vérification finale**
  - [ ] Comparer visuellement avec Figma (node 48490-25303) et cocher chaque case
