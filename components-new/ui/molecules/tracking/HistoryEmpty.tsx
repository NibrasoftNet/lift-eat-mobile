import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box } from '../../atoms/base';
import { ArrowRightRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowRightRegularBoldIcon';

// Définition des props avec typage TypeScript
interface HistoryEmptyProps {
  /**
   * Mode d'affichage (sombre ou clair)
   * Corresponds au variant "Dark" dans Figma (ID: 48500:35707 pour Dark=True, 48500:35708 pour Dark=False)
   */
  dark?: boolean;
  /**
   * Callback lorsque l'utilisateur clique sur "View all"
   */
  onViewAll?: () => void;
}

/**
 * Composant HistoryEmpty du Water Tracker
 * Affiche l'état vide de l'historique avec un en-tête "History" et un bouton "View all"
 * 
 * node-id=48500-35707 (Dark=True) et node-id=48500-35708 (Dark=False)
 */
export const HistoryEmpty: React.FC<HistoryEmptyProps> = ({ 
  dark = false, 
  onViewAll 
}) => {
  const theme = useAppTheme();
  
  // Utilisation correcte du thème selon la structure vérifiée
  // Les couleurs sont accessibles via theme.color('key')
  const backgroundColor = dark
    ? theme.color('backgroundGrey')  // Fond gris foncé pour le mode sombre
    : theme.color('background');     // Fond clair par défaut
    
  // Pour le texte, utilisons des couleurs qui existent dans la palette
  const textColor = dark
    ? '#FFFFFF'  // Texte blanc pour le mode sombre (non défini dans le thème)
    : '#121212'; // Texte foncé pour le mode clair (non défini dans le thème)
  
  // Couleur principale définie dans le thème
  const accentColor = theme.color('primary');
  
  return (
    <Box 
      style={[
        styles.container, 
        { backgroundColor }
      ]}
    >
      {/* History Header Section */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>History</Text>
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={[styles.viewAllText, { color: accentColor }]}>View all</Text>
          <ArrowRightRegularBoldIcon
            width={16}
            height={16}
            color={accentColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      
      {/* Empty State Message */}
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: textColor }]}>
          You have no history of water intake today.
        </Text>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16, // Basé sur la variable Figma rectangleCornerRadii
    padding: 16,      // Basé sur la variable Figma paddingAll
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)' // Bordure légère basée sur les strokes Figma
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 17,
    fontFamily: 'Urbanist-SemiBold',
    fontWeight: '600'
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    marginRight: 4
  },
  icon: {
    marginLeft: 2
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    textAlign: 'center',
    opacity: 0.7
  }
});

export default HistoryEmpty;
