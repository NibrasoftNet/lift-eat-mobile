import {
  GenderEnum,
  PhysicalActivityEnum,
} from '../utils/enum/user-gender-activity.enum';
import {
  GoalEnum,
  HeightUnitEnum,
  WeightUnitEnum,
} from '../utils/enum/user-details.enum';
import {
  DailyPlanOrmProps,
  IngredientStandardOrmProps,
  MealOrmProps,
  PlanOrmProps,
  UserOrmPros,
} from './schema';
import {
  CuisineTypeEnum,
  MealTypeEnum,
  MealUnitEnum,
} from '../utils/enum/meal.enum';
import {
  DailyPlanGeneratedWithEnum,
  DayEnum,
  PlanGeneratedWithEnum,
  ProviderEnum,
  RoleEnum,
} from '../utils/enum/general.enum';

import cerealesEtPates from './Céréales-et-Pâtes';
import volailles from './Volailles';
import viandesEtAbats from './Viandes-et-abats';
import theCafeEau from './Thé-café-et-eau';
import sucreEtProduitsSucres from './Sucre-et-produits-sucrés';
import pommeDeTerre from './pomme-de-terre';
import poissonsFruitsDeMer from './Poissons-et-fruits-de-mer';
import oeufs from './Oeufs';
import legumesSecs from './Légumes-secs';
import legumesFraisEtTransformes from './Légumes-frais-et-transformés';
import laitEtDerives from './Lait-et-dérivés';
import huilesEtCorpsGras from './Huiles-et-corps-gras';
import grainesOleagineuses from './Graines-oléagineuses';
import fruitsEtJusDeFruits from './Fruits-et-jus-de-fruits';
import condimentsEtSauces from './Condiments-et-sauces';
import { i } from '@clerk/clerk-react/dist/useAuth-DN6TRwS8';

export const usersSeed: Omit<UserOrmPros, 'id' | 'createdAt' | 'updatedAt'>[] =
  [
    {
      name: 'User 1',
      email: 'test1@test.com',
      gender: GenderEnum.MALE,
      height: 160,
      heightUnit: HeightUnitEnum.CM,
      weight: 60,
      weightUnit: WeightUnitEnum.KG,
      profileImage: null,
      physicalActivity: PhysicalActivityEnum.LOW,
      score: 0,
      provider: ProviderEnum.email,
      clerkId: null,
      role: RoleEnum.USER,
      age: 20,
    },
    {
      name: 'Khalil',
      email: 'Khalil@test.com',
      gender: GenderEnum.FEMALE,
      height: 165,
      heightUnit: HeightUnitEnum.CM,
      weight: 55,
      weightUnit: WeightUnitEnum.KG,
      profileImage: null,
      physicalActivity: PhysicalActivityEnum.LOW,
      score: 0,
      provider: ProviderEnum.email,
      clerkId: null,
      role: RoleEnum.USER,
      age: 100,
    },
    {
      name: 'Alice',
      email: 'alice@example.com',
      gender: GenderEnum.FEMALE,
      weight: 55,
      weightUnit: WeightUnitEnum.KG,
      height: 160,
      heightUnit: HeightUnitEnum.CM,
      profileImage: null,
      physicalActivity: PhysicalActivityEnum.MODERATE,
      score: 0,
      provider: ProviderEnum.email,
      clerkId: null,
      role: RoleEnum.USER,
      age: 20,
    },
  ];

export const ingredientsStandardSeed: Omit<
  IngredientStandardOrmProps,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  ...cerealesEtPates,
  ...volailles,
  ...viandesEtAbats,
  ...theCafeEau,
  ...sucreEtProduitsSucres,
  ...pommeDeTerre,
  ...poissonsFruitsDeMer,
  ...oeufs,
  ...legumesSecs,
  ...legumesFraisEtTransformes,
  ...laitEtDerives,
  ...huilesEtCorpsGras,
  ...grainesOleagineuses,
  ...fruitsEtJusDeFruits,
  ...condimentsEtSauces,
] as unknown as Omit<
  IngredientStandardOrmProps,
  'id' | 'createdAt' | 'updatedAt'
>[];

// Définition des meals seed pour l'initialisation de la base de données
export const mealsSeed: Omit<
  MealOrmProps,
  'id' | 'createdAt' | 'updatedAt' | 'creatorId'

