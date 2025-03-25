import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Pressable } from '@/components/ui/pressable';
import {
  CircleChevronLeft,
  Search as SearchIcon,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import MacrosInfoCard from '@/components/cards/MacrosInfoCard';
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

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(
    null,
  );
  const [selectedCuisine, setSelectedCuisine] = useState<
    CuisineTypeEnum | undefined
  >(undefined);
  const router = useRouter();
  const toast = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setSearchResults([]);

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
        setSearchResults(results);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuisineSelect = (cuisine: CuisineTypeEnum | undefined) => {
    setSelectedCuisine(cuisine);
    console.log('Cuisine sélectionnée:', cuisine);
    // Si une recherche a déjà été effectuée, relancer avec le nouveau filtre
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  const handleSelectProduct = (product: ProductResult) => {
    setSelectedProduct(product);
  };

  const handleBackToResults = () => {
    setSelectedProduct(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <VStack className="flex-1 w-full gap-4 p-4">
        <HStack className="w-full h-8 justify-between">
          <Link href="/scanner" asChild>
            <Pressable>
              <Icon as={CircleChevronLeft} className="w-10 h-10 text-black" />
            </Pressable>
          </Link>
        </HStack>

        {!selectedProduct ? (
          <>
            {/* Sélecteur de cuisine */}
            <Box className="w-full h-18 p-2 justify-center">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 10,
                }}
              >
                <>
                  <Button
                    onPress={() => handleCuisineSelect(undefined)}
                    className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                      selectedCuisine === undefined
                        ? 'border-amber-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <ButtonText className="text-black">All</ButtonText>
                  </Button>
                  {cuisineOptions.map((cuisineType) => (
                    <VStack
                      key={cuisineType.name}
                      className="w-16 h-20 items-center"
                    >
                      <Button
                        onPress={() => handleCuisineSelect(cuisineType.name)}
                        className={`bg-transparent p-2 rounded-full h-16 w-16 border-2 ${
                          selectedCuisine === cuisineType.name
                            ? 'border-amber-500'
                            : 'border-gray-200'
                        }`}
                      >
                        <Image
                          source={cuisineType.icon}
                          className="h-14 w-14 object-contain rounded-full"
                          style={{ alignSelf: 'center' }}
                        />
                      </Button>
                      <Text className="text-sm capitalize">
                        {cuisineType.name}
                      </Text>
                    </VStack>
                  ))}
                </>
              </ScrollView>
            </Box>
            <Divider
              orientation="horizontal"
              className={`w-full h-0.5 bg-gray-100`}
            />

            {/* Champ de recherche */}
            <Input
              variant="outline"
              className="bg-white/90 rounded-xl h-12 p-2"
            >
              <InputIcon as={SearchIcon} className="text-gray-400" />
              <InputField
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </Input>

            <Button
              onPress={handleSearch}
              disabled={isLoading}
              className="mb-2"
            >
              <ButtonText>Rechercher</ButtonText>
              <ButtonIcon as={SearchIcon} className="ml-2" />
            </Button>

            {isLoading ? (
              <Box className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-2">Recherche en cours...</Text>
              </Box>
            ) : (
              <FlashList
                data={searchResults}
                renderItem={({ item, index }) => (
                  <OpenFoodSearchCard
                    product={item}
                    handleSelectProduct={() => handleSelectProduct(item)}
                    index={index}
                  />
                )}
                keyExtractor={(item, index) => String(index)}
                estimatedItemSize={200}
                contentContainerStyle={{ padding: 16 }}
              />
            )}
          </>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingBottom: 20,
            }}
          >
            <Button
              variant="outline"
              onPress={handleBackToResults}
              className="self-start mb-2"
            >
              <ButtonText>Retour aux résultats</ButtonText>
            </Button>

            <Box className="h-44 w-full items-center justify-center">
              <Avatar>
                <AvatarFallbackText>
                  {selectedProduct.name?.slice(0, 2).toUpperCase()}
                </AvatarFallbackText>
                {selectedProduct?.image ? (
                  <AvatarImage
                    className="border-2 border-tertiary-500 w-44 h-44 shadow-xl"
                    source={selectedProduct.image}
                  />
                ) : (
                  <AvatarFallbackText>
                    <Icon
                      as={UtensilsCrossedIcon}
                      size="lg"
                      className="stroke-white"
                    />
                  </AvatarFallbackText>
                )}
              </Avatar>
            </Box>

            <Card className="gap-2">
              <HStack space="sm" className="items-center">
                <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
                <VStack className="flex-1">
                  <Text className="font-semibold text-lg">
                    {selectedProduct?.name}
                  </Text>
                  <Text className="text-sm">
                    {selectedProduct?.brands || 'Marque inconnue'} •{' '}
                    {selectedProduct?.categories || 'Catégorie inconnue'}
                  </Text>
                </VStack>
              </HStack>
              <Divider
                orientation="horizontal"
                className={`w-full h-0.5 bg-gray-100`}
              />
              <HStack className="items-center justify-center w-full">
                <HStack className="gap-2 items-center">
                  <Text>Nutriscore:</Text>
                  <Text className="font-semibold">
                    {selectedProduct?.nutriscore_grade
                      ? selectedProduct.nutriscore_grade.toUpperCase()
                      : 'Non disponible'}
                  </Text>
                </HStack>
              </HStack>
            </Card>

            <MacrosInfoCard
              calories={selectedProduct?.calories || 0}
              carbs={selectedProduct?.carbs || 0}
              fats={selectedProduct?.fats || 0}
              protein={selectedProduct?.protein || 0}
              unit="g"
            />
          </ScrollView>
        )}
      </VStack>
    </KeyboardAvoidingView>
  );
}
