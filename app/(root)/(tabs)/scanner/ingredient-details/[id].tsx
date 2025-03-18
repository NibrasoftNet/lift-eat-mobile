import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveScannedProductAsIngredient } from '@/utils/services/ingredient.service';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { Pressable } from '@/components/ui/pressable';
import {
  BookmarkPlus,
  CircleChevronLeft,
  Droplets,
  Info,
  Leaf,
  SoupIcon,
  SquareSigma,
  Weight,
} from 'lucide-react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import MacrosInfoCard from '@/components/cards/MacrosInfoCard';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useToast } from '@/components/ui/toast';
import OpenFoodFactsService, { Product } from '@/utils/api/OpenFoodFactsService';

export default function IngredientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  const queryClient = useQueryClient();

  // Fetch product details from Open Food Facts
  const {
    data: product,
    isPending,
    isFetching,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [`product-${id}`],
    queryFn: async () => await OpenFoodFactsService.getProductByBarcode(id as string),
  });

  // Save ingredient mutation
  const { mutateAsync: saveIngredient, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error('No product data available');
      return await saveScannedProductAsIngredient(drizzleDb, product);
    },
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Ingrédient enregistré"
              description="L'ingrédient a été ajouté à votre liste d'ingrédients"
            />
          );
        },
      });
      
      // Invalidate ingredients queries
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.some((key) => key?.toString().startsWith('ingredients')),
      });
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur d'enregistrement"
              description={error.toString()}
            />
          );
        },
      });
    },
  });

  // Handle save product to ingredients
  const handleSaveIngredient = async () => {
    await saveIngredient();
  };

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isPending={isPending}
      isFetching={isFetching}
      isRefetching={isRefetching}
      data={product || {}}
    >
      <ScrollView className="bg-background">
        <VStack space="md" className="p-4">
          {/* Header with back button */}
          <HStack className="justify-between items-center">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center"
            >
              <CircleChevronLeft size={24} color="#3498db" />
            </Pressable>
            
            <Text className="text-lg font-semibold">
              Détails de l'ingrédient
            </Text>
            
            <Box className="w-10" />
          </HStack>

          {/* Main Content */}
          {product && (
            <VStack space="md">
              {/* Product Image and Basic Info */}
              <Card className="p-4 bg-white">
                <VStack space="md" className="items-center">
                  <Avatar size="xl">
                    {product.image_url ? (
                      <AvatarImage 
                        source={{ uri: product.image_url }} 
                        alt={product.product_name || 'Image du produit'}
                      />
                    ) : (
                      <AvatarFallbackText>
                        {product.product_name?.[0] || '?'}
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  
                  <Heading size="lg" className="text-center">
                    {product.product_name || 'Ingrédient sans nom'}
                  </Heading>
                  
                  {product.brands && (
                    <Text className="text-md text-muted-500 text-center">
                      {product.brands}
                    </Text>
                  )}
                  
                  {product.nutriscore_grade && (
                    <HStack space="sm" className="items-center">
                      <Text className="text-sm text-muted-700">
                        Nutriscore:
                      </Text>
                      <Box 
                        className={`w-8 h-8 rounded-full items-center justify-center font-bold ${
                          getNutriscoreColor(product.nutriscore_grade)
                        }`}
                      >
                        <Text className="text-white font-bold">
                          {product.nutriscore_grade.toUpperCase()}
                        </Text>
                      </Box>
                    </HStack>
                  )}
                  
                  <Button 
                    variant="solid" 
                    className="w-full mt-2"
                    onPress={handleSaveIngredient}
                    isDisabled={isSaving}
                  >
                    <ButtonIcon as={BookmarkPlus} />
                    <ButtonText>
                      {isSaving ? 'Enregistrement...' : 'Enregistrer comme ingrédient'}
                    </ButtonText>
                  </Button>
                </VStack>
              </Card>
              
              {/* Nutritional Information */}
              <Card className="p-4 bg-white">
                <VStack space="md">
                  <HStack space="sm" className="items-center">
                    <Icon as={SquareSigma} size="md" color="#3b82f6" />
                    <Text className="text-lg font-semibold">
                      Informations nutritionnelles
                    </Text>
                  </HStack>
                  
                  <Divider />
                  
                  {product.nutriments ? (
                    <VStack space="md">
                      <MacrosInfoCard
                        calories={product.nutriments?.energy_100g || 0}
                        carbs={product.nutriments?.carbohydrates_100g || 0}
                        protein={product.nutriments?.proteins_100g || 0}
                        fats={product.nutriments?.fat_100g || 0}
                        unit="g"
                      />
                      
                      <Text className="text-xs text-muted-500 text-center">
                        Valeurs nutritionnelles pour 100g
                      </Text>
                      
                      <VStack space="sm">
                        <NutrientRow 
                          label="Sucres" 
                          value={product.nutriments?.sugars_100g} 
                          unit="g"
                          icon={<Icon as={Droplets} size="sm" color="#3b82f6" />}
                        />
                        <NutrientRow 
                          label="Fibres" 
                          value={product.nutriments?.fiber_100g} 
                          unit="g"
                          icon={<Icon as={Leaf} size="sm" color="#3b82f6" />}
                        />
                        <NutrientRow 
                          label="Graisses saturées" 
                          value={product.nutriments?.saturated_fat_100g} 
                          unit="g"
                          icon={<Icon as={Weight} size="sm" color="#3b82f6" />}
                        />
                        <NutrientRow 
                          label="Sel" 
                          value={product.nutriments?.salt_100g} 
                          unit="g"
                          icon={<Icon as={SoupIcon} size="sm" color="#3b82f6" />}
                        />
                      </VStack>
                    </VStack>
                  ) : (
                    <Text className="text-center text-muted-500">
                      Informations nutritionnelles non disponibles
                    </Text>
                  )}
                </VStack>
              </Card>
              
              {/* Product Details */}
              <Card className="p-4 bg-white">
                <VStack space="md">
                  <HStack space="sm" className="items-center">
                    <Icon as={Info} size="md" color="#3b82f6" />
                    <Text className="text-lg font-semibold">
                      Détails du produit
                    </Text>
                  </HStack>
                  
                  <Divider />
                  
                  <VStack space="sm">
                    {product.categories && (
                      <DetailRow label="Catégories" value={product.categories} />
                    )}
                    {product.ingredients_text && (
                      <DetailRow label="Ingrédients" value={product.ingredients_text} />
                    )}
                    {product.allergens && (
                      <DetailRow 
                        label="Allergènes" 
                        value={product.allergens}
                        highlighted={true}
                      />
                    )}
                    {product.labels && (
                      <DetailRow label="Labels" value={product.labels} />
                    )}
                    {product.serving_size && (
                      <DetailRow label="Portion" value={product.serving_size} />
                    )}
                    {product.code && (
                      <DetailRow label="Code-barres" value={product.code} />
                    )}
                    {product.stores && (
                      <DetailRow label="Magasins" value={product.stores} />
                    )}
                  </VStack>
                </VStack>
              </Card>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </QueryStateHandler>
  );
}

// Helper component for showing nutrient details
function NutrientRow({ 
  label, 
  value, 
  unit = 'g', 
  icon 
}: { 
  label: string; 
  value: number | undefined; 
  unit?: string; 
  icon: React.ReactNode 
}) {
  return (
    <HStack className="justify-between items-center">
      <HStack space="sm" className="items-center">
        {icon}
        <Text className="text-muted-700">{label}</Text>
      </HStack>
      <Text className="font-medium">
        {value !== undefined && value !== null 
          ? `${value.toFixed(1)} ${unit}` 
          : 'N/A'}
      </Text>
    </HStack>
  );
}

// Helper component for product details
function DetailRow({ 
  label, 
  value, 
  highlighted = false 
}: { 
  label: string; 
  value: string; 
  highlighted?: boolean 
}) {
  return (
    <VStack space="xs">
      <Text className="text-sm font-medium text-muted-700">
        {label}
      </Text>
      <Text 
        className={`${highlighted ? 'text-red-600' : ''} flex-wrap`}
      >
        {value}
      </Text>
      <Divider />
    </VStack>
  );
}

// Helper function to get color based on nutriscore
function getNutriscoreColor(grade: string) {
  switch (grade.toLowerCase()) {
    case 'a':
      return 'bg-green-600';
    case 'b':
      return 'bg-green-500';
    case 'c':
      return 'bg-yellow-500';
    case 'd':
      return 'bg-orange-500';
    case 'e':
      return 'bg-red-600';
    default:
      return 'bg-gray-500';
  }
}
