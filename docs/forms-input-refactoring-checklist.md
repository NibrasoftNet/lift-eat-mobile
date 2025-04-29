# Checklist de refactorisation des Forms-Input (MCP)

Ce document pru00e9sente les u00e9tapes nu00e9cessaires pour refactoriser les composants forms-input de l'application selon l'architecture MCP (Model-Controller-Persistence). Cochez les cases au fur et u00e0 mesure que vous complu00e9tez les u00e9tapes.

## Phase 1: Analyse et pru00e9paration

- [ ] Analyser tous les composants forms-input pour identifier la logique mu00e9tier u00e0 extraire
  > Commentaire: Analyse en cours le 26/04/2025. Identification de la logique mu00e9tier dans les composants DurationFormInput, GenderFormInput, GoalTypeFormInput, PhysicalActivityFormInput et WeightFormInput.
- [ ] Identifier les services u00e0 cru00e9er et leur responsabilitu00e9
  > Commentaire: Services u00e0 cru00e9er: form-input.service.ts (service gu00e9nu00e9rique), gender-form.service.ts, goal-form.service.ts, physical-activity-form.service.ts et weight-input.service.ts.
- [ ] Cru00e9er les interfaces nu00e9cessaires pour les services
  > Commentaire: Les interfaces seront cru00e9u00e9es dans form-input.interface.ts.

## Phase 2: Création des services

### Form-Input Service (gu00e9nu00e9rique)
- [ ] Cru00e9er le fichier `form-input.service.ts`
  > Commentaire: Service gu00e9nu00e9rique pour les fonctionnalitu00e9s communes u00e0 tous les composants de formulaire.
- [ ] Implu00e9menter les fonctions de validation gu00e9nu00e9riques
  > Commentaire: Cru00e9er des validateurs pour les nombres, les champs requis, etc.
- [ ] Implu00e9menter les fonctions de formatage des donnu00e9es
  > Commentaire: Fonctions pour convertir entre les types (string/number) et formater l'affichage.

### Gender-Form Service
- [ ] Cru00e9er le fichier `gender-form.service.ts`
  > Commentaire: Service spu00e9cifique pour la gestion du formulaire de genre.
- [ ] Implu00e9menter les fonctions d'animation et de gestion d'u00e9tat
  > Commentaire: Extraire la logique d'animation et les styles spu00e9cifiques au genre.

### Goal-Form Service
- [ ] Cru00e9er le fichier `goal-form.service.ts`
  > Commentaire: Service spu00e9cifique pour la gestion du formulaire d'objectifs.
- [ ] Implu00e9menter les fonctions de gestion des u00e9tats et styles
  > Commentaire: Extraire la logique de su00e9lection des objectifs et les styles associu00e9s.

### Physical-Activity-Form Service
- [ ] Cru00e9er le fichier `physical-activity-form.service.ts`
  > Commentaire: Service spu00e9cifique pour la gestion du formulaire d'activitu00e9 physique.
- [ ] Implu00e9menter les fonctions de gestion des images et des niveaux d'activitu00e9
  > Commentaire: Centraliser la logique de chargement et d'affichage des images d'activitu00e9.

### Weight-Input Service
- [ ] Cru00e9er le fichier `weight-input.service.ts`
  > Commentaire: Service spu00e9cifique pour la gestion des entru00e9es de poids.
- [ ] Implu00e9menter les fonctions de conversion et validation des poids
  > Commentaire: Extraire la logique de validation et de conversion des poids.

## Phase 3: Refactorisation des composants

### DurationFormInput
- [ ] Refactoriser `DurationFormInput.tsx` pour utiliser le service form-input
  > Commentaire: Utiliser le service pour la validation et la conversion des nombres.

### GenderFormInput
- [ ] Refactoriser `GenderFormInput.tsx` pour utiliser le service gender-form
  > Commentaire: Du00e9placer la logique d'animation et de gestion d'u00e9tat vers le service.

### GoalTypeFormInput
- [ ] Refactoriser `GoalTypeFormInput.tsx` pour utiliser le service goal-form
  > Commentaire: Du00e9placer la logique de su00e9lection et les styles vers le service.

### PhysicalActivityFormInput
- [ ] Refactoriser `PhysicalActivityFormInput.tsx` pour utiliser le service physical-activity-form
  > Commentaire: Du00e9placer la logique des images et des niveaux d'activitu00e9 vers le service.

### WeightFormInput
- [ ] Refactoriser `WeightFormInput.tsx` pour utiliser le service weight-input
  > Commentaire: Du00e9placer la logique de validation et de conversion vers le service.

## Phase 4: Tests et validation


- [ ] S'assurer que tous les cas d'usage sont couverts
  > Commentaire: Vu00e9rifier que tous les cas d'utilisation des formulaires sont pris en charge.



## Notes et observations

- La structure MCP permettra une meilleure su00e9paration des responsabilitu00e9s et facilitera la maintenance.
- L'extraction de la logique mu00e9tier dans des services permettra de ru00e9utiliser le code et de simplifier les tests unitaires.
