import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { users } from '@/db/schema';
import { GenderEnum } from '@/utils/enum/user-gender-activity.enum';
import { UserProfileFormData } from '@/utils/validation/user/user-profile.validation';
import { UserDetailsFormData } from '@/utils/validation/user/user-details.validation';
import { UserGenderActivityFormData } from '@/utils/validation/user/user-gender-activity.validation';

/**
 * Function to find or create a user in the database.
 * @param drizzleDb - Drizzle database instance.
 * @param email - User email.
 * @returns The existing or newly created user.
 */
export const findOrCreateUser = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  email: string,
) => {
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
};

export const updateUser = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  userId: number,
  data: UserProfileFormData | UserDetailsFormData | UserGenderActivityFormData,
) => {
  // Perform the update
  await drizzleDb.update(users).set(data).where(eq(users.id, userId)).execute();

  // Fetch and return the updated user
  const updatedUser = await drizzleDb
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return updatedUser[0]; // Return the first (and only) result
};
