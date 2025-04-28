import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon, Icon } from '@/components/ui/icon';
import { SoupIcon } from 'lucide-react-native';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { PlanOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import PlanCard from '@/components/cards/PlanCard';
import { getPlansList } from '@/utils/services/plan.service';
import { VStack } from '@/components/ui/vstack';
import { RefreshControl } from 'react-native';

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
    refetch
  } = useQuery<PlanOrmProps[]>({
    queryKey: ['plans-list'], // Utiliser une clé standard pour le système d'invalidation
    queryFn: async () => {
      const plans = await getPlansList(drizzleDb);
      return plans ?? [];
    },
  });
  
  // Gestionnaire pour le pull-to-refresh
  const onRefresh = useCallback(async () => {
    // Déclencher une actualisation des données
    await refetch();
  }, [refetch]);

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
            <Icon as={SoupIcon} className="w-8 h-8" />
          </Link>
        </Box>
        <FlashList
          data={plansList}
          renderItem={({ item, index }) => (
            <PlanCard item={item} index={index} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={['#10b981', '#0ea5e9']} // Couleurs primaire et secondaire selon le design de l'app
              tintColor={'#10b981'}
            />
          }
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
          <FabIcon as={AddIcon} />
          <FabLabel>New Plan</FabLabel>
        </Fab>
      </VStack>
    </QueryStateHandler>
  );
}
