import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  Modal,
  
  BackHandler,
} from 'react-native';
import { useIngredientStore } from '@/utils/store/ingredientStore';
import { IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { useTheme } from '@/themeNew';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ingredientDrawerUIService } from '@/utils/services/ui/ingredient-drawer-ui.service';
import { GetIngredientsParams } from '@/utils/interfaces/drawer.interface';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';

// Import des icônes SVG
import { SearchRegularBoldIcon } from '@/assets/icons/figma/regular-bold/SearchRegularBoldIcon';
import { PlusRegularBoldIcon } from '@/assets/icons/figma/regular-bold/PlusRegularBoldIcon';
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';
import { TickSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TickSquareRegularBoldIcon';
import IngredientDetailsRow from './IngredientDetailsRow';

interface IngredientListDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const IngredientListDrawer: React.FC<IngredientListDrawerProps> = ({ visible, onClose }) => {
  const theme = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const userId = useMemo(() => getCurrentUserIdSync() || 0, []);

  // État pour la ligne d’ingrédient développée
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<IngredientWithUniqueId | null>(null);
  const [editingQty, setEditingQty] = useState('');

  const {
    data,
    isLoading: queryLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['ingredients', searchTerm, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const params: GetIngredientsParams = {
        userId,
        searchTerm,
        pageParam,
        pageSize: 10,
      };
      const result = await ingredientDrawerUIService.fetchIngredients(params);
      return {
        data: result.data,
        nextPage: result.nextPage,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: visible && userId !== 0,
    staleTime: 15 * 60 * 1000,
  });

  const ingredients: IngredientWithUniqueId[] = useMemo(() => {
    const all = (data?.pages || []).flatMap((page) => page.data) as IngredientWithUniqueId[];
    // Remove duplicates based on ingredient id to avoid repeating same items
    const uniqueMap = new Map<number, IngredientWithUniqueId>();
    all.forEach((ing) => {
      if (!uniqueMap.has(ing.id)) uniqueMap.set(ing.id, ing);
    });
    return Array.from(uniqueMap.values());
  }, [data]);

  const listWithDetail = useMemo(() => {
    if (!selectedId) return ingredients as any;
    const index = ingredients.findIndex((ing) => ing.id === selectedId);
    if (index === -1) return ingredients as any;
    const detailObj = { type: 'detail', ingredient: ingredients[index] } as const;
    return [...ingredients.slice(0, index + 1), detailObj, ...ingredients.slice(index + 1)] as any;
  }, [ingredients, selectedId]);

  const loading = queryLoading && ingredients.length === 0;

  const {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    updateIngredient,
  } = useIngredientStore();

  // Map to store temporary quantities before ingredient is added
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map());

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const DEFAULT_QTY = 100;

  /**
   * Affiche / cache le panneau de détails d’un ingrédient.
   * – Si l’ingrédient est déjà affiché => on ferme.
   * – Sinon => on l’affiche.
   */
  const handleIngredientPress = (ingredient: IngredientWithUniqueId) => {
    setEditingIngredient(null);
    setSelectedId((prev) => (prev === ingredient.id ? null : ingredient.id));
  };

  const handleToggleIngredient = (ingredient: IngredientWithUniqueId) => {
    const quantity = quantities.get(ingredient.id) ?? DEFAULT_QTY;

    if (isIngredientSelected(ingredient.id)) {
      removeIngredient(ingredient.id);
      logger.info(LogCategory.UI, 'Ingredient removed via drawer', {
        ingredientId: ingredient.id,
        name: ingredient.name,
      });
    } else {
      // Inject chosen quantity before adding
      const ingredientWithQuantity = {
        ...ingredient,
        quantity,
      } as any;
      addIngredient(ingredientWithQuantity);
      updateIngredient(ingredient.id, quantity);
      logger.info(LogCategory.UI, 'Ingredient added via drawer', {
        ingredientId: ingredient.id,
        name: ingredient.name,
        quantity,
      });
    }
  };

  // Handle quantity changes from QuantitySelector
  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => {
      const map = new Map(prev);
      map.set(id, value);
      return map;
    });

    // If ingredient is already in store, update its quantity directly
    if (isIngredientSelected(id)) {
      updateIngredient(id, value);
    }
  };

  const openEditModal = (ing: IngredientWithUniqueId, currentQty: number) => {
    setEditingIngredient(ing);
    setEditingQty(String(currentQty));
  };

  const saveQuantity = () => {
    if (!editingIngredient) return;
    const val = parseInt(editingQty, 10);
    if (!isNaN(val) && val > 0) {
      handleQuantityChange(editingIngredient.id, val);
    }
    setEditingIngredient(null);
  };

  const isIngredientSelected = (id: number) =>
    selectedIngredients.some((it) => it.ingredientStandardId === id);

  // Gestion bouton retour Android pour fermer le panneau
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedId) {
        setSelectedId(null);
        return true; // intercept back
      }
      return false; // let default
    });
    return () => sub.remove();
  }, [selectedId]);

  // Log quand le drawer s'ouvre / se ferme
  useEffect(() => {
    logger.info(
      LogCategory.UI,
      visible ? 'IngredientListDrawer opened' : 'IngredientListDrawer closed',
    );
  }, [visible]);

  // Reset search when drawer is opened
  useEffect(() => {
    if (visible) {
      setSearchTerm('');
      setQuantities(new Map());
    }
  }, [visible]);

  // Styles
  const styles = useMemo(() => {
    return StyleSheet.create({
      modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      drawer: {
        backgroundColor: theme.color('background'),
        borderTopLeftRadius: theme.radius('lg'),
        borderTopRightRadius: theme.radius('lg'),
        height: '80%',
        padding: theme.space('md'),
        elevation: 6,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.space('md'),
      },
      title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.color('primary'),
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.color('backgroundGrey'),
        padding: theme.space('sm'),
        borderRadius: theme.radius('sm'),
        marginBottom: theme.space('md'),
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.color('primary'),
        marginLeft: theme.space('sm'),
      },
      ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.space('sm'),
        borderBottomWidth: 1,
        borderBottomColor: theme.color('backgroundGrey'),
      },
      ingredientName: { fontSize: 15, color: theme.color('primary') },
      ingredientMacros: { fontSize: 12, color: theme.color('blueGrey') },
      selectedItem: { backgroundColor: theme.color('backgroundGreen') },
      listContent: { paddingBottom: theme.space('lg') },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.space('lg'),
      },
      loadingText: { fontSize: 14, marginTop: theme.space('sm') },
      macroKcal: {
        color: '#424242',
        fontWeight: '700',
        fontSize: 14,
      },

      // New nested layout styles
      leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
      imageContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: theme.color('backgroundGrey'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.space('sm'),
      },
      ingredientImage: { width: 48, height: 48, borderRadius: 24 },
      fallbackContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.color('successLighter'),
        justifyContent: 'center',
        alignItems: 'center',
      },
      fallbackText: { color: '#FFF', fontWeight: '700' },
      textContainer: { flexShrink: 1 },
      rightSection: { justifyContent: 'center', alignItems: 'flex-end' },
      quantityText: { fontSize: 16, fontWeight: '600', color: theme.color('success') },
      qtyModal: {
        width: '80%',
        backgroundColor: theme.color('background'),
        padding: theme.space('lg'),
        borderRadius: theme.radius('md'),
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.color('primary'),
        marginBottom: theme.space('md'),
        textAlign: 'center',
      },
      modalInput: {
        borderWidth: 1,
        borderColor: theme.color('success'),
        borderRadius: theme.radius('sm'),
        padding: theme.space('sm'),
        fontSize: 16,
        marginBottom: theme.space('md'),
        textAlign: 'center',
      },
      modalSaveBtn: {
        backgroundColor: theme.color('success'),
        paddingVertical: theme.space('sm'),
        borderRadius: theme.radius('sm'),
        alignItems: 'center',
      },
      modalSaveText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
    });
  }, [theme]);

  // Réinitialiser le détail ouvert à la fermeture du drawer
