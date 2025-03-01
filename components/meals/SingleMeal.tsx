import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '../ThemedView';
import { exampleMeals } from '../../examples/meals.example';
import { Meal, MealIngredient } from '../../types/plan.type';

export const SingleMeal = () => {
    // Pour l'exemple, on prend le premier repas
    const meal = exampleMeals[0];

    // Fonction pour calculer les valeurs nutritionnelles par portion
    const calculateNutritionPerServing = (value: number): number => {
        return value / meal.servings;
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{meal.name}</Text>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Nutritionnelles</Text>
                    <View style={styles.nutritionInfo}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {calculateNutritionPerServing(meal.calories).toFixed(0)}
                            </Text>
                            <Text style={styles.nutritionLabel}>Calories</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {calculateNutritionPerServing(meal.protein).toFixed(1)}g
                            </Text>
                            <Text style={styles.nutritionLabel}>Protéines</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {calculateNutritionPerServing(meal.carbs).toFixed(1)}g
                            </Text>
                            <Text style={styles.nutritionLabel}>Glucides</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {calculateNutritionPerServing(meal.fats).toFixed(1)}g
                            </Text>
                            <Text style={styles.nutritionLabel}>Lipides</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingrédients</Text>
                    {meal.ingredients.map((ingredient: MealIngredient) => (
                        <View key={ingredient.id} style={styles.ingredientItem}>
                            <Text style={styles.ingredientName}>{ingredient.food.name}</Text>
                            <Text style={styles.ingredientQuantity}>
                                {ingredient.quantity} {ingredient.unit}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Détails</Text>
                    <Text>Type de cuisine: {meal.cuisineType}</Text>
                    <Text>Portions: {meal.servings}</Text>
                    {meal.prepTime && <Text>Temps de préparation: {meal.prepTime} min</Text>}
                </View>
            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    nutritionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
    nutritionLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    ingredientName: {
        flex: 1,
    },
    ingredientQuantity: {
        color: '#666',
    },
});
