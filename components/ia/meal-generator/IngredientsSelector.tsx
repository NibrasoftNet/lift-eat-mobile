import React from 'react';
import { StyleSheet, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Plus, Delete, Search, Check } from 'lucide-react-native';
import { Controller, Control, FormState } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { MealUnitEnum } from '@/utils/enum/meal.enum';
import { MealGeneratorFormType, IngredientFormType } from '@/utils/validation/ia/mealGeneratorForm.schema';
import { UiState, UiStateActions } from '@/hooks/ia/useUiState';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';

interface IngredientsSelectorProps {
  control: Control<MealGeneratorFormType>;
  uiState: UiState;
  uiActions: UiStateActions;
  addIngredient: (ingredient: { id: number, name: string }) => void;
  removeIngredient: (id: number) => void;
  updateIngredientQuantity: (id: number, quantity: number) => void;
}

const IngredientsSelector: React.FC<IngredientsSelectorProps> = ({
  control,
  uiState,
  uiActions,
  addIngredient,
  removeIngredient,
  updateIngredientQuantity
}) => {
  // Récupérer les ingrédients depuis la base de données
  const { data: dbIngredients, isLoading: isLoadingIngredients } = useQuery({
    queryKey: ['ingredients', uiState.searchTerm],
    queryFn: async () => {
      try {
        const result = await sqliteMCPServer.getIngredientsListViaMCP(uiState.searchTerm, 50);
        return result.success ? result.ingredients : [];
      } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients:', error);
        return [];
      }
    },
    staleTime: 30000, // 30 secondes
  });

  // Filtrer les ingrédients en fonction du terme de recherche
  const handleSearch = (text: string) => {
    uiActions.setSearchTerm(text);
  };

  const renderIngredientItem = (ingredient: IngredientFormType) => (
    <Box 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
      }} 
      key={ingredient.id}
    >
      <Text style={{ flex: 1, fontSize: 16 }}>{ingredient.name}</Text>
      <HStack style={{ 
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
      }}>
        <Pressable
          style={{
            width: 30,
            height: 30,
            backgroundColor: '#f0f0f0',
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 4,
          }}
          onPress={() => updateIngredientQuantity(ingredient.id, Math.max(1, ingredient.quantity - 10))}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>-</Text>
        </Pressable>
        <TextInput
          style={{
            width: 50,
            height: 30,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 4,
            textAlign: 'center',
            fontSize: 14,
          }}
          value={ingredient.quantity.toString()}
          keyboardType="numeric"
          onChangeText={(text) => {
            const value = parseInt(text);
            if (!isNaN(value) && value > 0) {
              updateIngredientQuantity(ingredient.id, value);
            }
          }}
        />
        <Text style={{ marginHorizontal: 4, fontSize: 14 }}>g</Text>
        <Pressable
          style={{
            width: 30,
            height: 30,
            backgroundColor: '#f0f0f0',
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 4,
          }}
          onPress={() => updateIngredientQuantity(ingredient.id, ingredient.quantity + 10)}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>+</Text>
        </Pressable>
        <Pressable
          style={{ padding: 4 }}
          onPress={() => removeIngredient(ingredient.id)}
        >
          <Delete size={20} color="#FF5252" />
        </Pressable>
      </HStack>
    </Box>
  );

  const renderIngredientsModal = () => (
    <Modal
      transparent={true}
      visible={uiState.modals.ingredients}
      onRequestClose={() => uiActions.hideModal('ingredients')}
    >
      <Box style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box style={{
          width: '90%',
          height: '80%',
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <HStack style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sélectionner des ingrédients</Text>
            <Pressable
              style={{ padding: 8 }}
              onPress={() => uiActions.hideModal('ingredients')}
            >
              <Text>Fermer</Text>
            </Pressable>
          </HStack>
          
          <HStack style={{
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 8,
            marginBottom: 16,
          }}>
            <Search size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              style={{ flex: 1, paddingVertical: 8 }}
              placeholder="Rechercher un ingrédient..."
              value={uiState.searchTerm}
              onChangeText={handleSearch}
            />
          </HStack>
          
          {isLoadingIngredients ? (
            <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2196F3" />
            </Box>
          ) : (
            <FlatList
              data={dbIngredients}
              keyExtractor={(item) => item.id.toString()}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <Pressable 
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                  }}
                  onPress={() => {
                    addIngredient(item);
                    uiActions.hideModal('ingredients');
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  <Controller
                    control={control}
                    name="selectedIngredients"
                    render={({ field, fieldState, formState }) => {
                      const isSelected = field.value?.some(ing => ing.id === item.id);
                      return isSelected ? <Check size={20} color="#2196F3" /> : <Box style={{ width: 20 }} />;
                    }}
                  />
                </Pressable>
              )}
              ListEmptyComponent={() => (
                <Text style={{
                  textAlign: 'center',
                  marginVertical: 16,
                  opacity: 0.6,
                }}>
                  {uiState.searchTerm 
                    ? "Aucun ingrédient trouvé pour cette recherche"
                    : "Commencez à taper pour rechercher des ingrédients"}
                </Text>
              )}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );

  return (
    <Box style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Ingrédients</Text>
      
      <Controller
        control={control}
        name="selectedIngredients"
        render={({ field, fieldState, formState }) => (
          <>
            <Box style={{ marginBottom: 12 }}>
              {field.value && field.value.length > 0 ? (
                field.value.map(ingredient => renderIngredientItem(ingredient))
              ) : (
                <Text style={{
                  textAlign: 'center',
                  marginVertical: 16,
                  opacity: 0.6,
                }}>
                  Aucun ingrédient sélectionné. Ajoutez des ingrédients pour commencer.
                </Text>
              )}
            </Box>
            
            {fieldState.error && (
              <Text style={{
                color: 'red',
                fontSize: 12,
                marginTop: 4,
                marginBottom: 8,
              }}>
                {fieldState.error.message}
              </Text>
            )}
            
            <Pressable
              style={{
                backgroundColor: '#2196F3',
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 8,
              }}
              onPress={() => uiActions.showModal('ingredients')}
            >
              <Plus size={20} color="white" />
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 8,
              }}>
                Ajouter des ingrédients
              </Text>
            </Pressable>
          </>
        )}
      />
      
      {renderIngredientsModal()}
    </Box>
  );
};

export default IngredientsSelector;
