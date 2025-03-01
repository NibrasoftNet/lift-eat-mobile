import { eq } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import { users } from "@/db/schema";
import { GenderEnum } from "@/utils/enum/user-gender-activity.enum";

/**
 * Function to find or create a user in the database.
 * @param drizzleDb - Drizzle database instance.
 * @param email - User email.
 * @returns The existing or newly created user.
 */
export const findOrCreateUser = async (drizzleDb: ExpoSQLiteDatabase<typeof schema>, email: string) => {
    const userData = {
        email,
        name: "Khalil Zantour",
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
    return drizzleDb
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
};
