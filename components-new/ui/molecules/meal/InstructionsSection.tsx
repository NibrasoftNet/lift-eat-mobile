import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../../atoms/base';
import { useTheme } from '../../../../themeNew';
import { InfoCircleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/InfoCircleRegularBoldIcon';

interface InstructionsSectionProps {
  /** Instructions de préparation */
  instructions: string;
  /** Mode d'affichage sombre */
  isDarkMode?: boolean;
  /** Titre de la section */
  title?: string;
  /** Hauteur maximale */
  maxHeight?: number;
}

/**
 * Composant InstructionsSection
 * Affiche les instructions de préparation d'un repas
 * Respecte strictement la convention d'importation des icônes SVG
 */
const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructions,
  isDarkMode = false,
  title = "Instructions de préparation",
  maxHeight = 300,
}) => {
  const theme = useTheme();
  
  // Couleurs selon le thème
  const backgroundColor = isDarkMode ? '#1F222A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDarkMode ? '#CDCDCD' : '#757575';
  const borderColor = isDarkMode ? '#35383F' : '#EEEEEE';
  const iconColor = isDarkMode ? '#FFFFFF' : '#212121';
  
  // Formatter les instructions (ajouter des sauts de ligne si nécessaire)
  const formatInstructions = (text: string) => {
    // Si le texte contient déjà des sauts de ligne, on les conserve
    if (text.includes('\n')) return text;
    
    // Sinon, on essaie d'ajouter des sauts de ligne après chaque phrase
    return text.replace(/\.\s+/g, '.\n\n');
  };
  
  const formattedInstructions = formatInstructions(instructions);
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* En-tête de la section */}
      <View style={styles.header}>
        <InfoCircleRegularBoldIcon width={20} height={20} color={iconColor} />
        <Text style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
      </View>
      
      {/* Instructions */}
      {instructions ? (
        <ScrollView 
          style={[styles.instructionsScroll, { maxHeight }]}
          contentContainerStyle={styles.instructionsContainer}
        >
          <Text style={[styles.instructionsText, { color: textColor }]}>
            {formattedInstructions}
          </Text>
        </ScrollView>
      ) : (
        <View style={[styles.instructionsContainer, { borderColor }]}>
          <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
            Aucune instruction disponible
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Urbanist',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
  },
  instructionsScroll: {
    width: '100%',
  },
  instructionsContainer: {
    padding: 12,
    paddingLeft: 4,
  },
  instructionsText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: '#212121',
  },
  emptyText: {
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    padding: 12,
    color: '#757575',
  },
});

export default InstructionsSection;
