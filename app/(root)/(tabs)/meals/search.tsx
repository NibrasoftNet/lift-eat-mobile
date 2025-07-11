import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';

import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '@/components-new/ui/atoms/base';
import Input from '@/components-new/ui/atoms/inputs/Input';
import { Pressable, ActivityIndicator } from 'react-native';
import Dropdown from '@/components-new/ui/molecules/inputs/Dropdown';
import TopBar from '@/components-new/ui/molecules/navigation/TopBar';

// Icons
import { SearchRegularBoldIcon } from '@/assets/icons/figma/regular-bold/SearchRegularBoldIcon';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';

// Enums & Services
import { CountryTypeEnum, CountryLabelMap } from '@/utils/enum/meal.enum';
import OpenFoodFactsService, {
  ProductResult,
} from '@/utils/api/OpenFoodFactsService';

import OpenFoodSearchCard from '@/components-new/ui/organisms/meal/OpenFoodSearchCard';
import Divider from '@/components-new/ui/atoms/layout/Divider';

import { ThemeInterface } from '@/themeNew';

// Build dropdown options from CountryTypeEnum
const countryOptions = Object.values(CountryTypeEnum).map((value) => ({
  label: CountryLabelMap[value],
  value,
}));

export default function MealSearchScreen() {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryTypeEnum>(
    CountryTypeEnum.FRANCE,
  );

  const {
    data: results,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<ProductResult[]>({
    queryKey: ['meal-search', query, selectedCountry],
    enabled: false,
    queryFn: () =>
      OpenFoodFactsService.searchProductsWithResults({
        search_terms: query,
        country: selectedCountry,
        page: 1,
        page_size: 20,
      }),
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    refetch();
  };

  return (
    <Box flex={1} bg={theme.color('background')}>
      {/* Header */}
      <TopBar
        title={t('meal.search.title')}
        leftIcon={
          <CloseSquareRegularBoldIcon
            size={24}
            color={theme.color('successLighter')}
          />
        }
        onLeftIconPress={() => router.back()}
        containerStyle={{ flex: 0, backgroundColor: theme.color('background') }}
        titleStyle={{
          textAlign: 'center',
          flex: 6,
          marginLeft: 14,
          fontSize: 22,
          fontWeight: '600',
        }}
        showStatusBar={false}
      />

      {/* Body */}
      <Box px={theme.space('lg')} py={theme.space('md')}>
        {/* Country selector */}
        <Box mb={theme.space('md')}>
          <Dropdown
            placeholder={t('meal.search.selectCountry')}
            items={countryOptions}
            selectedValue={selectedCountry}
            onSelect={(item) =>
              setSelectedCountry(item.value as CountryTypeEnum)
            }
          />
        </Box>

        {/* Search bar + button row */}
        <Box row alignItems="center" mb={theme.space('md')}>
          <Box flex={1} mr={theme.space('sm')}>
            <Input
              placeholder={t('meal.search.placeholder')}
              leftIcon={
                <SearchRegularBoldIcon
                  size={18}
                  color={theme.color('blueGrey')}
                />
              }
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
            />
          </Box>
          <Pressable
            style={({ pressed }) => [
              styles.searchbouton,
              (isLoading || isFetching) && styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={isLoading || isFetching}
          >
            <Box row alignItems="center" style={styles.searchbouton}>
              <SearchRegularBoldIcon size={16} color="#fff" />
              <Text color="#fff" style={{ marginLeft: theme.space('xs') }}>
                {t('meal.search.button')}
              </Text>
              {(isLoading || isFetching) && (
                <ActivityIndicator
                  color="#fff"
                  style={{ marginLeft: theme.space('sm') }}
                />
              )}
            </Box>
          </Pressable>
        </Box>
      </Box>

      {/* Results */}
      <Box flex={1} px={theme.space('lg')}>
        {results &&
        results.length > 0 &&
        results.some((r) => (r.calories || 0) > 0) ? (
          <FlashList
            data={results.filter((item) => (item.calories || 0) > 0)}
            estimatedItemSize={120}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <OpenFoodSearchCard
                product={item}
                index={index}
                onPress={() =>
                  router.push(
                    `/(root)/(tabs)/meals/scanner/product/${item.code}`,
                  )
                }
              />
            )}
            ItemSeparatorComponent={() => <Divider my={theme.space('2xl')} />}
          />
        ) : (
          !isLoading &&
          !isFetching && (
            <Box flex={1} alignItems="center" justifyContent="center">
              <Text color={theme.color('blueGrey')}>
                {t('meal.search.noResults')}
              </Text>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}

const createStyles = (theme: ThemeInterface) =>
  StyleSheet.create({
    searchButtonPressed: {},
    searchButtonDisabled: {
      backgroundColor: theme.color('blueGrey'),
    },
    searchbouton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color('successLighter'),
      borderRadius: 10,
      paddingVertical: theme.space('sm'),
      paddingHorizontal: theme.space('md'),
      minHeight: 48,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
  });
