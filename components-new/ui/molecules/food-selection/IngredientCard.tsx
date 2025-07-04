import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '../../atoms/base';
import { IngredientWithStandardOrmProps } from '@/db/schema';
import { DeleteRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DeleteRegularBoldIcon';
import { HandPlatter } from 'lucide-react-native';

interface IngredientCardProps {
  /** Données de l'ingrédient à afficher */
  ingredient: IngredientWithStandardOrmProps;
  /** Callback pour la suppression de l'ingrédient */
  onDelete?: (id: number) => void;
  /** Callback pour la modification de l'ingrédient */
  onPress?: (ingredient: IngredientWithStandardOrmProps) => void;
}

/**
 * Composant IngredientCard
 * Carte d'affichage d'un ingrédient, avec fonctionnalité de swipe pour suppression
 */
const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onDelete,
  onPress,
}) => {
  const theme = useAppTheme();
  const swipeableRef = useRef<Swipeable>(null);

  // Extraction des données de l'ingrédient
  const { id, ingredientsStandard, quantity } = ingredient;
  // Vérification de la structure de l'ingrédient dans la console
  console.log('Ingredient data:', JSON.stringify(ingredient, null, 2));
  
  // Gestionnaire pour le clic sur la carte
  const handlePress = () => {
    if (onPress) {
      onPress(ingredient);
    }
  };

  // Gestionnaire pour la suppression
  const handleDelete = () => {
    if (onDelete && id) {
      onDelete(id);
    }
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  // Rendu du bouton de suppression (visible lors du swipe vers la gauche)
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    if (!onDelete) return null;
    
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });
    
    return (
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          {
            transform: [{ translateX: trans }],
            backgroundColor: '#FF5252', // Rouge pour le bouton de suppression
          },
        ]}
      >
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <DeleteRegularBoldIcon width={24} height={24} color={'#FFFFFF'} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={onDelete ? renderRightActions : undefined}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity 
        style={[
          styles.container, 
          { backgroundColor: '#FFFFFF' }
        ]}
        onPress={onPress ? handlePress : undefined}
        disabled={!onPress}
      >
        {/* Partie gauche avec image et nom */}
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            {ingredientsStandard?.image ? (
              <Image
                source={{ uri: `${ingredientsStandard.image}` }}
                style={styles.ingredientImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fallbackContainer}>
                <HandPlatter width={32} height={32} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>
              {ingredientsStandard?.name || 'Ingrédient'}
            </Text>
            <Text style={styles.detailsText}>
              {ingredientsStandard?.calories || 0} kcal • {quantity || 0}g
            </Text>
          </View>
        </View>
        
        {/* Partie droite avec quantité */}
        <View style={styles.rightSection}>
          <Text style={styles.quantityText}>
            {quantity || 0}g
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A1CE50',
  },
  ingredientImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  fallbackContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#A1CE50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  detailsText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  deleteButtonContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});

export default IngredientCard;
