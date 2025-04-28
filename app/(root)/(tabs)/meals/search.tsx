import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { Search, ChevronDown } from 'lucide-react-native';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { CountryTypeEnum, CountryConfig } from '@/utils/enum/meal.enum';
import { FlashList } from '@shopify/flash-list';
import OpenFoodSearchCard from '@/components/cards/OpenFoodSearchCard';
import { Colors } from '@/utils/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { ProductResult } from '@/utils/api/OpenFoodFactsService';

const PAGE_SIZE = 30;

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [validatedQuery, setValidatedQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<CountryTypeEnum>(CountryTypeEnum.FRANCE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const toast = useToast();

  const {
    data: searchData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery<{ results: ProductResult[], total: number }>({
    queryKey: ['product-search', validatedQuery, selectedCountry, currentPage],
    queryFn: async () => {
      if (!validatedQuery) return { results: [], total: 0 };

      console.log(`Recherche pour: ${validatedQuery} (Pays: ${selectedCountry}, Page: ${currentPage})`);
      
      const searchParams = new URLSearchParams({
        search_terms: validatedQuery,
        fields: 'product_name,brands,nutriments,image_front_url,nutrition_grade_fr',
        page: currentPage.toString(),
        page_size: PAGE_SIZE.toString(),
        json: '1',
        lc: CountryConfig[selectedCountry].code
      });

      searchParams.append('tagtype_0', 'countries');
      searchParams.append('tag_contains_0', 'contains');
      searchParams.append('tag_0', selectedCountry);
      
      const url = `${CountryConfig[selectedCountry].url}/cgi/search.pl?${searchParams.toString()}`;
      console.log(`URL: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`${data.products.length} produits trouvés sur ${data.count}`);
        
        const results = data.products.map((product: any) => ({
          name: product.product_name || 'Produit inconnu',
          brands: product.brands || 'Marque inconnue',
          nutriscore_grade: product.nutrition_grade_fr || 'unknown',
          calories: product.nutriments?.energy_value || product.nutriments?.energy_100g || 0,
          protein: product.nutriments?.proteins_100g || 0,
          carbs: product.nutriments?.carbohydrates_100g || 0,
          fats: product.nutriments?.fat_100g || 0,
          image: product.image_front_url ? { uri: product.image_front_url } : null
        }));

        return {
          results,
          total: data.count || 0
        };
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw new Error('La recherche a pris trop de temps et a été annulée');
        }
        throw error;
      }
    },
    enabled: false,
    staleTime: 30000,
    retry: 1
  });

  const results = searchData?.results || [];
  const totalResults = searchData?.total || 0;
  const hasMoreResults = totalResults > currentPage * PAGE_SIZE;

  React.useEffect(() => {
    if (isError && error instanceof Error) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={`toast-${id}`}
            color={ToastTypeEnum.ERROR}
            title="Erreur de recherche"
            description={error.message}
          />
        ),
      });
    }
  }, [isError, error]);

  const handleSearch = () => {
    if (searchQuery.trim().length < 3) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={`toast-${id}`}
            color={ToastTypeEnum.INFOS}
            title="Terme trop court"
            description="Veuillez entrer au moins 3 caractères"
          />
        ),
      });
      return;
    }

    setCurrentPage(1);
    setValidatedQuery(searchQuery.trim());
    refetch();
  };

  const handleLoadMore = () => {
    if (!isFetching && hasMoreResults) {
      setCurrentPage(prev => prev + 1);
      refetch();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <VStack className="flex-1 w-full gap-4 p-4">
        <Text className="text-xl font-bold">Recherche de produits</Text>
        
        {/* Sélecteur de pays */}
        <Select
          selectedValue={selectedCountry}
          onValueChange={(value: string) => {
            setSelectedCountry(value as CountryTypeEnum);
            if (validatedQuery) {
              setCurrentPage(1);
              refetch();
            }
          }}
        >
          <SelectTrigger>
            <SelectInput placeholder="Sélectionner un pays" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicator />
              <SelectItem label="France" value={CountryTypeEnum.FRANCE} />
              <SelectItem label="Tunisie" value={CountryTypeEnum.TUNISIA} />
              <SelectItem label="Maroc" value={CountryTypeEnum.MOROCCO} />
              <SelectItem label="Algérie" value={CountryTypeEnum.ALGERIA} />
              <SelectItem label="Égypte" value={CountryTypeEnum.EGYPT} />
              <SelectItem label="Espagne" value={CountryTypeEnum.SPAIN} />
              <SelectItem label="Italie" value={CountryTypeEnum.ITALY} />
              <SelectItem label="Allemagne" value={CountryTypeEnum.GERMANY} />
              <SelectItem label="Royaume-Uni" value={CountryTypeEnum.UK} />
            </SelectContent>
          </SelectPortal>
        </Select>
        
        {/* Champ de recherche */}
        <Input variant="outline" className="bg-white/90 rounded-xl h-12 p-2">
          <InputIcon as={Search} className="text-gray-400" />
          <InputField
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </Input>

        <Button
          onPress={handleSearch}
          disabled={isLoading || isFetching}
          className="mb-2"
        >
          {(isLoading || isFetching) ? (
            <ButtonSpinner color={Colors.light.text} />
          ) : (
            <HStack className="items-center justify-center gap-2">
              <ButtonText>Rechercher</ButtonText>
              <ButtonIcon as={Search} />
            </HStack>
          )}
        </Button>
        
        {/* Résultats */}
        <FlashList
          data={results}
          renderItem={({ item, index }) => (
            <OpenFoodSearchCard product={item} index={index} />
          )}
          estimatedItemSize={200}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            !validatedQuery ? (
              <VStack className="items-center justify-center p-8">
                <Search size={48} color={Colors.light.text} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text className="text-center text-gray-500">
                  Entrez un terme de recherche pour commencer
                </Text>
              </VStack>
            ) : (isLoading || isFetching && currentPage === 1) ? (
              <VStack className="items-center justify-center p-8">
                <ButtonSpinner size="large" color={Colors.primary.background} />
                <Text className="text-center text-gray-500 mt-4">
                  Recherche en cours...
                </Text>
              </VStack>
            ) : (
              <VStack className="items-center justify-center p-8">
                <Search size={48} color={Colors.light.text} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text className="text-center text-gray-500">
                  Aucun produit trouvé
                </Text>
              </VStack>
            )
          }
          ListFooterComponent={() => 
            results.length > 0 ? (
              <VStack className="items-center p-4">
                {hasMoreResults ? (
                  <Button
                    variant="outline"
                    onPress={handleLoadMore}
                    disabled={isFetching}
                    className="w-full"
                  >
                    {isFetching ? (
                      <ButtonSpinner color={Colors.primary.background} />
                    ) : (
                      <HStack className="items-center justify-center gap-2">
                        <ButtonText>Charger plus</ButtonText>
                        <ButtonIcon as={ChevronDown} />
                      </HStack>
                    )}
                  </Button>
                ) : (
                  <Text className="text-center text-gray-500">
                    {`${totalResults} produits trouvés`}
                  </Text>
                )}
              </VStack>
            ) : null
          }
        />
      </VStack>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
