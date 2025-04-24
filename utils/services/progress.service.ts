import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '../../db/schema';
import {
  dailyProgress,
  dailyMealProgress,
  dailyPlanMeals,
  plan,
  meals,
  DailyProgressOrmProps,
  DailyMealProgressOrmProps,
  MealOrmProps,
  DailyPlanMealsOrmProps,
} from '../../db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { logger } from './logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DayEnum } from '@/utils/enum/general.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

// Remplacé par un appel direct à sqliteMCPServer.getDailyProgressByPlanViaMCP
