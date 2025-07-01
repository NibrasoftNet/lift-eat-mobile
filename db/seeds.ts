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
>[] = ([
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
] as unknown as Omit<IngredientStandardOrmProps, 'id' | 'createdAt' | 'updatedAt'>[]);

// Définition des meals seed pour l'initialisation de la base de données
export const mealsSeed: Omit<MealOrmProps, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>[] = [
  {
    name: "Salade César",
    calories: 550,
    carbs: 10,
    fat: 44,
    protein: 30,
    description: "Salade César classique avec poulet grillé, croûtons et parmesan",
    cuisine: CuisineTypeEnum.AMERICAN,
    type: MealTypeEnum.LUNCH,
    quantity: 200,
    unit: MealUnitEnum.GRAMMES,
    image: null
  },
  {
    name: "Couscous aux légumes",
    calories: 450,
    carbs: 80,
    fat: 10,
    protein: 12,
    description: "Couscous traditionnel aux légumes de saison avec carottes, courgettes et pois chiches",
    cuisine: CuisineTypeEnum.AFRICAN,
    type: MealTypeEnum.DINNER,
    quantity: 300,
    unit: MealUnitEnum.GRAMMES,
    image: null
  },
  {
    name: "Sushi Bowl",
    calories: 400,
    carbs: 65,
    fat: 8,
    protein: 25,
    description: "Bowl de riz à sushi avec saumon, avocat et légumes croquants",
    cuisine: CuisineTypeEnum.ASIAN,
    type: MealTypeEnum.DINNER,
    quantity: 250,
    unit: MealUnitEnum.GRAMMES,
    image: null
  },
  {
    name: "Omelette protéinée",
    calories: 320,
    carbs: 5,
    fat: 22,
    protein: 28,
    description: "Omelette riche en protéines avec épinards et fromage feta",
    cuisine: CuisineTypeEnum.EUROPEAN,
    type: MealTypeEnum.BREAKFAST,
    quantity: 150,
    unit: MealUnitEnum.GRAMMES,
    image: null
  },
  {
    name: "Smoothie protéiné aux fruits rouges",
    calories: 280,
    carbs: 30,
    fat: 5,
    protein: 25,
    description: "Smoothie riche en protéines avec fruits rouges et yaourt grec",
    cuisine: CuisineTypeEnum.GENERAL,
    type: MealTypeEnum.SNACK,
    quantity: 300,
    unit: MealUnitEnum.MILLILITRES,
    image: null
  }
];

// Plans seed pour l'initialisation de la base de données
export const planSeed: Omit<PlanOrmProps, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] = [
  {
    name: "Plan pour prise de masse 1",
    goal: GoalEnum.GAIN_MUSCLE,
    targetWeight: 62,
    unit: WeightUnitEnum.KG,
    initialWeight: 60,
    public: true,
    current: true,
    completed: false,
    durationWeeks: 1,
    type: PlanGeneratedWithEnum.AI,
    calories: 2850,
    carbs: 350,
    fat: 80,
    protein: 143
  }
];

// Daily plans pour le plan hebdomadaire
export const dailyPlanSeed: Omit<DailyPlanOrmProps, 'id' | 'createdAt' | 'updatedAt' | 'planId'>[] = [
  {
    day: DayEnum.MONDAY,
    calories: 2800,
    carbs: 350,
    fat: 78,
    protein: 140,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  },
  {
    day: DayEnum.TUESDAY,
    calories: 2850,
    carbs: 340,
    fat: 83,
    protein: 142,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  },
  {
    day: DayEnum.WEDNESDAY,
    calories: 2900,
    carbs: 360,
    fat: 80,
    protein: 145,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  },
  {
    day: DayEnum.THURSDAY,
    calories: 2750,
    carbs: 330,
    fat: 77,
    protein: 138,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  },
  {
    day: DayEnum.FRIDAY,
    calories: 2950,
    carbs: 370,
    fat: 82,
    protein: 148,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  },
  {
    day: DayEnum.SATURDAY,
    calories: 3000,
    carbs: 380,
    fat: 85,
    protein: 150,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  },
  {
    day: DayEnum.SUNDAY,
    calories: 2700,
    carbs: 320,
    fat: 75,
    protein: 135,
    type: DailyPlanGeneratedWithEnum.AI,
    week: 1
  }
];
