import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import {
  Button,
  ButtonText,
  ButtonIcon,
  ButtonSpinner,
} from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Search } from 'lucide-react-native';
import OpenFoodFactsService, {
  ProductResult,
  SearchParams,
} from '@/utils/api/OpenFoodFactsService';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { cuisineOptions } from '@/utils/constants/constant';
import { FlashList } from '@shopify/flash-list';
import OpenFoodSearchCard from '@/components/cards/OpenFoodSearchCard';
import { useQuery } from '@tanstack/react-query';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { Colors } from '@/utils/constants/Colors';
import CuisineTypeBox from '@/components/boxes/CuisineTypeBox';

export default function SearchWithOpenFood() {
  const [searchQuery, setSearchQuery] = useState<string>('pasta');
  const [selectedCuisine, setSelectedCuisine] = useState<
    CuisineTypeEnum | undefined
  >(undefined);
  const router = useRouter();
  const toast = useToast();

  const {
    data: searchResults,
    isPending,
    isFetching,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['search'],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return null;
      }
      try {
        // Définir les paramètres de recherche de base
        let params: SearchParams = {
          search_terms: searchQuery.trim(),
          page_size: 50,
          lang: 'fr',
        };

        // Si une cuisine est sélectionnée, ajouter le tag correspondant
        if (selectedCuisine) {
          console.log(`Searching with cuisine filter: ${selectedCuisine}`);
          // Convertir le type de cuisine en tag compatible avec OpenFoodFacts
          const cuisineTag = selectedCuisine.toLowerCase();
          params = { ...params, tag: cuisineTag };
        }

        console.log('Search params:', params);
        const results =
          await OpenFoodFactsService.searchProductsWithResults(params);
        console.log(`Got ${results.length} results back from service`);

        if (results && results.length > 0) {
          return results;
        } else {
          toast.show({
            placement: 'top',
            render: ({ id }: { id: string }) => {
              const toastId = 'toast-' + id;
              return (
                <MultiPurposeToast
                  id={toastId}
                  color={ToastTypeEnum.INFOS}
                  title="Aucun résultat"
                  description="Aucun produit trouvé avec ce terme de recherche"
                />
              );
            },
          });
          return null;
        }
      } catch (error) {
        console.error('Error searching products:', error);
        toast.show({
          placement: 'top',
          render: ({ id }: { id: string }) => {
            const toastId = 'toast-' + id;
            return (
              <MultiPurposeToast
                id={toastId}
                color={ToastTypeEnum.ERROR}
                title="Erreur de recherche"
                description="Une erreur est survenue lors de la recherche"
              />
            );
          },
        });
        return null;
      }
    },
  });

  const handleSearch = async () => {
    await refetch();
  };

  const handleCuisineSelect = (cuisine: CuisineTypeEnum | undefined) => {
    setSelectedCuisine(cuisine);
    console.log('Cuisine sélectionnée:', cuisine);
    // Si une recherche a déjà été effectuée, relancer avec le nouveau filtre
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <VStack className="flex-1 w-full gap-4 p-4">
        {/* Sélecteur de cuisine */}
        <CuisineTypeBox
          selectedCuisine={selectedCuisine}
          handleCuisineSelect={handleCuisineSelect}
        />
        <Divider
          orientation="horizontal"
          className={`w-full h-0.5 bg-gray-100`}
        />
        {/* Champ de recherche */}
        <Input variant="outline" className="bg-white/90 rounded-xl h-12 p-2">
          <InputIcon as={Search} className="text-gray-400" />
          <InputField
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </Input>

        <Button
          onPress={handleSearch}
          disabled={isLoading || isFetching || isPending || isRefetching}
          className="mb-2"
        >
          {isLoading || isFetching || isPending || isRefetching ? (
            <ButtonSpinner size="large" color={Colors.light.icon} />
          ) : (
            <HStack className="items-center justify-center gap-2">
              <ButtonText>Rechercher</ButtonText>
              <ButtonIcon as={Search} className="ml-2" />
            </HStack>
          )}
        </Button>
        <QueryStateHandler<ProductResult>
          data={searchResults}
          isLoading={isLoading}
          isFetching={isFetching}
          isPending={isPending}
          isRefetching={isRefetching}
        >
          <FlashList
            data={searchResults}
            renderItem={({ item, index }) => (
              <OpenFoodSearchCard product={item} index={index} />
            )}
            ListEmptyComponent={<VStack>Empty result</VStack>}
            keyExtractor={(item, index) => String(index)}
            estimatedItemSize={200}
            contentContainerStyle={{ padding: 0 }}
          />
        </QueryStateHandler>
      </VStack>
    </KeyboardAvoidingView>
  );
}
