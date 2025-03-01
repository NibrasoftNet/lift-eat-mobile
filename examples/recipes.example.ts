import { Recipe } from '../types/recipe.type';
import { CuisineType, DifficultyLevel, FoodCategory, MeasurementUnit } from '../utils/enum/food.enum';

const NOW = new Date('2025-03-01T02:32:37+01:00');

const tajineImage = require('../assets/images/foods/chicken.webp');
const saumonImage = require('../assets/images/foods/salmon.jpg');

export const exampleRecipes: Recipe[] = [
    {
        id: '1',
        name: 'Tajine de Poulet aux Olives',
        description: 'Un délicieux tajine marocain avec du poulet tendre et des olives parfumées',
        prepTime: 30,
        cookTime: 60,
        servings: 4,
        difficulty: DifficultyLevel.INTERMEDIATE,
        cuisineType: CuisineType.ARABIC,
        calories: 450,
        protein: 35,
        carbs: 30,
        fats: 20,
        ingredients: [
            {
                id: '1',
                food: {
                    id: '1',
                    name: 'Poulet',
                    calories: 165,
                    protein: 31,
                    carbs: 0,
                    fats: 3.6,
                    portion: 100,
                    servingSize: 100,
                    unit: MeasurementUnit.GRAM,
                    category: FoodCategory.PROTEIN,
                    verified: true,
                    createdAt: NOW,
                    updatedAt: NOW
                },
                quantity: 800,
                unit: MeasurementUnit.GRAM,
                notes: 'Coupé en morceaux'
            },
            {
                id: '2',
                food: {
                    id: '2',
                    name: 'Olives vertes',
                    calories: 145,
                    protein: 1,
                    carbs: 4,
                    fats: 15,
                    portion: 100,
                    servingSize: 100,
                    unit: MeasurementUnit.GRAM,
                    category: FoodCategory.VEGETABLES,
                    verified: true,
                    createdAt: NOW,
                    updatedAt: NOW
                },
                quantity: 200,
                unit: MeasurementUnit.GRAM
            }
        ],
        instructions: [
            'Faire mariner le poulet avec les épices pendant 2 heures',
            'Faire revenir les oignons dans l\'huile d\'olive',
            'Ajouter le poulet et faire dorer',
            'Ajouter les olives et le citron confit',
            'Laisser mijoter à feu doux pendant 1 heure'
        ],
        imageUrl: tajineImage,
        tags: ['Marocain', 'Poulet', 'Mijoté'],
        rating: 4.5,
        createdAt: NOW,
        updatedAt: NOW,
        authorId: 'user123'
    },
    {
        id: '2',
        name: 'Saumon en Papillote',
        description: 'Saumon cuit en papillote avec des légumes de saison',
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        difficulty: DifficultyLevel.EASY,
        cuisineType: CuisineType.FRENCH,
        calories: 350,
        protein: 28,
        carbs: 12,
        fats: 22,
        ingredients: [
            {
                id: '1',
                food: {
                    id: '3',
                    name: 'Saumon',
                    calories: 208,
                    protein: 22,
                    carbs: 0,
                    fats: 13,
                    portion: 100,
                    servingSize: 100,
                    unit: MeasurementUnit.GRAM,
                    category: FoodCategory.PROTEIN,
                    verified: true,
                    createdAt: NOW,
                    updatedAt: NOW
                },
                quantity: 300,
                unit: MeasurementUnit.GRAM,
                notes: 'En filets'
            },
            {
                id: '2',
                food: {
                    id: '4',
                    name: 'Courgettes',
                    calories: 17,
                    protein: 1.2,
                    carbs: 3.1,
                    fats: 0.3,
                    portion: 100,
                    servingSize: 100,
                    unit: MeasurementUnit.GRAM,
                    category: FoodCategory.VEGETABLES,
                    verified: true,
                    createdAt: NOW,
                    updatedAt: NOW
                },
                quantity: 200,
                unit: MeasurementUnit.GRAM,
                notes: 'En julienne'
            }
        ],
        instructions: [
            'Préchauffer le four à 180°C',
            'Préparer les papillotes avec du papier sulfurisé',
            'Disposer les légumes puis le saumon',
            'Assaisonner et fermer les papillotes',
            'Cuire au four pendant 20 minutes'
        ],
        imageUrl: saumonImage,
        tags: ['Poisson', 'Léger', 'Four'],
        rating: 4.8,
        createdAt: NOW,
        updatedAt: NOW,
        authorId: 'user123'
    }
];
