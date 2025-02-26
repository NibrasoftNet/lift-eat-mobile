import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    list_id: integer('list_id')
        .notNull()
        .references(() => lists.id),
});

export const lists = sqliteTable('lists', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

// Export Task to use as an interface in your app
export type Task = typeof tasks.$inferSelect;