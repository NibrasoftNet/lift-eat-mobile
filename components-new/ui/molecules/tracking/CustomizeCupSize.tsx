import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box } from '../../atoms/base';

// Types pour les tailles de portions d'eau
export type CupSize = {
  id: string;
  value: number; // en ml
  label: string;
};

// Props du composant
interface CustomizeCupSizeProps {
  /**
   * Mode d'affichage (sombre ou clair)
   * Corresponds au variant "Dark" dans Figma
   */
  dark?: boolean;
  /**
   * Tailles de portions disponibles
   */
  cupSizes: CupSize[];
  /**
   * Taille actuellement sélectionnée
   */
  selectedSize?: string;
  /**
   * Callback quand une taille est sélectionnée
   */
  onSelectSize: (sizeId: string) => void;
}

/**
 * Composant CustomizeCupSize du Water Tracker
 * Permet à l'utilisateur de sélectionner parmi différentes tailles de portions d'eau
 *
 * node-id=48500-33104 (Dark=False) et équivalent sombre
 */
export const CustomizeCupSize: React.FC<CustomizeCupSizeProps> = ({
  dark = false,
  cupSizes = [],
  selectedSize,
  onSelectSize,
}) => {
  const theme = useAppTheme();

  // Utilisation correcte du thème selon la structure vérifiée
  // Les couleurs sont accessibles via theme.color('key')
  const backgroundColor = dark
    ? theme.color('backgroundGrey') // Fond gris foncé pour le mode sombre
    : theme.color('background'); // Fond clair par défaut

  // Pour le texte, utilisons des couleurs qui existent dans la palette
  const textColor = dark
    ? '#FFFFFF' // Texte blanc pour le mode sombre (non défini dans le thème)
    : '#121212'; // Texte foncé pour le mode clair (non défini dans le thème)

  // Couleur principale définie dans le thème
  const primaryColor = theme.color('primary');

  return (
    <Box style={[styles.container, { backgroundColor }]}>
      {/* Titre de la section */}
      <Text style={[styles.title, { color: textColor }]}>Quick Add</Text>

      {/* Grid de boutons pour les tailles */}
      <View style={styles.sizesGrid}>
        {cupSizes.map((size) => {
          const isSelected = size.id === selectedSize;
          const buttonBgColor = isSelected ? primaryColor : 'transparent';
          const buttonTextColor = isSelected ? '#FFFFFF' : textColor;
          const buttonBorderColor = isSelected
            ? primaryColor
            : 'rgba(0, 0, 0, 0.1)';

          return (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.sizeButton,
                {
                  backgroundColor: buttonBgColor,
                  borderColor: buttonBorderColor,
                },
              ]}
              onPress={() => onSelectSize(size.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sizeValue, { color: buttonTextColor }]}>
                {size.value}
              </Text>
              <Text style={[styles.sizeUnit, { color: buttonTextColor }]}>
                ml
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bouton d'ajout personnalisé */}
      <TouchableOpacity
        style={[styles.customButton, { borderColor: 'rgba(0, 0, 0, 0.1)' }]}
        onPress={() => {
          /* Navigation vers écran personnalisé */
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.customButtonText, { color: primaryColor }]}>
          Add More
        </Text>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16, // Basé sur la variable Figma rectangleCornerRadii
    padding: 16, // Basé sur la variable Figma paddingAll
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)', // Bordure légère basée sur les strokes Figma
  },
  title: {
    fontSize: 17,
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600',
    marginBottom: 16,
  },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sizeButton: {
    width: (Dimensions.get('window').width - 80) / 4, // Calcul pour 4 boutons par ligne avec espace
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sizeValue: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
  },
  sizeUnit: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    opacity: 0.8,
  },
  customButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  customButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
  },
});

export default CustomizeCupSize;
