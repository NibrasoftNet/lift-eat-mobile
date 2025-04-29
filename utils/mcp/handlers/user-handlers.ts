import {
  UpdateUserPreferencesParams,
  UpdateUserPreferencesResult,
  GetUserDetailsParams,
  GetUserDetailsResult,
  CreateUserParams,
  CreateUserResult,
  ValidateUserExistsParams,
  ValidateUserExistsResult,
  GetDefaultUserParams,
  GetDefaultUserResult,
  GenerateUserContextParams,
  GenerateUserContextResult
} from '../interfaces/user-interfaces';
import {
  users,
  UserOrmPros
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Handler pour la méthode updateUserPreferencesViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la mise à jour des préférences utilisateur
 * @returns Résultat de l'opération
 */
export async function handleUpdateUserPreferences(db: any, params: UpdateUserPreferencesParams): Promise<UpdateUserPreferencesResult> {
  const { userId, preferences } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Updating preferences for user ${userId} via MCP Server`);
    
    // Vérifier si l'utilisateur existe
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      
    if (userExists.length === 0) {
      logger.warn(LogCategory.DATABASE, `Cannot update preferences: User with ID ${userId} not found`);
      return { success: false, error: `User with ID ${userId} not found` };
    }
    
    // Calculer les besoins caloriques et objectifs si nécessaire
    let calculatedPreferences = { ...preferences };
    
    // Si les paramètres nécessaires sont fournis, calculer les besoins caloriques
    if (preferences.age && preferences.gender && preferences.weight && preferences.height && preferences.physicalActivity) {
      // Calculer le BMR (Basal Metabolic Rate) en utilisant l'équation Harris-Benedict
      let bmr = 0;
      if (preferences.gender === 'MALE') {
        bmr = 88.362 + (13.397 * preferences.weight) + (4.799 * preferences.height) - (5.677 * preferences.age);
      } else {
        bmr = 447.593 + (9.247 * preferences.weight) + (3.098 * preferences.height) - (4.330 * preferences.age);
      }
      
      // Définir les multiplicateurs d'activité
      const activityMultipliers: Record<string, number> = {
        'SEDENTARY': 1.2,        // Activité sédentaire (peu ou pas d'exercice)
        'LIGHTLY_ACTIVE': 1.375,  // Légèrement actif (exercice léger 1-3 jours/semaine)
        'MODERATELY_ACTIVE': 1.55, // Modérément actif (exercice modéré 3-5 jours/semaine)
        'VERY_ACTIVE': 1.725,     // Très actif (exercice intense 6-7 jours/semaine)
        'EXTRA_ACTIVE': 1.9       // Extrêmement actif (exercice très intense et travail physique)
      };
      
      // Calculer les besoins caloriques totaux
      const activityMultiplier = activityMultipliers[preferences.physicalActivity] || 1.55; // Valeur par défaut si non trouvée
      const totalCalories = Math.round(bmr * activityMultiplier);
      console.log(`Calculated calories for user ${userId}: ${totalCalories} (not saved as no field exists)`);
    }
    
    // Mettre à jour les préférences de l'utilisateur
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
 * Handler pour la méthode getUserDetailsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la récupération des détails utilisateur
 * @returns Résultat de l'opération avec les détails utilisateur
 */
export async function handleGetUserDetails(db: any, params: GetUserDetailsParams): Promise<GetUserDetailsResult> {
  const { userId, requestingUserId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Getting user details for user ${userId} (requested by ${requestingUserId || 'unknown'}) via MCP Server`);
    
    // Vérifier l'autorisation - seul l'utilisateur lui-même peut accéder à ses données
    if (requestingUserId && userId !== requestingUserId) {
      logger.warn(LogCategory.DATABASE, `Unauthorized attempt to access user ${userId} details by user ${requestingUserId}`);
      return { success: false, error: 'Not authorized to access this user\'s details' };
    }
    
    // Récupérer les détails de l'utilisateur
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (userDetails.length === 0) {
      logger.warn(LogCategory.DATABASE, `User with ID ${userId} not found`);
      return { success: false, error: `User with ID ${userId} not found` };
    }
    
    logger.info(LogCategory.DATABASE, `Retrieved details for user ${userId} via MCP Server`);
    return { success: true, user: userDetails[0] };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetUserDetails: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode createUserViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la création de l'utilisateur
 * @returns Résultat de l'opération avec l'ID de l'utilisateur créé
 */
export async function handleCreateUser(db: any, params: CreateUserParams): Promise<CreateUserResult> {
  const { data } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Creating new user via MCP Server`);
    
    // Créer un nouvel utilisateur avec les données fournies
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
 * Handler pour la méthode validateUserExistsViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la validation de l'existence de l'utilisateur
 * @returns Résultat de l'opération indiquant si l'utilisateur existe
 */
export async function handleValidateUserExists(db: any, params: ValidateUserExistsParams): Promise<ValidateUserExistsResult> {
  const { userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Validating existence of user ${userId} via MCP Server`);
    
    // Vérifier si l'utilisateur existe
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

/**
 * Handler pour la méthode getDefaultUserViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres optionnels incluant potentiellement un ID d'utilisateur à essayer d'abord
 * @returns Résultat de l'opération avec l'utilisateur par défaut
 */
export async function handleGetDefaultUser(db: any, params: GetDefaultUserParams): Promise<GetDefaultUserResult> {
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, 'Getting default user via MCP Server', params);
    
    // Si un ID utilisateur est fourni, essayer de récupérer cet utilisateur spécifique d'abord
    if (params.userId) {
      logger.info(LogCategory.DATABASE, `Trying to get user with ID: ${params.userId}`);
      
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, params.userId))
        .limit(1);
      
      if (userResult.length > 0) {
        logger.info(LogCategory.DATABASE, `Found user with ID: ${params.userId}`);
        return { 
          success: true, 
          user: userResult[0]
        };
      }
      
      logger.warn(LogCategory.DATABASE, `User with ID ${params.userId} not found, trying to get default user`);
    }
    
    // Récupérer le premier utilisateur dans la base de données
    const defaultUserResult = await db
      .select()
      .from(users)
      .limit(1);
    
    if (defaultUserResult.length > 0) {
      logger.info(LogCategory.DATABASE, `Found default user with ID: ${defaultUserResult[0].id}`);
      return { 
        success: true, 
        user: defaultUserResult[0]
      };
    }
    
    // Aucun utilisateur trouvé
    logger.warn(LogCategory.DATABASE, 'No users found in database');
    return { 
      success: false, 
      error: 'No users found in database'
    };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGetDefaultUser: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Handler pour la méthode generateUserContextViaMCP
 * @param db Instance de la base de données
 * @param params Paramètres pour la génération du contexte utilisateur
 * @returns Résultat de l'opération avec le contexte utilisateur formaté
 */
