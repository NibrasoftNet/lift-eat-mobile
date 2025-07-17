import { mealService } from '../meal-core.service';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { MealTypeEnum } from '@/utils/enum/meal.enum';

// Mock sqliteMCPServer and user context
jest.mock('@/utils/mcp/sqlite-server', () => ({
  __esModule: true,
  default: {
    getMealsListViaMCP: jest.fn(),
  },
}));

jest.mock('@/utils/helpers/userContext', () => ({
  getCurrentUserIdSync: () => 123,
}));

const mockedMCP = sqliteMCPServer as unknown as {
  getMealsListViaMCP: jest.Mock;
};

describe('mealService.getMealsList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should forward planId, date, type to MCP and return meals', async () => {
    const mockMeals = [{ id: 1, type: MealTypeEnum.BREAKFAST }];
    mockedMCP.getMealsListViaMCP.mockResolvedValue({ success: true, meals: mockMeals });

    const result = await mealService.getMealsList({
      planId: 10,
      date: '2025-07-14',
      type: MealTypeEnum.BREAKFAST,
      limit: 10,
    } as any);

    expect(mockedMCP.getMealsListViaMCP).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 123,
        planId: 10,
        date: '2025-07-14',
        type: MealTypeEnum.BREAKFAST,
      }),
    );

    expect(result.success).toBe(true);
    expect(result.meals).toEqual(mockMeals);
    expect(result.totalCount).toBe(mockMeals.length);
  });

  it('should return error when MCP fails', async () => {
    mockedMCP.getMealsListViaMCP.mockResolvedValue({ success: false, error: 'db error' });

    const result = await mealService.getMealsList({
      planId: 10,
      date: '2025-07-14',
      type: MealTypeEnum.LUNCH,
    } as any);

    expect(result.success).toBe(false);
    expect(result.error).toBe('db error');
  });
});
