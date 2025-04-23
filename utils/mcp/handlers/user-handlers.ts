import {
  UpdateUserPreferencesParams,
  UpdateUserPreferencesResult,
  GetUserDetailsParams,
  GetUserDetailsResult,
  CreateUserParams,
  CreateUserResult,
  ValidateUserExistsParams,
  ValidateUserExistsResult
} from '../interfaces/user-interfaces';
import {
  users,
  UserOrmPros
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Handler pour la mu00e9thode updateUserPreferencesViaMCP
 * @param db Instance de la base de donnu00e9es
 * @param params Paramu00e8tres pour la mise u00e0 jour des pru00e9fu00e9rences utilisateur
 * @returns Ru00e9sultat de l'opu00e9ration
 */
export async function handleUpdateUserPreferences(db: any, params: UpdateUserPreferencesParams): Promise<UpdateUserPreferencesResult> {
  const { userId, preferences } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Updating preferences for user ${userId} via MCP Server`);
    
    // Vu00e9rifier si l'utilisateur existe
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      
    if (userExists.length === 0) {
      logger.warn(LogCategory.DATABASE, `Cannot update preferences: User with ID ${userId} not found`);
      return { success: false, error: `User with ID ${userId} not found` };
    }
    
    // Calculer les besoins caloriques et objectifs si nu00e9cessaire
    let calculatedPreferences = { ...preferences };
    
    // Si les paramu00e8tres nu00e9cessaires sont fournis, calculer les besoins caloriques
    if (preferences.age && preferences.gender && preferences.weight && preferences.height && preferences.physicalActivity) {
      // Calculer le BMR (Basal Metabolic Rate) en utilisant l'u00e9quation Harris-Benedict
      let bmr = 0;
      if (preferences.gender === 'MALE') {
        bmr = 88.362 + (13.397 * preferences.weight) + (4.799 * preferences.height) - (5.677 * preferences.age);
      } else {
        bmr = 447.593 + (9.247 * preferences.weight) + (3.098 * preferences.height) - (4.330 * preferences.age);
      }
      
      // Du00e9finir les multiplicateurs d'activitu00e9
      const activityMultipliers: Record<string, number> = {
        'SEDENTARY': 1.2,        // Activitu00e9 su00e9dentaire (peu ou pas d'exercice)
        'LIGHTLY_ACTIVE': 1.375,  // Lu00e9gu00e8rement actif (exercice lu00e9ger 1-3 jours/semaine)
        'MODERATELY_ACTIVE': 1.55, // Modu00e9ru00e9ment actif (exercice modu00e9ru00e9 3-5 jours/semaine)
        'VERY_ACTIVE': 1.725,     // Tru00e8s actif (exercice intense 6-7 jours/semaine)
        'EXTRA_ACTIVE': 1.9       // Extru00eamement actif (exercice tru00e8s intense et travail physique)
      };
      
      // Calculer les besoins caloriques totaux
      const activityMultiplier = activityMultipliers[preferences.physicalActivity] || 1.55; // Valeur par du00e9faut si non trouvu00e9e
      const totalCalories = Math.round(bmr * activityMultiplier);
      console.log(`Calculated calories for user ${userId}: ${totalCalories} (not saved as no field exists)`);
    }
    
    // Mettre u00e0 jour les pru00e9fu00e9rences de l'utilisateur
    await db
      .update(users)
      .set({
        ...calculatedPreferences,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId));
    
    logger.info(LogCategory.DATABASE, `Successfully updated preferences for user ${userId} via MCP Server`);
    return { success: true };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleUpdateUserPreferences: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la mu00e9thode getUserDetailsViaMCP
 * @param db Instance de la base de donnu00e9es
 * @param params Paramu00e8tres pour la ru00e9cupu00e9ration des du00e9tails utilisateur
 * @returns Ru00e9sultat de l'opu00e9ration avec les du00e9tails utilisateur
 */
export async function handleGetUserDetails(db: any, params: GetUserDetailsParams): Promise<GetUserDetailsResult> {
  const { userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting details for user ${userId} via MCP Server`);
    
    // Ru00e9cupu00e9rer les du00e9tails de l'utilisateur
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (userResults.length === 0) {
      logger.warn(LogCategory.DATABASE, `User with ID ${userId} not found`);
      return { success: false, error: `User with ID ${userId} not found` };
    }
    
    logger.info(LogCategory.DATABASE, `Successfully retrieved details for user ${userId} via MCP Server`);
    return { success: true, user: userResults[0] };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetUserDetails: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la mu00e9thode createUserViaMCP
 * @param db Instance de la base de donnu00e9es
 * @param params Paramu00e8tres pour la cru00e9ation de l'utilisateur
 * @returns Ru00e9sultat de l'opu00e9ration avec l'ID de l'utilisateur cru00e9u00e9
 */
export async function handleCreateUser(db: any, params: CreateUserParams): Promise<CreateUserResult> {
  const { data } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Creating new user via MCP Server`);
    
    // Cru00e9er un nouvel utilisateur avec les donnu00e9es fournies
    const [insertedUser] = await db
      .insert(users)
      .values({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning({ id: users.id });
    
    if (!insertedUser) {
      throw new Error('Failed to create user');
    }
    
    const userId = insertedUser.id;
    logger.info(LogCategory.DATABASE, `Successfully created user with ID ${userId} via MCP Server`);
    return { success: true, userId };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleCreateUser: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la mu00e9thode validateUserExistsViaMCP
 * @param db Instance de la base de donnu00e9es
 * @param params Paramu00e8tres pour la validation de l'existence de l'utilisateur
 * @returns Ru00e9sultat de l'opu00e9ration indiquant si l'utilisateur existe
 */
export async function handleValidateUserExists(db: any, params: ValidateUserExistsParams): Promise<ValidateUserExistsResult> {
  const { userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Validating existence of user ${userId} via MCP Server`);
    
    // Vu00e9rifier si l'utilisateur existe
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    const exists = userResults.length > 0;
    
    logger.info(LogCategory.DATABASE, `User ${userId} ${exists ? 'exists' : 'does not exist'} in database`);
    return { 
      success: true, 
      exists, 
      user: exists ? userResults[0] : undefined 
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleValidateUserExists: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      exists: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
