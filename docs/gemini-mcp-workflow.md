# Workflow d'Interaction Gemini-SQLite via MCP Server

Ce document détaille le workflow complet des interactions entre Gemini et la base de données SQLite dans l'application Lift-Eat-Mobile, en se concentrant sur l'utilisation du serveur MCP comme point d'accès centralisé.

## Architecture Générale

```
┌─────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│  Interface  │────▶│ useGemini  │────▶│ IAService  │────▶│    MCP     │────▶┌─────────┐
│  Utilisateur│     │    Hook    │     │            │     │   Server   │     │ SQLite  │
└─────────────┘     └────────────┘     └────────────┘     └────────────┘     │   DB    │
                                             │                  ▲             └─────────┘
                                             ▼                  │
                                      ┌────────────┐     ┌────────────┐
                                      │   Gemini   │────▶│  Response  │
                                      │    API     │     │   Parser   │
                                      └────────────┘     └────────────┘
```

## Étapes du Workflow

### 1. Initiation de la Requête Utilisateur

- **Point d'entrée** : L'utilisateur interagit avec l'interface de l'application.
- **Composant impliqué** : Hooks React, notamment `useGemini`
- **Action** : L'utilisateur pose une question ou fait une demande (ex: création d'un repas).
- **Code clé** : 
  ```typescript
  const { generateResponse } = useGemini();
  const response = await generateResponse(userPrompt);
  ```

### 2. Préparation du Contexte Utilisateur

- **Composant impliqué** : `IAService` et `promptBuilder.ts`
- **Actions** :
  1. Détermination du type de prompt (`determinePromptType`)
  2. Enrichissement du prompt avec des informations utilisateur
  3. Construction d'instructions spécifiques selon le type (repas, plan, ingrédient)
- **Interaction MCP** : `generateUserContext` récupère les données utilisateur via `sqliteMCPServer`
- **Code clé** :
  ```typescript
  const promptType = determinePromptType(prompt);
  const enrichedPrompt = await buildEnrichedPrompt(userId, prompt, promptType);
  ```

### 3. Envoi à l'API Gemini

- **Composant impliqué** : `directGeminiRequest` dans `IAService`
- **Action** : Envoi du prompt enrichi à l'API Gemini
- **Retour** : Réponse textuelle de Gemini, potentiellement avec des balises d'action
- **Code clé** :
  ```typescript
  const responseText = await this.directGeminiRequest(enrichedPrompt);
  ```

### 4. Analyse de la Réponse

- **Composant impliqué** : `responseParser.ts`
- **Actions** :
  1. Détection d'actions dans la réponse via `detectDatabaseAction`
  2. Analyse des balises d'action (`<ADD_MEAL>`, `<ADD_PLAN>`, `<ADD_INGREDIENT>`)
  3. Validation des données JSON (utilisation de Zod)
- **Code clé** :
  ```typescript
  const detectedAction = detectDatabaseAction(responseText);
  if (detectedAction.isValid) {
    // Traitement de l'action
  }
  ```

### 5. Exécution des Actions via MCP Server

- **Composant impliqué** : `iaActions.ts`
- **Actions** potentielles :
  1. `processMealAction` - Ajout d'un repas
  2. `processPlanAction` - Ajout d'un plan nutritionnel
  3. `processIngredientAction` - Ajout d'un ingrédient
- **Interaction MCP** : Appels directs aux méthodes du serveur MCP
- **Code clé** :
  ```typescript
  // Toutes les actions utilisent le serveur MCP
  const result = await sqliteMCPServer.addMealViaMCP(mealData, userId);
  // ou
  const result = await sqliteMCPServer.addPlanViaMCP(planData, userId);
  // ou
  const result = await sqliteMCPServer.addIngredientViaMCP(ingredientData);
  ```

### 6. Opérations SQLite via MCP Server

- **Composant impliqué** : `sqlite-server.ts`
- **Actions** :
  1. Transactions SQLite pour assurer l'intégrité des données
  2. Insertion/mise à jour des données dans les tables appropriées
  3. Relations entre entités (ex: repas et ingrédients)
  4. Gestion des erreurs et journalisation
- **Code clé** :
  ```typescript
  // Exemple pour un repas
  return await this.db.transaction(async (tx) => {
    // 1. Créer le repas principal
    const mealResult = await tx.insert(meals).values({...}).returning({...});
    // 2. Ajouter les ingrédients associés
    for (const ingredient of meal.ingredients) {
      // Logique d'ajout d'ingrédients
    }
  });
  ```

### 7. Retour de la Réponse à l'Utilisateur

- **Composant impliqué** : `IAService`
- **Actions** :
  1. Nettoyage de la réponse (suppression des balises d'action) via `cleanResponseText`
  2. Préparation d'un objet de retour avec texte et statut de l'action
  3. Affichage du résultat à l'utilisateur
- **Code clé** :
  ```typescript
  return {
    text: cleanedResponse,
    action: actionResult
  };
  ```

## Avantages de l'Architecture MCP

1. **Centralisation** : Toutes les interactions avec la base de données passent par le serveur MCP.
2. **Isolation** : Les services IA n'accèdent jamais directement à la base de données.
3. **Cohérence** : Utilisation de transactions pour garantir l'intégrité des données.
4. **Extensibilité** : Facile d'ajouter de nouvelles actions sans modifier les services existants.
5. **Journalisation** : Traçage complet des opérations via le système de logging.

## Schéma du Flux de Données

```
┌────────────┐
│ Requête    │
│ Utilisateur│
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Enrichisse-│
│ ment Prompt│
└─────┬──────┘
      │
      ▼
┌────────────┐
│  API       │
│  Gemini    │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Détection  │
│ d'Actions  │
└─────┬──────┘
      │
      ▼
┌────────────┐     ┌────────────┐
│ Exécution  │────▶│   MCP      │
│ d'Actions  │     │  Server    │
└────────────┘     └─────┬──────┘
                         │
                         ▼
                   ┌────────────┐
                   │ Opérations │
                   │   SQLite   │
                   └────────────┘
```

## Points d'Amélioration

1. **Complétion de l'intégration MCP** : S'assurer que toutes les fonctionnalités utilisent MCP pour accéder à la base de données.
2. **Types d'actions supplémentaires** : Ajouter de nouveaux types d'actions dans le serveur MCP (modifier/supprimer des entités).
3. **Optimisation des transactions** : Améliorer la performance des transactions pour les opérations complexes.
4. **Cache des données** : Implémenter un système de cache pour réduire les accès à la base de données.
5. **Meilleure gestion des erreurs** : Améliorer le retour d'erreurs spécifiques vers l'interface utilisateur.

## Conclusion

L'architecture actuelle met déjà en œuvre une séparation propre entre l'IA (Gemini) et la base de données SQLite grâce au serveur MCP. Toutes les interactions passent par ce serveur, ce qui garantit la cohérence des données et facilite la maintenance du code. Les améliorations suggérées permettraient d'optimiser davantage cette architecture déjà bien conçue.
