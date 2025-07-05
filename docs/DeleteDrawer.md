# DeleteConfirmationDrawer – Implementation Checklist

> Suivez cette checklist pour livrer un composant conforme au design Figma et cohérent avec le design-system Lift.

## 0. Vérification des guidelines génériques

- [ ] Lire et appliquer chaque point de `docs/figma_component_guidelines.md` afin de garantir : structure Atomic Design, design tokens, exportation et tests.

## 1. Analyse du design

- [ ] Ouvrir les deux frames Figma : [Frame A](https://www.figma.com/design/Heyqlc3lmaJy5uxwVg1U33/jdid?node-id=48484-27668&t=rMGI1uSMgYZwSeR9-4) • [Frame B](https://www.figma.com/design/Heyqlc3lmaJy5uxwVg1U33/jdid?node-id=48484-27917&t=rMGI1uSMgYZwSeR9-4)
- [ ] Extraire couleurs, typographies, rayons, ombres, espacements
- [ ] Noter les états (ouvert/fermé) et l’animation de slide-up du drawer

## 2. Audit du design-system existant (`components-new`)

- [ ] Vérifier la présence de :
  - [ ] `Drawer` ou `BottomSheet`
  - [ ] `Button` (variants vert & ghost)
  - [ ] Tokens couleur `error.500`, `success.500`, radius, shadow
- [ ] Ajouter les tokens manquants dans le thème (`themeNew`)

## 3. Définition de l’API du composant

```ts
interface DeleteConfirmationDrawerProps {
  open: boolean;
  title?: string; // défaut : "Delete"
  description?: string; // défaut : "Sure you want to delete this food log?"
  subText?: string; // défaut : "This action cannot be undone."
  onCancel: () => void;
  onConfirm: () => void;
}
```

## 4. Structure JSX

- [ ] Drawer → VStack (titre, description, subText) → HStack (boutons)
- [ ] Titre centré, couleur `error.500`, style `h5`
- [ ] Textes centrés, body-medium & body-small
- [ ] Bouton Cancel : variant "ghost" (bord + texte noir)
- [ ] Bouton Yes, Delete : variant "solid" couleur `success.500`

## 5. Styles

- [ ] Espacements verticaux respectés (ex : 12 px, 8 px)
- [ ] Rayon 16 px sur Drawer + boutons (selon DS)
- [ ] Ombre douce : `0 4px 24px rgba(0,0,0,0.12)`

## 6. Comportement

- [ ] Animation slide-up (300 ms ease-out)
- [ ] Focus-trap dans le drawer
- [ ] Fermeture via swipe-down ou touche Esc

## 7. Accessibilité

- [ ] `role="dialog"`, `aria-modal="true"`
- [ ] Associer `aria-labelledby` au titre & `aria-describedby` au texte
- [ ] Bouton primaire `aria-label="Delete"`

## 8. Storybook / Docs

- [ ] Story "Default (open)" et "Playground"
- [ ] Tests visuels open / closed
- [ ] Contrôles interactifs pour `onConfirm` / `onCancel`

## 9. Tests unitaires

- [ ] Snapshot rendu
- [ ] Vérifier déclenchement des callbacks (click)
- [ ] Tests focus-trap & Esc

## 10. Barrel export

- [ ] `export { DeleteConfirmationDrawer } from './DeleteConfirmationDrawer'` dans `ui/organisms/index.ts`

## 11. Validation visuelle

- [ ] Vérifier sur device / simulateur contre Figma (pixel-perfect)
- [ ] Vérifier responsive (≥ 375 px et tablettes)

## 12. Revue & merge

- [ ] Lint / format OK
- [ ] Tokens manquants résolus
- [ ] PR avec screenshots "Before / After"
