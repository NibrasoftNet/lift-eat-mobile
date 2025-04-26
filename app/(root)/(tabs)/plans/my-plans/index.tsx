import React, { useCallback, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { AddIcon, Icon, SearchIcon } from '@/components/ui/icon';
import { SoupIcon } from 'lucide-react-native';
import useSessionStore from '@/utils/store/sessionStore';
import { useQuery } from '@tanstack/react-query';
import { PlanOrmProps } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import PlanCard from '@/components/cards/PlanCard';
import { VStack } from '@/components/ui/vstack';
import { RefreshControl } from 'react-native';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { Input, InputIcon, InputSlot, InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';

export default function MyPlansScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Utilisation du service plan-pages pour récupérer les plans
  const {
    data,
    isPending,
    isFetching,
    isRefetching,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['plans-list', searchQuery, currentPage, itemsPerPage],
    queryFn: async () => {
      const filters = {
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage
      };
      
      const result = await planPagesService.getPlansList(filters);
      
      if (!result.success) {
        console.error('Erreur lors de la récupération des plans:', result.error);
        return { plans: [], totalCount: 0, pageInfo: { currentPage: 1, totalPages: 1 } };
      }
      
      return result.data;
    },
  });
  
  // Extraire les plans de la réponse
  const plansList = data?.plans || [];
  
  // Gestionnaire pour le pull-to-refresh
  const onRefresh = useCallback(async () => {
    // Réinitialiser la pagination lors d'un rafraîchissement manuel
    setCurrentPage(1);
    await refetch();
  }, [refetch]);
  
  // Gestionnaire de recherche
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1); // Réinitialiser la pagination lors d'une nouvelle recherche
  };

  return (
    <QueryStateHandler
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
        
        {/* Barre de recherche */}
        <Box className="px-4 py-2">
          <Input>
            <InputSlot>
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField 
              placeholder="Rechercher des plans..." 
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </Input>
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
          onEndReached={() => {
            // Charger la page suivante si ce n'est pas déjà la dernière
            if (data?.pageInfo && currentPage < data.pageInfo.totalPages) {
              setCurrentPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Box className="items-center justify-center py-8">
              <Text className="text-center text-gray-500">
                {searchQuery ? "Aucun plan trouvé avec cette recherche" : "Aucun plan nutritionnel disponible"}
              </Text>
            </Box>
          }
          ListFooterComponent={
            plansList.length > 0 && data?.pageInfo ? (
              <HStack className="justify-center items-center py-4">
                <Text className="text-sm text-gray-500">
                  Page {data.pageInfo.currentPage} sur {data.pageInfo.totalPages}
                </Text>
              </HStack>
            ) : null
          }
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
