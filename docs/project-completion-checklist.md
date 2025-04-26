# 🏁 Project Completion Checklist – Lift-Eat-Mobile

_Generated: 2025-04-26_

Legend  
- [x] Done (verified)  
- [ ] Todo / In progress  

---

## A. MCP Back-End
### A1. Ingredient Handlers
- [x] addIngredientViaMCP → handleAddIngredient
- [x] getIngredientsListViaMCP → handleGetIngredientsList
- [x] updateIngredientViaMCP → handleUpdateIngredient
- [x] deleteIngredientViaMCP → handleDeleteIngredient
- [x] Cache invalidation (implémenté avec QueryClient optionnel)

### A2. Missing Handlers & Tests
- [ ] handleUpdateMeal & handleDeleteMeal
- [ ] Extend filter params (cuisine, type…)
- [ ] Unit + integration tests for all handlers
- [ ] Unify error types & retry strategy

### A3. Documentation
- [ ] Update docs/MPC.md and docs/mpc-json
- [x] Initial architecture documented

---

## B. Authentication & Session
- [ ] Implement JWT refresh token flow
- [ ] Consolidate `sessionStore` & `UserContextProvider`
- [ ] Auto session guard on protected routes
- [ ] Server-side password verification
- [ ] Unified logout (clearSession + logout) with redirect
- [ ] Server-side token blacklist on logout
- [x] Register / Login flows validated

---

## C. UI Features
### C1. Ingredients Management
- [ ] List + search + filter screen
- [ ] IngredientForm (add / edit)
- [ ] Delete with confirmation
- [ ] Recent ingredients & quick-add shortcuts

### C2. Plan Editing
- [x] `/plans/my-plans/edit/[id]` screen
- [x] Connect to `updatePlanViaMCP`
- [x] Propagate changes to daily plans when main plan is updated
- [ ] Edit individual daily plan entries
- [ ] Duplicate plan feature

### C3. Advanced IA
- [ ] IA recommendation feedback UI
- [ ] Advice history & favourites
- [ ] Persist advice in DB

### C4. Analytics & Tracking
- [ ] Dashboard using `getUserActivityHistoryViaMCP`
- [ ] Charts, weekly/monthly reports

### C5. Profile
- [ ] Change password screen with validation

---

## D. Media Handling
- [ ] Image compression (configurable quality)
- [ ] Avatar resize 200×200
- [ ] Meal photo resize 800×600
- [ ] Default quality 0.7

---

## E. Data Validation
- [ ] Validate units against `MealUnitEnum`
- [ ] Referential integrity before ingredient deletion
- [ ] Server-side validations for user preferences

---

## F. Quality Assurance
- [ ] Add missing unit & integration tests
- [ ] ESLint & Prettier tidy-up
- [ ] Update documentation per feature
- [ ] Code review for every PR

---

## G. Completed Milestones (reference)
- [x] Full MCP core & cache layer
- [x] Meal & Plan CRUD via MCP
- [x] SQLite schema fixed & seeded
- [x] Structured logging service implemented
- [x] Calendar date ↔︎ weekday bug resolved
- [x] All current Jest tests pass
