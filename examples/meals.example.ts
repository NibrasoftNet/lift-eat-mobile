import { Meal } from '../types/plan.type';
import { CuisineType, MeasurementUnit } from '../utils/enum/food.enum';
import { exampleFoods } from './foods.example';

const NOW = new Date('2025-03-01T03:05:57+01:00');

// Images pour les repas
const MEAL_IMAGES = {
    COUSCOUS: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    SALAD: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    SUSHI: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    PASTA: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800'
};

// Helper pour trouver un aliment par son ID
const findFood = (id: string) => exampleFoods.find(f => f.id === id);

export const exampleMeals: Meal[] = [
    {
        id: '1',
        name: 'Couscous Tunisien',
        description: 'Un délicieux couscous traditionnel tunisien avec légumes et agneau',
        calories: 850,
        protein: 45,
        carbs: 100,
        fats: 25,
        cuisineType: CuisineType.ARABIC,
        servings: 4,
        prepTime: 60,
        imageUrl: MEAL_IMAGES.COUSCOUS,
        ingredients: [
            {
                id: '101',
                food: findFood('f001')!,
                quantity: 100,
                unit: MeasurementUnit.GRAM,
                name: 'Semoule Fine',
                calories: 360,
                protein: 12,
                carbs: 73,
                fats: 1
            },
            {
                id: '102',
                food: findFood('f101')!,
                quantity: 150,
                unit: MeasurementUnit.GRAM,
                name: 'Agneau Épaule',
                calories: 330,
                protein: 27,
                carbs: 0,
                fats: 25.5
            }
        ],
        tags: ['Tunisien', 'Traditionnel', 'Copieux', 'Légumes', 'Viande'],
        createdAt: NOW,
        updatedAt: NOW,
        authorId: 'user123'
    },
    {
        id: '2',
        name: 'Salade César',
        description: 'Une salade césar fraîche et croquante avec poulet grillé',
        calories: 450,
        protein: 35,
        carbs: 15,
        fats: 30,
        cuisineType: CuisineType.AMERICAN,
        servings: 2,
        prepTime: 15,
        imageUrl: MEAL_IMAGES.SALAD,
        ingredients: [
            {
                id: '201',
                food: findFood('f205')!,
                quantity: 200,
                unit: MeasurementUnit.GRAM,
                name: 'Laitue Romaine',
                calories: 34,
                protein: 2.4,
                carbs: 6.6,
                fats: 0.6
            },
            {
                id: '202',
                food: findFood('f102')!,
                quantity: 150,
                unit: MeasurementUnit.GRAM,
                name: 'Poulet Grillé',
                calories: 247.5,
                protein: 46.5,
                carbs: 0,
                fats: 5.4
            }
        ],
        tags: ['Salade', 'Poulet', 'Healthy', 'Rapide'],
        createdAt: NOW,
        updatedAt: NOW,
        authorId: 'user123'
    },
    {
        id: '3',
        name: 'Sushi Bowl au Saumon',
        description: 'Un bol de sushi déstructuré avec saumon frais et avocat',
        calories: 650,
        protein: 30,
        carbs: 80,
        fats: 25,
        cuisineType: CuisineType.JAPANESE,
        servings: 2,
        prepTime: 25,
        imageUrl: MEAL_IMAGES.SUSHI,
        ingredients: [
            {
                id: '301',
                food: findFood('f002')!,
                quantity: 200,
                unit: MeasurementUnit.GRAM,
                name: 'Riz à Sushi',
                calories: 260,
                protein: 4.4,
                carbs: 57,
                fats: 0.4
            },
            {
                id: '302',
                food: findFood('f103')!,
                quantity: 150,
                unit: MeasurementUnit.GRAM,
                name: 'Saumon Frais',
                calories: 310.5,
                protein: 30.75,
                carbs: 0,
                fats: 20.25
            }
        ],
        tags: ['Japonais', 'Poisson', 'Healthy', 'Bowl'],
        createdAt: NOW,
        updatedAt: NOW,
        authorId: 'user123'
    },
    {
        id: '4',
        name: 'Pasta alla Carbonara',
        description: 'Des pâtes à la carbonara crémeuses et authentiques',
        calories: 800,
        protein: 25,
        carbs: 90,
        fats: 40,
        cuisineType: CuisineType.ITALIAN,
        servings: 4,
        prepTime: 20,
        imageUrl: MEAL_IMAGES.PASTA,
        ingredients: [
            {
                id: '401',
                food: findFood('f003')!,
                quantity: 400,
                unit: MeasurementUnit.GRAM,
                name: 'Spaghetti',
                calories: 520,
                protein: 18.4,
                carbs: 104,
                fats: 2.8
            },
            {
                id: '402',
                food: findFood('f104')!,
                quantity: 150,
                unit: MeasurementUnit.GRAM,
                name: 'Pancetta',
                calories: 705,
                protein: 25.5,
                carbs: 0,
                fats: 66
            }
        ],
        tags: ['Italien', 'Pâtes', 'Classique', 'Rapide'],
        createdAt: NOW,
        updatedAt: NOW,
        authorId: 'user123'
    }
];
