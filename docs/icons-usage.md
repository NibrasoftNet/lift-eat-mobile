# Guide d'utilisation des icônes dans le projet Lift

Ce document définit les règles et bonnes pratiques pour l'utilisation des icônes SVG dans les composants React Native du projet Lift.

## Structure des icônes

Les icônes sont organisées selon la structure suivante:

```
assets/
  └── icons/
      └── figma/
          ├── regular-bold/
          ├── regular-light-outline/
          ├── curved-bold/
          ├── curved-light-outline/
          └── ...autres styles
```

## Règles d'importation et d'utilisation

### ✅ À faire

1. **Importation directe des icônes SVG**:
   ```tsx
   import { ArrowLeftRegularBoldIcon } from '../../../assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';
   import { CalendarRegularBoldIcon } from '../../../assets/icons/figma/regular-bold/CalendarRegularBoldIcon';
   ```

2. **Utilisation avec les props width, height et color**:
   ```tsx
   <ArrowLeftRegularBoldIcon width={24} height={24} color={textColor} />
   ```

3. **Création de fonctions d'aide pour les sélecteurs d'icônes**:
   ```tsx
   // Exemple tiré de DrinkTypeSelector.tsx
   const renderCupSizeIcon = (iconType: CupSize['icon'], isSelected: boolean) => {
     const color = isSelected ? primaryColor : '#00A9F1';
     const iconProps = {
       width: 24,
       height: 24,
       color
     };
     
     switch (iconType) {
       case 'waterGlass':
         return <WaterGlassRegularBoldIcon {...iconProps} />;
       // autres cas...
     }
   };
   ```

### ❌ À éviter

1. **Ne pas utiliser le composant Icon avec une prop name**:
   ```tsx
   // INCORRECT
   <Icon name="arrowLeft" size={24} color={textColor} />
   ```

2. **Ne pas créer de placeholders ou de workarounds temporaires**:
   ```tsx
   // INCORRECT
   <View style={{ width: 24, height: 24, backgroundColor: textColor }} />
   ```

## Exemples de référence

Pour voir des implémentations correctes, vous pouvez consulter ces composants:

1. **DrinkTypeSelector.tsx** - Implémentation de sélecteurs d'icônes complexes
2. **CalorieTracker.tsx** - Utilisation d'icônes dans un composant de tracking
3. **TopBar.tsx** - Utilisation d'icônes dans un composant de navigation

## Conseils pour l'intégration

- Maintenez la cohérence dans l'utilisation des styles d'icônes (regular-bold pour les actions principales, etc.)
- Respectez les tailles définies dans Figma pour assurer la fidélité au design
- Pour les icônes interactives, ajoutez un Feedback visuel au toucher
- Utilisez la couleur fournie par le thème pour assurer la compatibilité avec le mode sombre/clair

## Résolution des problèmes courants

Si vous rencontrez l'erreur "Property 'name' does not exist on type 'IntrinsicAttributes & IconProps'", c'est que vous essayez d'utiliser le composant Icon avec une prop name qui n'est pas supportée. Utilisez plutôt l'importation directe de l'icône SVG comme décrit ci-dessus.
