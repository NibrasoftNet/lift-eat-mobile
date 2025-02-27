import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { GenderEnum } from "@/utils/enum/user-gender-activity.enum";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    gender: text('gender', { enum: ['MALE', 'FEMALE'] }).notNull().default(GenderEnum.MALE),});

// Export User type for use in your app
export type User = typeof users.$inferSelect;
