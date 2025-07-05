import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { IaPlanType, IaDailyPlanType, IaMealType } from '@/utils/validation/ia/ia.schemas';
import { IaError } from '@/utils/services/ia/error.service';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { ChevronDown, ChevronUp, Calendar, Award, Coffee, User } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';
import { useThemeColor } from '@/hooks/useThemeColor';

interface PlanGenerationResultProps {
  plan: IaPlanType | null;
  loading: boolean;
  error: IaError | null;
}

const PlanGenerationResult: React.FC<PlanGenerationResultProps> = ({ plan, loading, error }) => {
  const [expandedDay, setExpandedDay] = React.useState<number | null>(null);
  const [expandedMeal, setExpandedMeal] = React.useState<{ day: number, meal: string } | null>(null);

  // Couleurs du thème
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const lightBackgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#333' }, 'background');
  const cardBackgroundColor = useThemeColor({ light: 'white', dark: '#222' }, 'background');
  const errorBackgroundColor = useThemeColor({ light: '#ffebee', dark: '#3e2c2c' }, 'background');
  const errorTextColor = useThemeColor({ light: '#d32f2f', dark: '#ff6b6b' }, 'text');

  // Fonction pour basculer l'expansion d'un jour
  const toggleDayExpansion = (dayIndex: number) => {
    if (expandedDay === dayIndex) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayIndex);
      setExpandedMeal(null);
    }
  };

  // Fonction pour basculer l'expansion d'un repas
  const toggleMealExpansion = (dayIndex: number, mealName: string) => {
    const isExpanded = 
      expandedMeal?.day === dayIndex && 
      expandedMeal?.meal === mealName;
    
    if (isExpanded) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal({ day: dayIndex, meal: mealName });
    }
  };

  // Afficher un chargement
  if (loading) {
    return (
      <Box style={{
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: cardBackgroundColor,
        borderRadius: 8,
        margin: 16,
      }}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 16,
          textAlign: 'center',
        }}>
          Génération de votre plan nutritionnel en cours...
        </Text>
        <Text style={{
          fontSize: 14,
          color: borderColor,
          textAlign: 'center',
          marginTop: 8,
        }}>
          Cela peut prendre une minute, veuillez patienter.
        </Text>
      </Box>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <Box style={{
        padding: 24,
        backgroundColor: errorBackgroundColor,
        borderRadius: 8,
        margin: 16,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: errorTextColor,
          marginBottom: 8,
        }}>
          Une erreur est survenue
        </Text>
        <Text style={{
          fontSize: 16,
          marginBottom: 8,
        }}>
          {error.message}
        </Text>
        {error.details && (
          <Text style={{
            fontSize: 14,
            color: borderColor,
          }}>
            {error.details}
          </Text>
        )}
      </Box>
    );
  }

  // Si aucun plan n'a été généré
  if (!plan) {
    return null;
  }

  // Fonction pour obtenir l'icône du type de repas
  const getMealTypeIcon = (mealType: string) => {
    switch(mealType) {
      case MealTypeEnum.BREAKFAST:
        return <Coffee size={20} color={accentColor} />;
      case MealTypeEnum.LUNCH:
        return <User size={20} color={accentColor} />;
      case MealTypeEnum.DINNER:
        return <Award size={20} color={accentColor} />;
      default:
        return <Coffee size={20} color={accentColor} />;
    }
  };

  // Rendu d'un repas dans le plan
  const renderMeal = (meal: IaMealType, dayIndex: number) => {
    const isExpanded = 
      expandedMeal?.day === dayIndex && 
      expandedMeal?.meal === meal.type;
    
    return (
      <Box 
        key={`${dayIndex}-${meal.type}`} 
        style={{
          backgroundColor: lightBackgroundColor,
          borderRadius: 8,
          marginBottom: 8,
          overflow: 'hidden',
        }}
      >
        {/* En-tête du repas */}
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            backgroundColor: useThemeColor({ light: '#f5f5f5', dark: '#2a2a2a' }, 'background'),
          }}
          onPress={() => toggleMealExpansion(dayIndex, meal.type)}
        >
          <Box style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {getMealTypeIcon(meal.type)}
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}>{meal.type}</Text>
          </Box>
          {isExpanded ? 
            <ChevronUp size={20} color={accentColor} /> : 
            <ChevronDown size={20} color={accentColor} />
          }
        </Pressable>
        
        {/* Contenu du repas */}
        {isExpanded && (
          <Box style={{
            padding: 12,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 12,
              color: accentColor,
            }}>{meal.name}</Text>
            
            {/* Informations nutritionnelles */}
            <Box style={{
              marginBottom: 16,
              backgroundColor: useThemeColor({ light: '#f8f8f8', dark: '#2a2a2a' }, 'background'),
              padding: 12,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
              }}>Informations nutritionnelles</Text>
              
              <Box style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                }}>Calories</Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                }}>{meal.calories} kcal</Text>
              </Box>
              
              <Box style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                }}>Protéines</Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                }}>{meal.protein}g</Text>
              </Box>
              
              <Box style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                }}>Lipides</Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                }}>{meal.fat}g</Text>
              </Box>
              
              <Box style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <Text style={{
                  fontSize: 14,
                }}>Glucides</Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                }}>{meal.carbs}g</Text>
              </Box>
            </Box>
            
            {/* Ingrédients */}
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              marginTop: 8,
            }}>Ingrédients</Text>
            
            {meal.ingredients?.map((ingredient, idx) => (
              <Box 
                key={`${meal.type}-ingredient-${idx}`}
                style={{
                  marginBottom: 4,
                  paddingHorizontal: 8,
                }}
              >
                <Text style={{
                  fontSize: 14,
                }}>{ingredient.quantity} {ingredient.unit} {ingredient.name}</Text>
              </Box>
            ))}
            
            {/* Instructions de préparation */}
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              marginTop: 16,
            }}>Instructions de préparation</Text>
            
            <Text style={{
              fontSize: 14,
              lineHeight: 20,
            }}>{meal.instructions}</Text>
          </Box>
        )}
      </Box>
    );
  };

  // Rendu d'un jour dans le plan
  const renderDay = (day: IaDailyPlanType, index: number) => {
    const isExpanded = expandedDay === index;
    
    return (
      <Box 
        key={`day-${index}`}
        style={{
          backgroundColor: cardBackgroundColor,
          borderRadius: 8,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          overflow: 'hidden',
        }}
      >
        {/* En-tête du jour */}
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: useThemeColor({ light: '#f0f0f0', dark: '#333' }, 'background'),
          }}
          onPress={() => toggleDayExpansion(index)}
        >
          <Box style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Calendar size={20} color={accentColor} />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 8,
            }}>Jour {index + 1}</Text>
          </Box>
          {isExpanded ? 
            <ChevronUp size={20} color={accentColor} /> : 
            <ChevronDown size={20} color={accentColor} />
          }
        </Pressable>
        
        {/* Afficher les calories journalières */}
        <Box style={{
          backgroundColor: useThemeColor({ light: '#f0f9ff', dark: '#0f3c5d' }, 'background'),
          padding: 8,
          borderBottomWidth: 1,
          borderBottomColor: useThemeColor({ light: '#f0f0f0', dark: '#333' }, 'background'),
        }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 14,
            color: accentColor,
            fontWeight: '500',
          }}>
            {day.nutrition?.calories || 0} calories
          </Text>
        </Box>
        
        {/* Contenu du jour si développé */}
        {isExpanded && (
          <Box style={{
            padding: 8,
          }}>
            {day.meals?.map((meal) => renderMeal(meal, index))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box style={{
      flex: 1,
      padding: 16,
      backgroundColor: lightBackgroundColor,
      borderRadius: 12,
      margin: 8,
    }}>
      {/* Titre et résumé */}
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
      }}>
        Votre Plan Nutritionnel
      </Text>
      
      <Box style={{
        backgroundColor: cardBackgroundColor,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 8,
        }}>
          Résumé
        </Text>
        
        <Text style={{
          fontSize: 16,
          marginBottom: 4,
        }}>
          Objectif: {plan.goal}
        </Text>
        
        <Text style={{
          fontSize: 16,
          marginBottom: 4,
        }}>
          Durée: {plan.days?.length} jours
        </Text>
        
        <Text style={{
          fontSize: 16,
          marginBottom: 4,
        }}>
          Moyenne calorique: {plan.averageDailyCalories} calories/jour
        </Text>
        
        <Text style={{
          fontSize: 16,
          marginBottom: 4,
        }}>
          Restrictions: {plan.dietaryRestrictions?.join(', ') || 'Aucune'}
        </Text>
      </Box>
      
      {/* Liste des jours du plan */}
      <ScrollView style={{
        flex: 1,
      }}>
        {plan.days?.map((day, index) => renderDay(day, index))}
      </ScrollView>
    </Box>
  );
};

export default PlanGenerationResult;