useEffect(() => {
  if (!visible) setSelectedId(null);
}, [visible]);

return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select an ingredient</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: theme.space('sm') }}>
              <CloseSquareRegularBoldIcon width={24} height={24} color={theme.color('primary')} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <SearchRegularBoldIcon width={20} height={20} color={theme.color('blueGrey')} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search an ingredient..."
              placeholderTextColor={theme.color('blueGrey')}
              value={searchTerm}
              onChangeText={handleSearch}
            />
          </View>

          {/* List */}
          {loading && ingredients.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.color('success')} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={true}
              data={listWithDetail}
              keyExtractor={(item: any) => ('type' in item ? `detail_${item.ingredient.id}` : item.uniqueId ?? `ing_${item.id}`)}
              
              renderItem={({ item }) => {
                if ((item as any).type === 'detail') {
                  const ing = (item as any).ingredient;
                  // Quantité courante depuis le store si sélectionné, sinon map locale
                  const storeQty = selectedIngredients.find((i) => i.ingredientStandardId === ing.id)?.quantity;
                  const currentQty = storeQty ?? quantities.get(ing.id) ?? DEFAULT_QTY;
                  return (
                    <IngredientDetailsRow
                      ingredient={ing}
                      onClose={() => setSelectedId(null)}
                      quantity={currentQty}
                      onQuantityChange={(qty: number) => {
  handleQuantityChange(ing.id, qty);
}}
                    />
                  );
                }

                const selected = isIngredientSelected(item.id);
                // Determine current quantity to display
                const storeQty = selectedIngredients.find(
                  (ing) => ing.ingredientStandardId === item.id,
                )?.quantity;
                const currentQty = selected ? storeQty ?? DEFAULT_QTY : quantities.get(item.id) ?? DEFAULT_QTY;

                return (
                  <Pressable
                    onPress={() => {
                      if (!editingIngredient) handleIngredientPress(item);
                    }}
                    onLongPress={() => {
                      if (selected) openEditModal(item, currentQty);
                    }}
                    delayLongPress={300}
                    style={[styles.ingredientItem, selected && styles.selectedItem]}
                    disabled={!!editingIngredient}
                  >
                    {/* Left section: image + texts */}
                    <View style={styles.leftSection}>
                      <View style={styles.imageContainer}>
                        {item.image ? (
                          <Image
                            source={{ uri: typeof item.image === 'string' ? item.image : `data:image/png;base64,${item.image}` }}
                            style={styles.ingredientImage}
                          />
                        ) : (
                          <View style={styles.fallbackContainer}>
                            <Text style={styles.fallbackText}>{item.name.slice(0, 2).toUpperCase()}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.ingredientName}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 2 }}>
  <Text style={[styles.macroKcal]}>{item.calories} kcal</Text>
  <Text style={{ color: '#FF981F', fontWeight: '700', marginLeft: 10 }}>P:{item.protein}g</Text>
  <Text style={{ color: '#F54336', fontWeight: '700', marginLeft: 10 }}>C:{item.carbs}g</Text>
  <Text style={{ color: '#1A96F0', fontWeight: '700', marginLeft: 10 }}>L:{item.fat}g</Text>
</View>
                      </View>
                    </View>

                    {/* Right section: quantity selector or add icon */}
                    <View style={styles.rightSection}>
                      {selected ? (
                        <Text style={styles.quantityText}>{currentQty} g</Text>
                      ) : (
                        <TouchableOpacity onPress={() => handleToggleIngredient(item)} disabled={!!editingIngredient}>
                          <PlusRegularBoldIcon width={20} height={20} color={theme.color('success')} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </Pressable>
                );
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              contentContainerStyle={styles.listContent}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <ActivityIndicator size="large" color={theme.color('primary')} />
                ) : null
              }
            />
          )}
          
        </View>
      </View>
    </Modal>
  );
};

export default IngredientListDrawer;
