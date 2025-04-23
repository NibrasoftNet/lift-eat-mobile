import { UserOrmPros } from '@/db/schema';

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

export interface UpdateUserPreferencesResult {
  success: boolean;
  error?: string;
}

// Interface pour getUserDetailsViaMCP
export interface GetUserDetailsParams {
  userId: number;
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
