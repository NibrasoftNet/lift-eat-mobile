import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Box, VStack, HStack, Divider, useTheme as useNativeBaseTheme } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme as useNavigationTheme } from '@react-navigation/native';
import { Meal, MealIngredient } from '../../types/plan.type';
import { CuisineType, MeasurementUnit, FoodCategory } from '../../utils/enum/food.enum';
import { exampleMeals } from '../../examples/meals.example';

const { width } = Dimensions.get('window');
const SPACING = 20;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mealCard: {
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  mealDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    color: '#ddd',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  caloriesContainer: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  caloriesText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mealSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  ingredientsList: {
    marginTop: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#666',
  }
});

interface MealDetailsProps {
  meal: Meal;
  visible: boolean;
  onClose: () => void;
}

const MealDetails = ({ meal, visible, onClose }: MealDetailsProps) => {
  const theme = useNavigationTheme();
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const calculateNutritionPerServing = (value: number) => {
    return value / meal.servings;
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.mealName, { color: '#333' }]}>{meal.name}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesText}>
              {calculateNutritionPerServing(meal.calories).toFixed(0)} kcal
            </Text>
          </View>

          <Text style={styles.mealSubtitle}>
            {meal.servings} portions • {meal.prepTime} min de préparation
          </Text>

          <View style={styles.divider} />

          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Glucides</Text>
              <Text style={styles.macroValue}>
                {calculateNutritionPerServing(meal.carbs).toFixed(1)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Lipides</Text>
              <Text style={styles.macroValue}>
                {calculateNutritionPerServing(meal.fats).toFixed(1)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Protéines</Text>
              <Text style={styles.macroValue}>
                {calculateNutritionPerServing(meal.protein).toFixed(1)}g
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.ingredientsList}>
            <Text style={[styles.mealName, { color: '#333', marginBottom: 8 }]}>
              Ingrédients
            </Text>
            {meal.ingredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientQuantity}>
                  {ingredient.quantity}{ingredient.unit}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const MealItem = ({ meal }: { meal: Meal }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.mealCard}
        onPress={() => setIsModalVisible(true)}
      >
        {meal.imageUrl ? (
          <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} resizeMode="cover" />
        ) : (
          <View style={[styles.mealImage, styles.placeholderImage]}>
            <Ionicons name="restaurant" size={40} color="#ddd" />
          </View>
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.mealInfo}
        >
          <Text style={styles.mealName}>{meal.name}</Text>
          <View style={styles.mealDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={16} color="#fff" />
              <Text style={styles.detailText}>
                {meal.prepTime} min
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="restaurant" size={16} color="#fff" />
              <Text style={styles.detailText}>
                {meal.servings} portions
              </Text>
            </View>
          </View>
          
          <View style={styles.nutritionInfo}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {(meal.calories / meal.servings).toFixed(0)}
              </Text>
              <Text style={styles.nutritionLabel}>Cal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {(meal.protein / meal.servings).toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Prot</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {(meal.carbs / meal.servings).toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Carb</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {(meal.fats / meal.servings).toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Lip</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <MealDetails
        meal={meal}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

const MealsList = () => {
  const [meals, setMeals] = useState<Meal[]>(exampleMeals);
  const navigationTheme = useNavigationTheme();

  return (
    <Box flex={1} bg={navigationTheme.colors.background}>
      <FlashList
        data={meals}
        renderItem={({ item }) => <MealItem meal={item} />}
        estimatedItemSize={200}
        contentContainerStyle={styles.container}
      />
    </Box>
  );
};

export default MealsList;
