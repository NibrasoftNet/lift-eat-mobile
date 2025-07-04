import { UserOrmPros } from '@/db/schema';

// Interface pour les préférences d'interface utilisateur
export interface UIPreferences {
  language?: string;
  theme?: string;
  notifications?: boolean;
}

// Interface pour updateUserPreferencesViaMCP
export interface UpdateUserPreferencesParams {
  userId: number;
  preferences: Partial<{
    age: number;
    gender: string;
    weight: number;
    weightUnit: string;
    height: number;
    heightUnit: string;
    physicalActivity: string;
  }>;
}

// Interface pour les objectifs nutritionnels
export interface NutritionGoalsProps {
  goal?: string; // WEIGHT_LOSS, MAINTAIN, GAIN_MUSCLE
  targetWeight?: number;
  dailyCalories?: number;
  proteinPercentage?: number;
  carbsPercentage?: number;
  fatPercentage?: number;
}

// Interface pour updateUserNutritionPreferencesViaMCP
export interface UpdateUserNutritionPreferencesParams {
  userId: number;
  dietaryRestrictions?: string[];
  allergies?: string[];
  nutritionGoals?: NutritionGoalsProps;
}

export interface UpdateUserPreferencesResult {
  success: boolean;
  error?: string;
}

// Interface pour getUserDetailsViaMCP
export interface GetUserDetailsParams {
  userId: number;
  requestingUserId?: number; // ID de l'utilisateur qui fait la requête, pour les vérifications de sécurité
}

export interface GetUserDetailsResult {
  success: boolean;
  user?: UserOrmPros;
  error?: string;
}

// Interface pour createUserViaMCP
export interface CreateUserParams {
  data: Omit<UserOrmPros, 'id'>;
}

export interface CreateUserResult {
  success: boolean;
  userId?: number;
  error?: string;
}

// Interface pour validateUserExistsViaMCP
export interface ValidateUserExistsParams {
  userId: number;
}

export interface ValidateUserExistsResult {
  success: boolean;
  exists: boolean;
  user?: UserOrmPros;
  error?: string;
}

// Interface pour getDefaultUserViaMCP
export interface GetDefaultUserParams {
  userId?: number; // Optionnel : ID d'utilisateur à essayer d'abord
}

export interface GetDefaultUserResult {
  success: boolean;
  user?: UserOrmPros;
  error?: string;
}

// Interface pour generateUserContextViaMCP
export interface GenerateUserContextParams {
  userId: number;
}

export interface GenerateUserContextResult {
  success: boolean;
  context?: string;
  error?: string;
}
