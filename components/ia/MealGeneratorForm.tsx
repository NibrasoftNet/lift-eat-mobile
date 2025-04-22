import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { ChevronDown, Plus, Delete } from 'lucide-react-native';
import { useToast } from '@/components/ui/toast';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { MealTypeEnum, MealTypeArray } from '@/utils/enum/meal.enum';
import { CuisineTypeEnum, CuisineTypeArray } from '@/utils/enum/meal.enum';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import iaService from '@/utils/services/ia/ia.service';
import MealPreview from './MealPreview';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface MealGeneratorFormProps {
  onMealGenerated?: (meal: IaMealType) => void;
}

const MealGeneratorForm: React.FC<MealGeneratorFormProps> = ({ onMealGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [showMealTypeModal, setShowMealTypeModal] = useState(false);
  const [showCuisineTypeModal, setShowCuisineTypeModal] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [mealType, setMealType] = useState<string>(MealTypeEnum.BREAKFAST);
  const [cuisineType, setCuisineType] = useState<string>(CuisineTypeEnum.GENERAL);
  const [specificRequirements, setSpecificRequirements] = useState('');
  const [generatedMeal, setGeneratedMeal] = useState<IaMealType | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const toast = useToast();

  const toggleMealType = (value: string) => {
    setMealType(value);
  };

  const toggleCuisineType = (value: string) => {
    setCuisineType(value);
  };

  // Ajouter un champ d'ingrédient
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  // Supprimer un champ d'ingrédient
  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // Mettre à jour un ingrédient
  const updateIngredient = (text: string, index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  // Générer un repas avec l'IA
  const generateMeal = async () => {
    try {
      setLoading(true);
      setGeneratedMeal(null);
      setAiResponse('');

      // Filtrer les ingrédients vides
      const validIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
      
      if (validIngredients.length === 0) {
        toast.show({
          render: ({ id }) => (
            <MultiPurposeToast
              id={id}
              color={ToastTypeEnum.ERROR}
              title="Ingrédients requis"
              description="Veuillez spécifier au moins un ingrédient."
            />
          ),
        });
        return;
      }

      // Construire un prompt spécifique pour la génération de repas
      let promptAdditions = '';
      if (cuisineType !== CuisineTypeEnum.GENERAL) {
        promptAdditions += ` de style ${cuisineType}`;
      }
      if (specificRequirements.trim()) {
        promptAdditions += ` avec ces exigences: ${specificRequirements}`;
      }

      const result = await iaService.generateMeal(validIngredients, mealType);
      
      setAiResponse(result.text);
      
      if (result.success && result.meal) {
        setGeneratedMeal(result.meal);
        
        if (onMealGenerated) {
          onMealGenerated(result.meal);
        }
        
        toast.show({
          render: ({ id }) => (
            <MultiPurposeToast
              id={id}
              color={ToastTypeEnum.SUCCESS}
              title="Repas généré"
              description="Votre repas a été généré avec succès et ajouté à votre collection."
            />
          ),
        });
      } else {
        toast.show({
          render: ({ id }) => (
            <MultiPurposeToast
              id={id}
              color={ToastTypeEnum.ERROR}
              title="Repas généré partiellement"
              description="L'IA a généré une réponse mais n'a pas pu créer un repas structuré. Vérifiez la réponse pour plus de détails."
            />
          ),
        });
      }
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <MultiPurposeToast
            id={id}
            color={ToastTypeEnum.ERROR}
            title="Erreur"
            description={`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`}
          />
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Générateur de Repas IA</ThemedText>
      <ThemedText style={styles.subtitle}>
        Laissez l'IA vous proposer un repas équilibré basé sur vos ingrédients disponibles
      </ThemedText>

      <View style={styles.formControl}>
        <ThemedText style={styles.label}>Type de repas</ThemedText>
        <View style={styles.selectContainer}>
          <TouchableOpacity onPress={() => setShowMealTypeModal(true)} style={styles.select}>
            <ThemedText>{mealType || "Sélectionnez un type de repas"}</ThemedText>
            <ChevronDown size={18} color="#666" />
          </TouchableOpacity>
          
          {showMealTypeModal && (
            <View style={styles.optionsContainer}>
              {MealTypeArray.map((type) => (
                <TouchableOpacity 
                  key={type} 
                  style={styles.option}
                  onPress={() => {
                    toggleMealType(type);
                    setShowMealTypeModal(false);
                  }}
                >
                  <ThemedText>{type}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.formControl}>
        <ThemedText style={styles.label}>Cuisine</ThemedText>
        <View style={styles.selectContainer}>
          <TouchableOpacity onPress={() => setShowCuisineTypeModal(true)} style={styles.select}>
            <ThemedText>{cuisineType || "Sélectionnez un type de cuisine"}</ThemedText>
            <ChevronDown size={18} color="#666" />
          </TouchableOpacity>
          
          {showCuisineTypeModal && (
            <View style={styles.optionsContainer}>
              {CuisineTypeArray.map((type) => (
                <TouchableOpacity 
                  key={type} 
                  style={styles.option}
                  onPress={() => {
                    toggleCuisineType(type);
                    setShowCuisineTypeModal(false);
                  }}
                >
                  <ThemedText>{type}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.formControl}>
        <ThemedText style={styles.label}>Ingrédients disponibles</ThemedText>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: tomates, poulet, riz..."
              value={ingredient}
              onChangeText={(text) => updateIngredient(text, index)}
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={() => removeIngredient(index)}
              disabled={ingredients.length === 1}
            >
              <Delete size={18} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity 
          style={[styles.button, styles.addIngredientButton]}
          onPress={addIngredient} 
        >
          <Plus size={18} color="#fff" style={{marginRight: 8}} />
          <ThemedText style={styles.buttonText}>Ajouter un ingrédient</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.formControl}>
        <ThemedText style={styles.label}>Indications spécifiques (optionnel)</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: utiliser des légumes de saison, 30g de protéines..."
          value={specificRequirements}
          onChangeText={setSpecificRequirements}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading ? styles.buttonDisabled : {}]} 
        onPress={generateMeal} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Générer un repas</ThemedText>
        )}
      </TouchableOpacity>

      {aiResponse && (
        <View style={styles.responseBox}>
          <ThemedText style={styles.responseTitle}>Réponse de l'IA:</ThemedText>
          <ThemedText style={styles.responseText}>{aiResponse}</ThemedText>
        </View>
      )}

      {generatedMeal && <MealPreview meal={generatedMeal} style={styles.mealPreview} />}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  addIngredientButton: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#2196F3',
  },
  selectContainer: {
    position: 'relative',
    zIndex: 1,
  },
  select: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.7,
  },
  formControl: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  mealPreview: {
    marginTop: 24,
  }
});

export default MealGeneratorForm;
