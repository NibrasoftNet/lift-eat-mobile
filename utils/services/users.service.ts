import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { users } from '@/db/schema';
import { GenderEnum } from '@/utils/enum/user-gender-activity.enum';
import { UserProfileFormData } from '@/utils/validation/user/user-profile.validation';
import { UserDetailsFormData } from '@/utils/validation/user/user-details.validation';
import { UserGenderActivityFormData } from '@/utils/validation/user/user-gender-activity.validation';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

/**
 * Function to find or create a user in the database.
 * @deprecated Utilisez directement sqliteMCPServer.findOrCreateUserViaMCP pour une meilleure centralisation
 * @param drizzleDb - Drizzle database instance.
 * @param email - User email.
 * @returns The existing or newly created user.
 */
export const findOrCreateUser = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  email: string,
) => {
  const startTime = logger.startPerformanceLog('findOrCreateUser');
  try {
    logger.info(LogCategory.DATABASE, 'Finding or creating user via MCP Server', { email });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    const result = await sqliteMCPServer.findOrCreateUserViaMCP(email);

    if (!result.success) {
      throw new Error(result.error || `Failed to find or create user with email ${email} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'User found or created via MCP Server', {
      email,
      userId: result.user?.id,
    });
    
    return result.user;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to find or create user', { email, error });
    throw error;
  } finally {
    logger.endPerformanceLog('findOrCreateUser', startTime);
  }
};

/**
 * Updates user information in the database.
 * @deprecated Utilisez directement sqliteMCPServer.updateUserPreferencesViaMCP pour une meilleure centralisation
 * @param drizzleDb - Drizzle database instance.
 * @param userId - User ID to update.
 * @param data - User data to update.
 * @returns The updated user information.
 */
export const updateUser = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  data: UserProfileFormData | UserDetailsFormData | UserGenderActivityFormData,
) => {
  const startTime = logger.startPerformanceLog('updateUser');
  try {
    logger.info(LogCategory.DATABASE, 'Updating user preferences via MCP Server', { userId });

    // Utiliser le serveur MCP au lieu d'accéder directement à la base de données
    // Comme les données peuvent venir de différents formulaires, nous utilisons un accès direct à la base de données
    await drizzleDb
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .execute();
    
    logger.debug(LogCategory.DATABASE, 'User updated directly in database', {
      userId,
    });

    // Récupérer les détails de l'utilisateur mis à jour
    const userDetailsResult = await sqliteMCPServer.getUserDetailsViaMCP(userId);
    
    if (!userDetailsResult.success) {
      throw new Error(userDetailsResult.error || `Failed to fetch updated user ${userId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'User updated via MCP Server', {
      userId,
    });
    
    return userDetailsResult.user;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to update user', { userId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('updateUser', startTime);
  }
};

/**
 * Gets user details from the database.
 * @param userId - User ID to get details for.
 * @returns The user details.
 */
export const getUserDetails = async (userId: number) => {
  const startTime = logger.startPerformanceLog('getUserDetails');
  try {
    logger.info(LogCategory.DATABASE, 'Getting user details via MCP Server', { userId });

    const result = await sqliteMCPServer.getUserDetailsViaMCP(userId);

    if (!result.success) {
      throw new Error(result.error || `Failed to get user details for ${userId} via MCP Server`);
    }

    logger.debug(LogCategory.DATABASE, 'User details retrieved via MCP Server', {
      userId,
    });
    
    return result.user;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to get user details', { userId, error });
    throw error;
  } finally {
    logger.endPerformanceLog('getUserDetails', startTime);
  }
};
