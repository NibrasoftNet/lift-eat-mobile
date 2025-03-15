import { useQuery } from '@tanstack/react-query';
import { VStack } from '../ui/vstack';
import NavbarUser from '../navbars/NavbarUser';
import { Calendar, DateData } from 'react-native-calendars';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { UserOrmPros } from '@/db/schema';
import useSessionStore from '@/utils/store/sessionStore';

const ProgressCalendarTab = () => {
  const drizzleDb = useDrizzleDb();
  const { user } = useSessionStore();
  const {
    data: actualUser,
    isPending,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const userResult = await drizzleDb.query.users.findFirst();
      return userResult ?? null;
    },
  });

  const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
  const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' };
  const workout = { key: 'workout', color: 'green' };
  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
    >
      <VStack>
        <NavbarUser user={actualUser!} />
        <Calendar
          markingType={'multi-dot'}
          markedDates={{
            '2025-03-25': {
              dots: [vacation, massage, workout],
              selected: true,
              selectedColor: 'red',
            },
            '2025-03-27': { dots: [massage, workout], disabled: true },
          }}
          onDayPress={(day: DateData) => {
            console.log('selected day', day);
          }}
        />
      </VStack>
    </QueryStateHandler>
  );
};

export default ProgressCalendarTab;