export async function handleGenerateUserContext(db: any, params: GenerateUserContextParams): Promise<GenerateUserContextResult> {
  const { userId } = params;
  
  try {
    if (!db) throw new Error("Database not initialized");
    
    logger.info(LogCategory.DATABASE, `Generating user context for user ${userId} via MCP Server`);
    
    // Récupérer les détails de l'utilisateur
    const userDetails = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (userDetails.length === 0) {
      logger.warn(LogCategory.DATABASE, `User with ID ${userId} not found`);
      return { success: false, error: `User with ID ${userId} not found` };
    }
    
    const user = userDetails[0];
    
    // Construire le contexte utilisateur
    const contextElements = [
      `USER_ID: ${user.id}`,
      `NAME: ${user.name || 'Unknown'}`,
      `GENDER: ${user.gender || 'Unknown'}`,
      `AGE: ${user.age || 'Unknown'}`,
      `WEIGHT: ${user.weight || 'Unknown'} ${user.weightUnit || 'kg'}`,
      `HEIGHT: ${user.height || 'Unknown'} ${user.heightUnit || 'cm'}`,
      `PHYSICAL_ACTIVITY: ${user.physicalActivity || 'Unknown'}`
    ];
    
    // Ajouter d'autres informations conditionnelles si disponibles
    if (user.goal) contextElements.push(`GOAL: ${user.goal}`);
    
    const formattedContext = contextElements.join('\n');
    
    logger.info(LogCategory.DATABASE, `Successfully generated context for user ${userId} via MCP Server`);
    return { success: true, context: formattedContext };
  } catch (error) {
    logger.error(LogCategory.DATABASE, `Error in handleGenerateUserContext: ${error instanceof Error ? error.message : String(error)}`);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}
