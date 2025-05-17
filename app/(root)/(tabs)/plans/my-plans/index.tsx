import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Icon } from '@/components/ui/icon';
import { PlusIcon, SoupIcon } from 'lucide-react-native';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { PlanOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import PlanCard from '@/components/cards/PlanCard';
import { getPlansList } from '@/utils/services/plan.service';
import { VStack } from '@/components/ui/vstack';

export default function MyPlansScreen() {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const { user } = useSessionStore();
  const {
    data: plansList,
    isPending,
    isFetching,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ['my-plans'],
    queryFn: async () => {
      const plans = await getPlansList(drizzleDb);
      return plans ?? null;
    },
  });

  return (
    <QueryStateHandler<PlanOrmProps>
      data={plansList}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <VStack className="flex-1">
        <Box className="flex-row justify-between items-center p-4 border-b border-primary-100">
          <Text className="text-2xl font-bold">Nutrition Plans</Text>
          <Link href="/plans/my-plans/create">
            <Icon as={SoupIcon} size={30} />
          </Link>
        </Box>
        <FlashList
          data={plansList}
          renderItem={({ item, index }) => (
            <PlanCard item={item} index={index} />
          )}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={200}
          contentContainerStyle={{ padding: 16 }}
        />
        <Fab
          size="md"
          placement="bottom right"
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          onPress={() => router.push('/plans/my-plans/create')}
        >
          <FabIcon as={PlusIcon} />
          <FabLabel>New</FabLabel>
        </Fab>
      </VStack>
    </QueryStateHandler>
  );
}
