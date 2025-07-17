# ✅ Offline Sync Checklist (Convex ⇄ SQLite)

> Objectif : permettre la mise à jour périodique des données (ingrédients standards, repas, plans, etc.) tout en conservant un mode hors-ligne complet.

## Backend : Convex

- [ ] **Ajout du champ `updatedAt`** à toutes les tables concernées dans `convex/schema.ts` (ISO string).
- [ ] **Création de l’index `by_updatedAt`** pour chaque table (si pagination).
- [ ] **Query `getChanges`**
  - [ ] Renvoie les enregistrements modifiés depuis `since` (paramètre ISO string, optionnel).
  - [ ] Supporte la pagination (limit & cursor).
- [ ] **Mutation `uploadChanges`** (Phase 2 : push)
  - [ ] Insère ou met à jour les enregistrements provenant du client.
  - [ ] Gère les conflits via timestamp ou version.
- [ ] **`npm run convex codegen`** : mettre à jour les types.

## Frontend : React Native / Expo

### Core
- [ ] **Créer `utils/services/core/sync-core.service.ts`**
  - [ ] Lit/écrit `lastSyncedAt` (AsyncStorage).
  - [ ] Appelle `getChanges` Convex.
  - [ ] Effectue les *upserts* Drizzle pour chaque collection.
  - [ ] Met à jour `lastSyncedAt`.
  - [ ] (Phase 2) Parcourt l’outbox locale et appelle `uploadChanges`.
- [ ] **Gérer les conflits** (timestamp le plus récent par défaut).

### Pages / UI
- [ ] **Hook `useSync()`** avec React Query (`useMutation`).
- [ ] **Déclenchement automatique** au démarrage si `Date.now() - lastSyncedAt > SYNC_INTERVAL`.
- [ ] **Bouton “Rafraîchir”** sur les écrans principaux.
- [ ] **Feedback UI** : toast ou spinner pendant la sync.

### Background
- [ ] **Configurer Expo BackgroundFetch + TaskManager**
  - [ ] Déclarer la tâche `background-sync`.
  - [ ] Enregistrer la tâche avec `minimumInterval` ≥ 1 h.
  - [ ] Retourner `BackgroundFetch.Result.*` selon le succès.

### Drizzle ORM
- [ ] **Ajouter `updatedAt` + `id` (uuid)** dans les schémas SQLite.
- [ ] **Créer helper `upsert()`** générique pour Drizzle.
- [ ] **Écrire migration** correspondante (`drizzle-kit`).

## Tests & Qualité
- [ ] **Unit tests** pour `sync-core.service` (mock Convex + Drizzle mémoire).
- [ ] **E2E Happy Path** : démarrer offline → ajouter données → online → sync OK.
- [ ] **Lint/CI** : assurer l’exécution de `convex codegen` et `drizzle-kit generate`.

## Documentation
- [ ] Mettre à jour `docs/mcp-architecture-complet.md` (section Services Core & API).
- [ ] Ajouter guide d’environnement (`EXPO_PUBLIC_CONVEX_URL`, etc.).

---

### Legend
- ✅ Terminé   |   🔄 En cours   |   ☐ À faire
