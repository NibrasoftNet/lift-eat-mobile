import { tasks, lists } from '@/db/schema'
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import { AsyncStorage } from "expo-sqlite/kv-store";

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
    const value = AsyncStorage.getItemSync('dbInitialized')
    if (value) return;
    console.log('inserting list')

    await db.insert(lists).values([{ name: "List 1" }, { name: "List 2" }, { name: "List 3" }])

    await db.insert(tasks).values([
        { name: "Task 1", list_id: 1 },
        { name: "Task 2", list_id: 1 },
        { name: "Task 3", list_id: 1 },
        { name: "Task 4", list_id: 1 }
    ])

    await db.insert(tasks).values([
        { name: "Task 1", list_id: 2 },
        { name: "Task 2", list_id: 2 },
        { name: "Task 3", list_id: 2 },
        { name: "Task 4", list_id: 2 }
    ])
    AsyncStorage.setItemSync('dbInitialized', 'true')
}
