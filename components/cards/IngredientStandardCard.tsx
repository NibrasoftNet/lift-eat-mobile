import React, { useEffect, memo, useMemo } from 'react';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { resolveStaticImage } from '@/utils/resolveStaticImage';
import { Box } from '../ui/box';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import {
  HandPlatter,
  MinusCircle,
  PlusCircle,
  UtensilsCrossedIcon,
} from 'lucide-react-native';
import { IngredientStandardOrmProps } from '@/db/schema';
import { useRouter } from 'expo-router';
import { Card } from '../ui/card';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button, ButtonIcon } from '@/components/ui/button';
import NutritionBox from '@/components/boxes/NutritionBox';
import { Divider } from '@/components/ui/divider';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { createStableId, ItemType } from '@/utils/helpers/uniqueId';

/**
 * Interface d'ingrédient avec un identifiant unique pour éviter les collisions de stableId
 */
interface IngredientWithStableId extends IngredientStandardOrmProps {
  uniqueId?: string;
}

// Image par défaut
const DEFAULT_INGREDIENT_IMAGE = require('@/assets/images/logo_no_bg.png');

// Solution optimisée, pas de lecture/écriture de valeurs Reanimated pendant le rendu
const IngredientStandardCard = memo(
  ({ item, index }: { item: IngredientWithStableId; index: number }) => {
    // Résolution de l'image avec mémoïsation et logging
    const resolvedImage = useMemo(() => {
      const src = resolveStaticImage(item.image as unknown as string, DEFAULT_INGREDIENT_IMAGE);
      logger.debug(LogCategory.UI, 'IngredientStandardCard image resolved', {
        ingredientId: item.id,
        hasImage: !!item.image,
      });
      return src;
    }, [item.image, item.id, item.name]);
    const router = useRouter();

    // Zustand store hooks avec sélecteur pour éviter les re-rendus inutiles
    const isIngredientSelected = useIngredientStore((state) => {
      const foundIndex = state.selectedIngredients.findIndex(
        (ing) => ing.ingredientStandardId === item.id,
      );
      return foundIndex !== -1;
    });

    const toggleIngredient = useIngredientStore(
      (state) => state.toggleIngredient,
    );

    // Pre-calculer l'identifiant stable
    const stableId = useMemo(() => {
      return (
        item.uniqueId ||
        createStableId(ItemType.INGREDIENT, item.id, undefined, index)
      );
    }, [item.uniqueId, item.id, index]);

    // IMPORTANT: Supprimer complètement les animations pour résoudre les problèmes de performance
    // Nous utilisons une approche statique sans animation pour éviter les warnings Reanimated
    // et améliorer dramatiquement les performances dans les listes longues

    // Les anciennes animations causaient de nombreux warnings Reanimated et ralentissaient l'application
    const isFirstRender = React.useRef(true);

    // Utilisons un style statique sans animations pour une performance maximale
    // Ce code est beaucoup plus performant et évite les warnings Reanimated
    useEffect(() => {
      // Marquer que le premier rendu est passé
      isFirstRender.current = false;
    }, []);

    // Style statique remplaçant l'ancien style animé
    // Cette approche évite complètement les problèmes de performance avec Reanimated
    const cardStyle = {
      opacity: 1,
      transform: [{ translateY: 0 }],
    };

    return (
      <Box
        style={cardStyle}
        className="rounded-xl overflow-hidden mb-2"
        key={stableId}
      >
        <Card
          className={`w-full items-center gap-2 p-2 transition-all ease-in-out duration-300 ${
            isIngredientSelected ? 'bg-secondary-500' : 'bg-white'
          }`}
        >
          <HStack className="w-full items-center justify-between">
            <HStack className="flex-1 items-center gap-2">
              <Box className="flex-col items-center justify-center w-16 h-16">
                <Avatar>
                  <AvatarFallbackText>
                    {item.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallbackText>
                  {item.image ? (
                    <AvatarImage
                      className="border-2 border-tertiary-500 w-16 h-16 shadow-md"
                      source={resolvedImage}
                    />
                  ) : (
                    <Icon as={HandPlatter} size="lg" className="stroke-white" />
                  )}
                </Avatar>
              </Box>
              <VStack className="flex-1">
                <Text className="text-xl font-bold">{item.name}</Text>
                <Text className="text-sm">
                  {item.quantity} • {item.unit}
                </Text>
              </VStack>
            </HStack>
            <Button
              // Utiliser un handler séparé pour éviter le risque d'accès à des valeurs Reanimated pendant le rendu
              onPress={() => {
                // Exécuter l'action après le cycle de rendu via setTimeout(0)
                // Cette approche évite l'accès aux shared values pendant le rendu
                setTimeout(() => {
                  toggleIngredient(item);
                }, 0);
              }}
              action="secondary"
              className="w-12 h-12 bg-transparent"
            >
              <ButtonIcon
                as={isIngredientSelected ? MinusCircle : PlusCircle}
                className="w-10 h-10"
              />
            </Button>
          </HStack>
          <Divider
            orientation="horizontal"
            className="w-full h-0.5 bg-gray-100"
          />
          <VStack className="mt-4">
            <HStack className="items-center justify-between mb-2">
              <HStack space="sm" className="items-center flex-1">
                <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
                <Text className="capitalize text-xl font-semibold">
                  Macronutrients
                </Text>
              </HStack>
              <NutritionBox
                title="Calories"
                value={item.calories}
                unit="KCal"
                className="w-24"
                titleClassName="bg-red-500"
                valueClassName="bg-red-300"
              />
            </HStack>
            <HStack className="justify-around pt-3 border-t border-gray-100">
              <NutritionBox
                title="Carbs"
                value={item.carbs}
                unit="Gr"
                className="w-24"
                titleClassName="bg-amber-500"
                valueClassName="bg-amber-300"
              />
              <Divider
                orientation="vertical"
                className="w-0.5 h-14 bg-gray-100 mx-3"
              />
              <NutritionBox
                title="Fats"
                value={item.fat}
                unit="Gr"
                className="w-24"
                titleClassName="bg-green-500"
                valueClassName="bg-green-300"
              />
              <Divider
                orientation="vertical"
                className="w-0.5 h-14 bg-gray-300 mx-3"
              />
              <NutritionBox
                title="Protein"
                value={item.protein}
                unit="Gr"
                className="w-24"
                titleClassName="bg-blue-500"
                valueClassName="bg-blue-300"
              />
            </HStack>
          </VStack>
        </Card>
      </Box>
    );
  },
);

// Ajouter un displayName pour le débogage
IngredientStandardCard.displayName = 'IngredientStandardCard';

export default IngredientStandardCard;
