import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';
import { ingredientDrawerUIService } from '@/utils/services/ui/ingredient-drawer-ui.service';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { PlusRegularBoldIcon } from '@/assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { useTheme } from '@/themeNew';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import IngredientDetailsRow from './IngredientDetailsRow';
import { IngredientDetailsData } from './IngredientDetails';
import { resolveStaticImage } from '@/utils/resolveStaticImage';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { SearchRegularBoldIcon } from '@/assets/icons/figma/regular-bold/SearchRegularBoldIcon';

interface IngredientListDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const DEFAULT_QTY = 100;
const PAGE_SIZE: number = (ingredientDrawerUIService as any).PAGE_SIZE ?? 10;

type DetailRowItem = {
  type: 'detail';
  ingredient: IngredientWithUniqueId;
  id: string;
  name: string;
};

type ListItem = IngredientWithUniqueId | DetailRowItem;

const IngredientListDrawerV2: React.FC<IngredientListDrawerProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const userId = useMemo(() => getCurrentUserIdSync() || 0, []);

  const { selectedIngredients, addIngredient, removeIngredient, updateIngredient } = useIngredientStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map());

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['ingredients-drawer', searchTerm, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await ingredientDrawerUIService.fetchIngredients({
        searchTerm,
        userId,
        pageParam,
        pageSize: PAGE_SIZE,
      });
      return {
        data: res.data,
        nextPage: res.nextPage,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: visible && userId !== 0,
    staleTime: 15 * 60 * 1000,
  });

  const ingredients: IngredientWithUniqueId[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((p) => p.data);
  }, [data]);

  const itemsWithDetail: ListItem[] = useMemo(() => {
    if (!selectedId) return ingredients;
    const index = ingredients.findIndex((it) => it.id === selectedId);
    if (index === -1) return ingredients;
    const detailRow: DetailRowItem = {
      type: 'detail',
      ingredient: ingredients[index],
      id: `detail-${ingredients[index].id}`,
      name: `detail-${ingredients[index].name}`,
    };
    return [...ingredients.slice(0, index + 1), detailRow, ...ingredients.slice(index + 1)];
  }, [ingredients, selectedId]);

  const isSelected = useCallback((id: number) => selectedIngredients.some((it) => it.ingredientStandardId === id), [selectedIngredients]);

  const handleQuantityChange = useCallback((id: number, value: number) => {
    setQuantities((prev) => new Map(prev).set(id, value));
    if (isSelected(id)) {
      updateIngredient(id, value);
    }
  }, [isSelected, updateIngredient]);

  const handleToggleIngredient = useCallback((ingredient: IngredientWithUniqueId) => {
    const quantity = quantities.get(ingredient.id) ?? DEFAULT_QTY;
    if (isSelected(ingredient.id)) {
      removeIngredient(ingredient.id);
    } else {
      addIngredient({ ...ingredient, quantity } as any);
      updateIngredient(ingredient.id, quantity);
    }
  }, [quantities, isSelected, removeIngredient, addIngredient, updateIngredient]);

  const renderIngredientRow = useCallback(
    (ing: IngredientWithUniqueId) => {
      const selected = isSelected(ing.id);
      const qty = quantities.get(ing.id) ?? DEFAULT_QTY;

      return (
        <Pressable
          key={ing.id}
          style={styles.row}
          onPress={() => setSelectedId((prev) => (prev === ing.id ? null : ing.id))}
        >
          <View style={styles.leftSection}>
            <View style={styles.imageContainer}>
              {(() => {
                const displayImage: any = (ing as any).imageUrl ?? ing.image;
                if (displayImage) {
                  const src = typeof displayImage === 'string'
                    ? resolveStaticImage(displayImage)
                    : { uri: `data:image/png;base64,${displayImage}` };
                  logger.debug(LogCategory.UI, 'IngredientRow image resolved', { ingredientId: ing.id, hasImage: !!displayImage });
                  return <Image source={src} style={styles.ingredientImage} />;
                }
                return (
                  <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackText}>{ing.name.slice(0, 2).toUpperCase()}</Text>
                  </View>
                );
              })()}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <View style={styles.macroRow}>
                <Text style={styles.macroKcal}>{ing.calories} kcal</Text>
                <Text style={styles.macroP}>P:{ing.protein}g</Text>
                <Text style={styles.macroC}>C:{ing.carbs}g</Text>
                <Text style={styles.macroF}>L:{ing.fat}g</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            {selected ? (
              <Text style={styles.quantityText}>{qty} g</Text>
            ) : (
              <TouchableOpacity onPress={() => handleToggleIngredient(ing)}>
                <PlusRegularBoldIcon width={20} height={20} color={theme.color('success')} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      );
    },
    [isSelected, quantities, handleToggleIngredient, theme],
  );

  const renderDetailRow = useCallback(
    (item: DetailRowItem) => {
      const ing = item.ingredient;
      const qty = quantities.get(ing.id) ?? DEFAULT_QTY;

      const detailsData: IngredientDetailsData = {
        name: ing.name,
        calories: ing.calories,
        protein: ing.protein,
        carbs: ing.carbs,
        fat: ing.fat,
        image: typeof ing.image === 'string' ? ing.image : `data:image/png;base64,${ing.image}`,
      };

      return (
        <IngredientDetailsRow
          key={item.id}
          ingredient={detailsData}
          quantity={qty}
          onQuantityChange={(value) => handleQuantityChange(ing.id, value)}
          onClose={() => setSelectedId(null)}
        />
      );
    },
    [quantities, handleQuantityChange],
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if ('type' in item && item.type === 'detail') {
        return renderDetailRow(item as DetailRowItem);
      }
      return renderIngredientRow(item as IngredientWithUniqueId);
    },
    [renderIngredientRow, renderDetailRow],
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.drawerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un ingrédient</Text>
            <TouchableOpacity onPress={onClose}>
              <CloseSquareRegularBoldIcon width={24} height={24} color={theme.color('primary')} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchRegularBoldIcon width={20} height={20} color={theme.color('primary')} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un ingrédient..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor={theme.color('blueGrey')}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.color('primary')} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={itemsWithDetail}
              renderItem={renderItem}
              keyExtractor={(item: ListItem) => item.id.toString()}
              onEndReached={() => hasNextPage && fetchNextPage()}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.color('primary')} /> : null}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default IngredientListDrawerV2;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    height: '85%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ingredientImage: { width: '100%', height: '100%' },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: { fontWeight: '700', color: '#555' },
  textContainer: { flex: 1 },
  ingredientName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  macroKcal: { color: '#8B5CF6', fontWeight: '700' },
  macroP: { color: '#FF981F', fontWeight: '700', marginLeft: 10 },
  macroC: { color: '#F54336', fontWeight: '700', marginLeft: 10 },
  macroF: { color: '#1A96F0', fontWeight: '700', marginLeft: 10 },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 60,
  },
  quantityText: { fontWeight: '700', color: '#A4C73B' },
});