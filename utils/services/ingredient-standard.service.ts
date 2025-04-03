import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import { ingredientsStandard } from '../../db/schema';
import { like } from 'drizzle-orm';
import { defaultPageSize } from '@/utils/constants/constant';
import { withPagination } from './common.service';

export const getIngredientStandardList = async (
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  page: number = 1,
  pageSize: number = defaultPageSize,
  ingredientName?: string,
) => {
  try {
    let query = drizzleDb.select().from(ingredientsStandard).$dynamic();

    if (ingredientName) {
      query = query.where(
        like(ingredientsStandard.name, `%${ingredientName}%`),
      );
    }

    query = withPagination(query, page, pageSize);

    const data = await query.execute();
    return { data, nextPage: data.length === pageSize ? page + 1 : null };
  } catch (error) {
    console.error('Error fetching ingredient list:', error);
    throw error;
  }
};
