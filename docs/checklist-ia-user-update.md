# Checklist : Implémentation de la mise à jour utilisateur via IA

## 1. Modification du système de détection d'actions

- [ ] Ajouter une nouvelle action `UPDATE_USER` dans les ACTION_TAGS
- [ ] Créer le schéma de validation pour les mises à jour utilisateur
- [ ] Implémenter la détection de l'action dans `detectDatabaseAction`

## 2. Mise à jour des handlers MCP

- [ ] Créer un nouveau handler `handleUpdateUserViaMCP` dans user-handlers.ts
- [ ] Ajouter le support pour :
  - [ ] Mise à jour du nom
  - [ ] Mise à jour des préférences de base
  - [ ] Mise à jour des préférences nutritionnelles
  - [ ] Validation des données avant mise à jour

## 3. Enrichissement des prompts IA

- [ ] Ajouter un nouveau type de prompt `USER_UPDATE` dans `PromptTypeEnum`
- [ ] Créer `buildUserUpdatePrompt` dans promptBuilder.ts
- [ ] Implémenter la logique de détection des intentions de mise à jour
- [ ] Ajouter des exemples de format JSON pour les mises à jour

## 4. Implémentation du processeur d'actions

- [ ] Créer `processUserUpdateAction` dans iaActions.ts
- [ ] Gérer les différents types de mises à jour :
  - [ ] Mise à jour simple du nom
  - [ ] Mise à jour des préférences
  - [ ] Mise à jour combinée
- [ ] Implémenter la validation des données
- [ ] Gérer les erreurs et les cas limites

## 5. Mise à jour du service IA

- [ ] Ajouter une méthode `updateUserProfile` dans IAService
- [ ] Implémenter la logique de traitement des requêtes en langage naturel
- [ ] Gérer la conversion des réponses en actions
- [ ] Ajouter la gestion des erreurs et la validation

## 6. Format JSON pour les mises à jour

```typescript
// Format attendu pour les mises à jour utilisateur
{
  "type": "UPDATE_USER",
  "data": {
    "name": "Nouveau nom",
    "preferences": {
      "age": 25,
      "gender": "MALE",
      "weight": 75,
      "weightUnit": "KG",
      "height": 180,
      "heightUnit": "CM",
      "physicalActivity": "MODERATELY_ACTIVE"
    }
  }
}
```

## 7. Tests et validation

- [ ] Tester les requêtes en français :
  - [ ] "Mets à jour mon nom en Jean Dupont"
  - [ ] "Change mon niveau d'activité physique à très actif"
  - [ ] "Modifie mon poids à 75 kg"
- [ ] Vérifier la détection correcte des intentions
- [ ] Valider le format des données générées
- [ ] Tester les cas d'erreur et les validations

## 8. Intégration avec le cache et l'UI

- [ ] Implémenter l'invalidation du cache après mise à jour
- [ ] Mettre à jour le store utilisateur
- [ ] Rafraîchir l'interface utilisateur
- [ ] Ajouter des notifications de succès/erreur

## 9. Documentation

- [ ] Documenter les nouveaux formats de prompt
- [ ] Ajouter des exemples d'utilisation
- [ ] Mettre à jour la documentation de l'API
- [ ] Documenter les cas d'erreur possibles

## 10. Sécurité et validation

- [ ] Vérifier les permissions utilisateur
- [ ] Valider les données avant mise à jour
- [ ] Implémenter des limites de taux
- [ ] Ajouter des logs de sécurité

## Notes importantes

1. **Gestion des langues** :
   - L'IA comprend déjà le français
   - Les clés JSON doivent rester en anglais
   - Les valeurs peuvent être en français

2. **Validation** :
   - Toutes les données doivent être validées avant la mise à jour
   - Les unités doivent être converties si nécessaire
   - Les valeurs numériques doivent être dans des plages acceptables

3. **Performance** :
   - Utiliser le cache de manière optimale
   - Minimiser les requêtes à la base de données
   - Gérer efficacement les mises à jour en batch
