# Checklist de migration de Gluestack UI vers Shopify's Restyle

## Phase 1: Préparation et analyse du design Figma

- [ ] Inventaire complet des composants Gluestack UI utilisés dans l'application
- [ ] Identification des composants personnalisés basés sur Gluestack
- [ ] Analyse du design system Figma acheté via le serveur MCP Figma
  - [ ] Utilisation de MCP Figma pour extraire les données du fichier Figma
  - [ ] Récupération programmatique des tokens de couleur
  - [ ] Extraction des styles typographiques via l'API MCP
  - [ ] Identification des composants et leurs variantes
  - [ ] Téléchargement des assets graphiques (icônes, illustrations)
- [ ] Comparaison entre le design Figma et l'implémentation actuelle
- [ ] Évaluation de l'utilisation des composants dans l'architecture MCP
- [ ] Création d'un environnement de test pour valider les composants migrés
- [ ] Détermination de l'approche de migration (big bang vs progressive)

## Phase 2: Configuration initiale

- [ ] Installation de Shopify's Restyle: `npm install @shopify/restyle`
- [ ] Génération automatique du thème Restyle à partir des données MCP Figma
  - [ ] Création d'un script d'extraction qui utilise mcp0_get_figma_data
  - [ ] Transformation des tokens Figma en format compatible Restyle
  - [ ] Automatisation de la synchronisation design-code
  - [ ] Génération du type Theme pour TypeScript
- [ ] Configuration du ThemeProvider dans l'application
- [ ] Création d'un système de types partagé pour le thème
- [ ] Établissement de l'équivalence entre props Gluestack et props Restyle
- [ ] Configuration d'un workflow d'intégration continue avec MCP Figma
  - [ ] Création d'un script de synchronisation automatique
  - [ ] Détection des changements dans le design Figma
  - [ ] Génération de rapports de différences

## Phase 3: Développement des composants de base

- [ ] Création du composant Box (équivalent à Box/ThemedView)
- [ ] Création du composant Text (équivalent à Text/ThemedText)
- [ ] Développement d'équivalents pour HStack et VStack
- [ ] Implémentation des composants d'espacement (Spacer, etc.)
- [ ] Génération des assets graphiques via MCP Figma
  - [ ] Utilisation de mcp0_download_figma_images pour les icônes
  - [ ] Intégration des assets dans le système de composants
- [ ] Création des composants de formulaire (Input, TextArea, etc.)
- [ ] Développement des composants interactifs (Button, Pressable)
- [ ] Implémentation des composants de feedback (Toast, Modal)
- [ ] Création des composants de navigation (Tabs, etc.)

## Phase 4: Stratégie de migration

- [ ] Identification des pages/écrans à migrer en priorité
- [ ] Définition d'une convention de nommage pour éviter les conflits
- [ ] Mise en place d'une approche d'import qui facilite la migration progressive
- [ ] Création d'adaptateurs pour maintenir la compatibilité durant la transition
- [ ] Définition de la stratégie de test pour les composants migrés

## Phase 5: Migration progressive

- [ ] Migration des écrans simples et isolés
- [ ] Refactorisation des composants partagés
- [ ] Migration des composants liés à l'affichage nutritionnel
- [ ] Adaptation des formulaires et écrans de saisie
- [ ] Migration des composants liés au module IA
- [ ] Adaptation de la logique d'affichage normalisée à 100g

## Phase 6: Tests et validation

- [ ] Tests unitaires des nouveaux composants
- [ ] Tests d'intégration des écrans refactorisés
- [ ] Comparaison visuelle avec le design Figma
  - [ ] Vérification de la correspondance exacte des couleurs
  - [ ] Validation des espacements et alignements
  - [ ] Contrôle de la typographie (taille, poids, interlignage)
  - [ ] Vérification des états des composants (hover, focus, etc.)
- [ ] Validation des performances après migration
- [ ] Vérification de l'accessibilité
- [ ] Test de régression visuelle automatisé
- [ ] Validation du fonctionnement sur iOS et Android

## Phase 7: Finalisation et nettoyage

- [ ] Suppression des dépendances Gluestack UI
- [ ] Nettoyage des imports non utilisés
- [ ] Documentation des nouveaux composants
- [ ] Mise à jour des guides de style et de la documentation
- [ ] Consolidation des thèmes et styles
- [ ] Validation des fonctionnalités critiques (affichage nutritionnel à 100g)

## Phase 8: Optimisation et améliorations

- [ ] Analyse des performances des composants Restyle
- [ ] Optimisation des re-rendus avec mémoisation
- [ ] Amélioration de l'homogénéité visuelle 
- [ ] Renforcement de la typologie du système
- [ ] Intégration des commentaires utilisateurs

## Considérations architecturales

- [ ] Maintenir la séparation entre Model, Controller et Presenter (MCP)
- [ ] Centraliser les transformations de données nutritionnelles
- [ ] Assurer la cohérence du système d'affichage des valeurs nutritionnelles à 100g
- [ ] Intégrer le nouveau système UI dans les modules IA refactorisés
- [ ] Veiller à résoudre les problèmes de dépendances circulaires existants

## Ressources

- Documentation Shopify Restyle: https://github.com/Shopify/restyle
- Design system Figma acheté
- Documentation de l'API MCP Figma
- Documentation sur l'utilisation des fonctions mcp0_get_figma_data et mcp0_download_figma_images
- Documentation des types TypeScript
- Inventaire des composants existants
- Documentation de l'architecture MCP de Lift
