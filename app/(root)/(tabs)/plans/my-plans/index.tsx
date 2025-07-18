import React, { useCallback, useState } from 'react';
import { SafeAreaView, RefreshControl, StyleSheet, View, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { useAppTheme } from '@/utils/providers/ThemeProvider';
import type { ThemeInterface } from '@/themeNew';
import SearchPlanNew from '@/components-new/ui/organisms/plan/SearchPlanNew';
import PlanCardNew from '@/components-new/ui/organisms/plan/PlanCardNew';
import Text from '@/components-new/ui/atoms/base/Text';

import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';

export default function MyPlansScreenNew() {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = getStyles(theme);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch plans list
  const { data, isPending, isFetching, isRefetching, isLoading, refetch } =
    useQuery({
      queryKey: ['plans-list-new', searchQuery, currentPage, itemsPerPage],
      queryFn: async () => {
        const filters = {
          search: searchQuery,
          page: currentPage,
          limit: itemsPerPage,
        };
        const result = await planPagesService.getPlansList(filters);
        if (!result.success) {
          console.error(
            'Erreur lors de la récupération des plans:',
            result.error,
          );
          return {
            plans: [],
            totalCount: 0,
            pageInfo: { currentPage: 1, totalPages: 1 },
          };
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
    <SafeAreaView style={styles.safeArea}>
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
        style={{
          marginHorizontal: theme.space('xl'),
          marginBottom: theme.space('lg'),
        }}
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
                  {searchQuery
                    ? 'Aucun plan trouvé'
                    : 'Aucun plan nutritionnel disponible'}
                </Text>
              </View>
            )
          }
        />
      </QueryStateHandler>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push('/plans/my-plans/create')}
        >
          <Text variant="button" style={styles.ctaText}>
            Créer un plan
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 40,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.primary,
      marginLeft: 30,
      padding: 10,
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
      paddingHorizontal: theme.space('xl'),
      paddingBottom: theme.space('2xl'),
    },
    ctaButton: {
      backgroundColor: theme.color('successLighter'),
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: theme.space('lg'),
    },
    ctaText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 16,
    },
  });
