# Checklist d'implémentation des icônes et de la navigation

## Barre de navigation

- [x] Configurer la structure de base de MenuBar
- [x] Créer le composant MenuItem avec gestion des états actifs/inactifs
- [x] Résoudre les problèmes de typage des icônes SVG
  - [x] Mettre à jour l'interface IconProps pour la compatibilité
  - [x] Remplacer l'utilisation de la propriété `size` par `width` et `height`
- [x] Implémenter les onglets de navigation
  - [x] Assistant
  - [x] Plan
  - [x] Meal
  - [x] Progress
  - [x] Analytics
- [ ] Remplacer les icônes temporaires par les icônes définitives
  - [x] BotLightRegularBoldIcon pour Assistant
  - [ ] Icône définitive pour Plan
  - [ ] Icône définitive pour Meal
  - [ ] Icône définitive pour Progress
  - [ ] Icône définitive pour Analytics

## Intégration des icônes Figma

- [x] Importer les icônes directement depuis les assets
  - [x] Chemin d'importation correct: `assets/icons/figma/[style]/[IconName].tsx`
- [x] Respecter la structure des icônes Figma
  - [x] Utiliser les icônes sans wrapper
  - [x] Passer directement les props width, height et color
- [ ] Vérifier la cohérence visuelle avec le design Figma
  - [x] Taille des icônes (24x24px)
  - [x] Couleurs selon l'état (actif/inactif)
  - [ ] Alignement avec les spécifications Figma

## Tests et validation

- [x] Éliminer les erreurs TypeScript
- [ ] Tester le rendu des icônes sur différents appareils
- [ ] Vérifier les performances (pas de rendering inutile)
- [ ] Valider l'accessibilité des icônes et des libellés

## Tâches futures

- [ ] Créer un système d'icônes cohérent et réutilisable
- [ ] Documenter l'utilisation des icônes pour les autres développeurs
- [ ] Mettre en place un processus automatisé d'extraction d'icônes depuis Figma
