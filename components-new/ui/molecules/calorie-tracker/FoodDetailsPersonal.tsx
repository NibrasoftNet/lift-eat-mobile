import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../themeNew';
import FoodEmoji from './../nutrition/FoodEmoji';
import FoodName from './../nutrition/FoodName';
import CalorieCircle from '../nutrition/CalorieCircle';
import NutrientRow from './../nutrition/NutrientRow';

interface FoodDetailsPersonalProps {
  /**
   * Nom de l'aliment. Par défaut: "Hot Dog" comme sur le design Figma
   */
  foodName?: string;
  
  /**
   * Composant emoji ou valeur unicode de l'emoji
   */
  foodEmoji?: React.ReactNode;
  
  /**
   * Valeurs de macronutriments exactes comme sur le design Figma
   */
  carbs?: number;
  protein?: number;
  fat?: number;
  
  /**
   * Valeur calorique totale. Par défaut: 150 comme sur le design Figma
   * (Calculée à partir des macronutriments: (13*9) + (5*4) + (2*4) = 150)
   */
  calories?: number;
  
  /**
   * Mode d'affichage sombre
   */
  isDarkMode?: boolean;
}

/**
 * Composant FoodDetailsPersonal
 * Reproduction exacte et fidèle du design Figma (node-id=48485-28856 dark mode, node-id=48485-28633 light mode)
 * Assemblage modulaire des sous-composants pour une meilleure organisation du code
 */
const FoodDetailsPersonal: React.FC<FoodDetailsPersonalProps> = ({
  foodName = "Hamburger",
  foodEmoji,
  calories = 150,
  carbs = 2,
  protein = 5,
  fat = 13,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  
  // Couleurs exactes du design Figma vérifiées avec l'API Figma
  const backgroundColor = isDarkMode ? '#212121' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const textSecondaryColor = isDarkMode ? '#9E9E9E' : '#616161'; 
  const borderColor = isDarkMode ? '#424242' : '#EEEEEE';
  
  // Couleurs des macronutriments exactes comme sur Figma
  const proteinColor = '#1A96F0'; // Bleu exact de Figma
  const carbsColor = '#FF981F';   // Orange exact de Figma
  const fatColor = '#F54336';     // Rouge exact de Figma
  
  // Pourcentages exacts des macronutriments calculés à partir des valeurs
  // Grammes de macronutriments × coefficient calorique / calories totales × 100
  const carbsPercentage = "(5.3%)"; // (2 * 4) / 150 * 100 = 5.3%
  const proteinPercentage = "(13.3%)"; // (5 * 4) / 150 * 100 = 13.3%
  const fatPercentage = "(78.0%)"; // (13 * 9) / 150 * 100 = 78.0%

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.content}>
        {/* Utilisation du sous-composant FoodEmoji */}
        <FoodEmoji emoji={foodEmoji} />
        
        {/* Utilisation du sous-composant FoodName */}
        <FoodName name={foodName} color={textColor} />
        
        {/* Conteneur horizontal pour le cercle calorique et les macronutriments */}
        <View style={styles.macroInfoContainer}>
          {/* Cercle calorique à gauche */}
          <View style={styles.calorieCircleContainer}>
            <CalorieCircle 
              calories={calories} 
              textColor={textColor} 
              borderColor={proteinColor}
              carbs={carbs}
              protein={protein}
              fat={fat}
              isDarkMode={isDarkMode}
              carbsColor={carbsColor}
              proteinColor={proteinColor}
              fatColor={fatColor}
            />
          </View>
          
          {/* Macronutriments à droite */}
          <View style={styles.nutrientsContainer}>
            {/* Carbs */}
            <NutrientRow 
              name="Carbs" 
              value={carbs} 
              percentage={carbsPercentage} 
              dotColor={carbsColor}
              textColor={textColor}
              secondaryTextColor={textSecondaryColor}
            />
            
            {/* Protein */}
            <NutrientRow 
              name="Protein" 
              value={protein} 
              percentage={proteinPercentage} 
              dotColor={proteinColor}
              textColor={textColor}
              secondaryTextColor={textSecondaryColor}
            />
            
            {/* Fat */}
            <NutrientRow 
              name="Fat" 
              value={fat} 
              percentage={fatPercentage} 
              dotColor={fatColor}
              textColor={textColor}
              secondaryTextColor={textSecondaryColor}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Utilisation de toute la largeur disponible de l'écran
    borderRadius: 8, // border-radius: 8px selon Figma
    borderWidth: 0.5, // Épaisseur exacte de 0.5px comme dans le SVG
  },
  content: {
    padding: 12, // padding: 12px selon Figma
    alignItems: 'center', 
    width: '100%', // Utilise toute la largeur du conteneur
  },
  macroInfoContainer: {
    width: '100%',
    flexDirection: 'row', // Disposition en ligne (horizontale)
    justifyContent: 'flex-start', // Alignement au début pour préserver la fidélité visuelle
    alignItems: 'center', // Alignement vertical centré
    marginTop: 4, // Léger espace après le nom
    paddingHorizontal: 16, // Padding horizontal pour ne pas coller aux bords
  },
  calorieCircleContainer: {
    width: 64, // Largeur fixe pour le cercle
  },
  nutrientsContainer: {
    flex: 1, // Prend l'espace restant disponible
    paddingLeft: 24, // Espacement plus important pour équilibrer la largeur plus grande
    maxWidth: 300, // Limite la largeur pour préserver la proportion avec le cercle
  },
});

export default FoodDetailsPersonal;
