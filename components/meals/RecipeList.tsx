import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Recipe } from '../../types/recipe.type';
import { exampleRecipes } from '../../examples/recipes.example';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface RecipeListProps {
    onRecipePress?: (recipe: Recipe) => void;
}

const RecipeItem = ({ recipe, onPress }: { recipe: Recipe; onPress?: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.recipeCard}>
            {recipe.imageUrl ? (
                <Image source={recipe.imageUrl} style={styles.recipeImage} />
            ) : (
                <View style={[styles.recipeImage, styles.placeholderImage]}>
                    <Ionicons name="restaurant" size={40} color="#ddd" />
                </View>
            )}
            
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.recipeInfo}
            >
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <View style={styles.recipeDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time" size={16} color="#fff" />
                        <Text style={styles.detailText}>
                            {recipe.prepTime} min
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="restaurant" size={16} color="#fff" />
                        <Text style={styles.detailText}>
                            {recipe.servings} portions
                        </Text>
                    </View>
                </View>
                
                <View style={styles.nutritionInfo}>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>
                            {(recipe.calories / recipe.servings).toFixed(0)}
                        </Text>
                        <Text style={styles.nutritionLabel}>Cal</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>
                            {(recipe.protein / recipe.servings).toFixed(1)}g
                        </Text>
                        <Text style={styles.nutritionLabel}>Prot</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>
                            {(recipe.carbs / recipe.servings).toFixed(1)}g
                        </Text>
                        <Text style={styles.nutritionLabel}>Carb</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>
                            {(recipe.fats / recipe.servings).toFixed(1)}g
                        </Text>
                        <Text style={styles.nutritionLabel}>Lip</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export const RecipeList: React.FC<RecipeListProps> = ({ onRecipePress }) => {
    return (
        <FlatList
            data={exampleRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <RecipeItem
                    recipe={item}
                    onPress={() => onRecipePress?.(item)}
                />
            )}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    recipeCard: {
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
    recipeImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    placeholderImage: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    recipeName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    recipeDetails: {
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
});
