# Guideline : Créer & intégrer un nouveau composant UI à partir de Figma

Cette checklist sert de mémo Windsurf pour garantir qu’un nouveau composant respecte le design Figma **pixel-perfect** et s’intègre proprement à la base de code React Native (architecture Atomic Design).

---

## 🗂️ 1. Pré-analyse Figma

1. Note le(s) **node-id** Figma et prends une capture pour référence.
2. Classe le composant : **atom / molecule / organism**.
3. Liste les tailles, couleurs, bord-radius, shadows visibles.
4. Vérifie s’il existe déjà un composant ou icône équivalent.

## 🏗️ 2. Structure de dossier & nommage

| Atomic level | Dossier cible                        | Exemple                                              |
| ------------ | ------------------------------------ | ---------------------------------------------------- |
| Atom         | `components-new/ui/atoms/<category>` | `atoms/inputs/CircularAddButton.tsx`                 |
| Molecule     | `components-new/ui/molecules/...`    | `molecules/calorie-tracker/DateNavigationHeader.tsx` |
| Organism     | `components-new/ui/organisms/...`    | `organisms/calorie-tracker/CalorieTracker.tsx`       |

Règle : **Pas de nom générique** ; utilise le wording Figma + rôle (ex : `CircularAddButton`).

## 🎨 3. Implémentation pixel-perfect

- Utilise les **design tokens** via `themeNew` (`theme.colors.*`, `spacing`, etc.).
- Dimensions fixes ? → constantes. Dimensions variables ? → props avec valeur par défaut Figma.
- Texte : police _Urbanist_, fontWeight, letterSpacing, lineHeight selon Figma.
- Icône :
  - S’il existe déjà dans `assets/icons`, importe-le.
  - Sinon : crée une icône SVG inline **simple** ou ajoute un fichier dans `assets/icons/figma/...`.
- Accessibilité : ajoute `accessibilityRole`, `accessibilityLabel` si pertinent.

## 🧩 4. Exports & indexation

1. Ajoute l’export dans l’`index.ts` du sous-dossier (ex : `atoms/inputs/index.ts`).
2. Ajoute l’export dans `components-new/ui/atoms/index.ts` (ou molecules/organisms équivalent).

## 👀 5. Intégration & Story / Demo

1. Ajoute le composant dans une **screen de démo** (ex : `app/(root)/(tabs)/analytics/index.tsx`).
2. Vérifie visuellement sur appareil/simulateur.
3. Ajuste jusqu’à correspondance exacte avec Figma (capture comparaison si besoin).

## ✅ 6. Checklist finale avant merge

- [ ] Visuel 1:1 avec Figma (pixel-perfect, couleurs, rayons, marges).
- [ ] Respect de l’Atomic Design et du chemin dossier.
- [ ] Props minimales documentées (JSDoc) & types précis.
- [ ] Exports ajoutés.
- [ ] Lint + tests passent (`npm run lint`, `npm run test`).
- [ ] Capture d’écran ajoutée à la PR.

---

> Mainteneur : Mettez à jour cette checklist si le workflow ou l’architecture change.
