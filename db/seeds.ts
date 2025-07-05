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
>[] = [];

// Plans seed pour l'initialisation de la base de données
export const planSeed: Omit<
  PlanOrmProps,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>[] = [];

// Daily plans pour le plan hebdomadaire
export const dailyPlanSeed: Omit<
  DailyPlanOrmProps,
  'id' | 'createdAt' | 'updatedAt' | 'planId'
>[] = [];
