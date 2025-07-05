# Checklist : Implémentation de la mémoire de conversation pour l'IA

## 1. Structure de données pour la conversation

- [ ] Créer une interface pour le message :
  ```typescript
  interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    context?: any;
  }
  ```

## 2. Stockage des conversations

- [ ] Créer une nouvelle table dans SQLite :
  ```sql
  CREATE TABLE conversation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    context TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  ```

## 3. Handlers MCP pour la conversation

- [ ] Créer `conversation-handlers.ts` avec :
  - [ ] `handleSaveMessage`
  - [ ] `handleGetConversationHistory`
  - [ ] `handleClearConversation`
  - [ ] `handleGetRecentContext`

## 4. Service de gestion des conversations

- [ ] Créer `ConversationService` avec :
  - [ ] Méthode pour ajouter un message
  - [ ] Méthode pour récupérer l'historique
  - [ ] Méthode pour nettoyer l'historique
  - [ ] Gestion du contexte de conversation

## 5. Modification du IAService

- [ ] Ajouter la gestion de l'historique dans `generateResponse` :
  - [ ] Récupérer les messages récents
  - [ ] Inclure le contexte pertinent
  - [ ] Sauvegarder les nouvelles interactions

## 6. Enrichissement des prompts

- [ ] Modifier `buildEnrichedPrompt` pour inclure :
  - [ ] Messages précédents pertinents
  - [ ] Contexte de la conversation
  - [ ] Instructions de continuité

## 7. Implémentation de la fenêtre glissante

- [ ] Limiter le nombre de messages dans l'historique :
  ```typescript
  const MAX_HISTORY_MESSAGES = 10;
  const MAX_HISTORY_TOKENS = 2000;
  ```
- [ ] Implémenter la logique de nettoyage automatique

## 8. Gestion du contexte

- [ ] Définir les types de contexte :
  ```typescript
  type ConversationContext = {
    lastAction?: string;
    userGoals?: string[];
    activeTopics?: string[];
    relevantMeals?: string[];
    relevantPlans?: string[];
  };
  ```
- [ ] Implémenter la persistance du contexte

## 9. Optimisation des performances

- [ ] Mettre en cache l'historique récent
- [ ] Implémenter la pagination pour l'historique
- [ ] Optimiser les requêtes SQLite
- [ ] Gérer la taille de la base de données

## 10. Interface utilisateur

- [ ] Ajouter des indicateurs de contexte
- [ ] Permettre à l'utilisateur de :
  - [ ] Voir l'historique
  - [ ] Effacer l'historique
  - [ ] Marquer des conversations importantes

## 11. Tests

- [ ] Tester la persistance des conversations
- [ ] Vérifier la cohérence des réponses
- [ ] Tester les limites de mémoire
- [ ] Valider la gestion du contexte

## 12. Sécurité et confidentialité

- [ ] Chiffrer les données sensibles
- [ ] Implémenter la rétention des données
- [ ] Ajouter des options de confidentialité
- [ ] Gérer les permissions d'accès

## Notes importantes

1. **Gestion de la mémoire** :

   - Utiliser une fenêtre glissante pour limiter la taille
   - Prioriser les messages récents et pertinents
   - Nettoyer régulièrement les anciennes conversations

2. **Optimisation du contexte** :

   - Ne garder que les informations pertinentes
   - Mettre à jour le contexte de manière asynchrone
   - Utiliser des tags pour identifier les sujets importants

3. **Performance** :

   - Mettre en cache les conversations récentes
   - Utiliser des indices SQLite appropriés
   - Implémenter le nettoyage en arrière-plan

4. **Format des prompts** :

   ```typescript
   const enrichedPrompt = `
   ${previousContext}
   
   Recent conversation:
   ${recentMessages.map((m) => `${m.role}: ${m.content}`).join('\n')}
   
   Current context:
   ${currentContext}
   
   User question: ${userPrompt}
   
   Instructions: Répondez en tenant compte de la conversation précédente.
   `;
   ```
