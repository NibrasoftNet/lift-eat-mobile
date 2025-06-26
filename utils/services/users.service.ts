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
 * Gets user details from the database.
 * @param userId - User ID to get details for.
 * @returns The user details.
 */
export const findOrCreateUser = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  email: string,
) => {
  try {
    const userData = {
      email,
      name: 'Khalil Zantour',
      gender: GenderEnum.MALE,
    };

    // Check if user already exists
    const existingUser = drizzleDb
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existingUser) {
      return existingUser; // Return existing user
    }

    // Insert the new user
    await drizzleDb.insert(users).values(userData);

    // Return the newly inserted user
    return drizzleDb.select().from(users).where(eq(users.email, email)).get();
  } catch (error) {
    console.error('Error updating user:', error); // Debugging log
    throw error; // Ensure the error is thrown so React Query can catch it
  }
};

export const getUserDetails = async (userId: number) => {
  const startTime = logger.startPerformanceLog('getUserDetails');
  try {
    logger.info(LogCategory.DATABASE, 'Getting user details via MCP Server', {
      userId,
    });

    const result = await sqliteMCPServer.getUserDetailsViaMCP(userId);

    if (!result.success) {
      throw new Error(
        result.error ||
          `Failed to get user details for ${userId} via MCP Server`,
      );
    }

    logger.debug(
      LogCategory.DATABASE,
      'User details retrieved via MCP Server',
      {
        userId,
      },
    );

    return result.user;
  } catch (error) {
    logger.error(LogCategory.DATABASE, 'Failed to get user details', {
      userId,
      error,
    });
    throw error;
  } finally {
    logger.endPerformanceLog('getUserDetails', startTime);
  }
};

// Remplacé par un appel direct à sqliteMCPServer.createUserViaMCP

// Remplacé par un appel direct à sqliteMCPServer.validateUserExistsViaMCP

// Remplacé par getUserDetails ou directement sqliteMCPServer.getUserDetailsViaMCP
