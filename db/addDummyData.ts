import { users } from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { AsyncStorage } from 'expo-sqlite/kv-store';
import { GenderEnum } from '@/utils/enum/user-gender-activity.enum';

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  console.log('Adding seed data...');
  const value = AsyncStorage.getItemSync('dbInitialized');

  if (value) {
    console.log('seed data already initialised...', value);
    return;
  }
  console.log('inserting list');

  await db.insert(users).values([
    { name: 'User 1', email: 'test1@test.com', gender: GenderEnum.MALE },
    { name: 'User 2', email: 'test2@test.com', gender: GenderEnum.FEMALE },
    { name: 'User 3', email: 'test3@test.com', gender: GenderEnum.MALE },
  ]);

  AsyncStorage.setItemSync('dbInitialized', 'true');
};
