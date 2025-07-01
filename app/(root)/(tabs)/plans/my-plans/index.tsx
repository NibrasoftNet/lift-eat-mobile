import React, { useCallback, useState } from 'react';
import { SafeAreaView, RefreshControl, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useTheme } from '@/themeNew';
import SearchPlanNew from '@/components-new/ui/organisms/plan/SearchPlanNew';
import PlanCardNew from '@/components-new/ui/organisms/plan/PlanCardNew';
import CreatePlanButton from '@/components-new/ui/organisms/plan/CreatePlanButton';
import Text from '@/components-new/ui/atoms/base/Text';

import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';

export default function MyPlansScreenNew() {
  const router = useRouter();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch plans list
  const {
    data,
    isPending,
    isFetching,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['plans-list-new', searchQuery, currentPage, itemsPerPage],
    queryFn: async () => {
      const filters = { search: searchQuery, page: currentPage, limit: itemsPerPage };
      const result = await planPagesService.getPlansList(filters);
      if (!result.success) {
        console.error('Erreur lors de la récupération des plans:', result.error);
        return { plans: [], totalCount: 0, pageInfo: { currentPage: 1, totalPages: 1 } };
      }
      return result.data;
    },
  });

  const plansList = data?.plans || [];

  const onRefresh = useCallback(async () => {
    setCurrentPage(1);
    await refetch();
  }, [refetch]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.color('background') }]}>      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text variant="h3" style={styles.headerTitle}>
          Plans Nutritionnels
        </Text>
      </View>

      {/* Search Bar */}
      <SearchPlanNew
        value={searchQuery}
        onChangeText={handleSearch}
        style={{ marginHorizontal: theme.space('xl'), marginBottom: theme.space('lg') }}
      />

      <QueryStateHandler
        data={plansList}
        isLoading={isLoading}
        isFetching={isFetching}
        isPending={isPending}
        isRefetching={isRefetching}
      >
        <FlashList
          data={plansList}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={220}
          renderItem={({ item }) => (
            <View style={{ marginBottom: theme.space('2xl') }}>
              <PlanCardNew plan={item} />
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: theme.space('xl'),
            paddingBottom: theme.space('4xl'), // space for button
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={[theme.color('primary')]}
              tintColor={theme.color('primary')}
            />
          }
          onEndReached={() => {
            if (data?.pageInfo && currentPage < data.pageInfo.totalPages) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isFetching ? null : (
              <View style={styles.emptyContainer}>
                <Text variant="body" style={styles.emptyText}>
                  {searchQuery ? 'Aucun plan trouvé' : 'Aucun plan nutritionnel disponible'}
                </Text>
              </View>
            )
          }
        />
      </QueryStateHandler>

      {/* CTA */}
      <View style={[styles.ctaContainer, { paddingHorizontal: theme.space('xl'), paddingBottom: theme.space('2xl') }]}>
        <CreatePlanButton onPress={() => router.push('/plans/my-plans/create')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  headerTitle: {
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyText: {
    opacity: 0.6,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