>[] = [
  {
    type: MealTypeEnum.LUNCH,
    name: 'Couscous Tunisien',
    description: 'Couscous aux légumes, pois chiches et viande',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 120,
    carbs: 23,
    fat: 1.5,
    protein: 4,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.DINNER,
    name: 'Ojja Merguez',
    description: 'Œufs pochés dans une sauce tomate épicée avec merguez',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 180,
    carbs: 6,
    fat: 14,
    protein: 10,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.BREAKFAST,
    name: 'Lablabi',
    description: "Soupe de pois chiches pimentée à l'ail et au cumin", 
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 90,
    carbs: 13,
    fat: 2,
    protein: 5,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.SNACK,
    name: 'Brik à l’œuf',
    description: "Feuille de brick garnie d'œuf et thon, frite", 
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 230,
    carbs: 14,
    fat: 15,
    protein: 9,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.LUNCH,
    name: 'Kafteji',
    description: 'Mélange frit de légumes (courge, poivron, tomate) et œuf',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 160,
    carbs: 10,
    fat: 11,
    protein: 4,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.SNACK,
    name: 'Salade Mechouia',
    description: 'Salade grillée de poivrons, tomates et oignons',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 70,
    carbs: 9,
    fat: 3,
    protein: 2,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.DINNER,
    name: 'Chorba Frik',
    description: 'Soupe de blé vert (frik) et viande épicée',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 85,
    carbs: 12,
    fat: 2,
    protein: 5,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.LUNCH,
    name: 'Makrouna Sauce Rouge',
    description: 'Pâtes tunisiennes à la sauce tomate pimentée',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 150,
    carbs: 25,
    fat: 4,
    protein: 5,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.DINNER,
    name: 'Mloukhia',
    description: 'Ragoût sombre de corète potagère et viande',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 130,
    carbs: 5,
    fat: 10,
    protein: 4,
    image: null,
    isFavorite: false,
  },
  {
    type: MealTypeEnum.SNACK,
    name: 'Tajine Malsouka',
    description: 'Tortilla tunisienne aux œufs, viande et légumes',
    cuisine: CuisineTypeEnum.TUNISIAN,
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 180,
    carbs: 8,
    fat: 13,
    protein: 9,
    image: null,
    isFavorite: false,
  },
];

// Plans seed pour l'initialisation de la base de données
export const planSeed: Omit<
  PlanOrmProps,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>[] = [
  {
    name: 'Demo Plan',
    goal: GoalEnum.MAINTAIN,
    unit: WeightUnitEnum.KG,
    initialWeight: 70,
    targetWeight: 70,
    public: true,
    current: true,
    completed: false,
    durationWeeks: 4,
    startDate: new Date().toISOString().split('T')[0],
    calories: 2000,
    carbs: 250,
    fat: 70,
    protein: 150,
    type: PlanGeneratedWithEnum.MANUAL,
  },
];

// Daily plans pour le plan hebdomadaire
// Génère 7 jours de DailyPlan à partir d'une date de début (aujourd'hui par défaut)
function generateDailyPlanSeed(startDate: Date = new Date()): Omit<
  DailyPlanOrmProps,
  'id' | 'createdAt' | 'updatedAt' | 'planId'
>[] {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const dayEnums: DayEnum[] = [
    DayEnum.MONDAY,
    DayEnum.TUESDAY,
    DayEnum.WEDNESDAY,
    DayEnum.THURSDAY,
    DayEnum.FRIDAY,
    DayEnum.SATURDAY,
    DayEnum.SUNDAY,
  ];

  return [...Array(7)].map((_, i) => {
    const current = new Date(startDate.getTime() + i * ONE_DAY);
    const isoDate = current.toISOString().split('T')[0]; // YYYY-MM-DD

    return {
      date: isoDate,
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      type: DailyPlanGeneratedWithEnum.MANUAL,
      day: dayEnums[current.getDay() === 0 ? 6 : current.getDay() - 1], // JS getDay: 0=Sun
    } as Omit<DailyPlanOrmProps,
      'id' | 'createdAt' | 'updatedAt' | 'planId'>;
  });
}

export const dailyPlanSeed: Omit<
  DailyPlanOrmProps,
  'id' | 'createdAt' | 'updatedAt' | 'planId'
>[] = generateDailyPlanSeed();
