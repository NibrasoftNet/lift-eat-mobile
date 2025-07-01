/**
 * Service UI pour l'affichage standardisé des valeurs nutritionnelles
 * 
 * Centralise tous les formatages liés à l'affichage nutritionnel
 * pour assurer une cohérence à travers l'application.
 */

import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { NutritionRoundingPolicy } from '@/utils/constants/nutrition-constants';
import { roundToDecimals } from '@/utils/helpers/precision.helper';
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { nutritionPagesService } from '../pages/nutrition-pages.service';

/**
 * NutritionUIService
 * 
 * Service dédié au formatage et à la présentation des valeurs nutritionnelles
 * pour les composants UI, notamment la standardisation de l'affichage à 100g.
 */
class NutritionUIService {
  /**
   * Formate les valeurs nutritionnelles pour un affichage standardisé à 100g
   * 
   * @param macros Valeurs nutritionnelles brutes
   * @param totalWeight Poids total en grammes
   * @param displayMode Mode d'affichage (par défaut PER_100G)
   * @returns Objet formaté avec valeurs normalisées et texte d'affichage
   */
  formatNutritionFor100g(
    macros: MacroNutrientsBase,
    totalWeight: number,
    displayMode: NutritionDisplayMode = NutritionDisplayMode.PER_100G
  ) {
    try {
      // Déléguer directement au nutritionEngine pour la normalisation
      const engineResult = nutritionEngine.normalizeForDisplay(macros, totalWeight, displayMode);
      
      // Adapter au format attendu par les composants UI
      const result = {
        normalizedMacros: engineResult.normalizedMacros || macros,
        displayText: engineResult.displayText || 'Valeurs nutritionnelles',
        adjustmentFactor: engineResult.normalizationFactor || 1
      };
      
      // Ajouter des métadonnées UI supplémentaires pour faciliter l'affichage
      return {
        ...result,
        isStandardized: displayMode === NutritionDisplayMode.PER_100G,
        cssClasses: {
          container: 'nutrition-standardized',
          label: displayMode === NutritionDisplayMode.PER_100G ? 'nutrition-label-100g' : 'nutrition-label-raw'
        }
      };
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur lors du formatage des valeurs nutritionnelles pour affichage à 100g', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Valeurs par défaut en cas d'erreur
      return {
        normalizedMacros: { ...macros },
        displayText: 'Erreur de formatage',
        adjustmentFactor: 1,
        isStandardized: false,
        cssClasses: { container: 'nutrition-error', label: 'nutrition-label-error' }
      };
    }
  }
  
  /**
   * Formate le facteur d'ajustement pour l'affichage UI
   * 
   * @param factor Facteur d'ajustement (1.0 = 100%, 0.5 = 50%, etc.)
   * @param includePrefix Ajouter le préfixe "Ajustement:"
   * @returns Chaîne formatée (ex: "Ajustement: 0.50×" ou "0.50×")
   */
  formatAdjustmentFactor(factor: number, includePrefix: boolean = true): string {
    try {
      if (!factor || isNaN(factor)) {
        return includePrefix ? 'Ajustement: 1.00×' : '1.00×';
      }
      
      // Arrondir à 2 décimales avec gestion des cas spéciaux
      const roundedFactor = roundToDecimals(factor, 2);
      
      // Formater avec toujours 2 décimales (ex: 1.50 au lieu de 1.5)
      const formattedFactor = roundedFactor.toFixed(2);
      
      // Ajouter le symbole de multiplication (×)
      const factorWithSymbol = `${formattedFactor}×`;
      
      return includePrefix ? `Ajustement: ${factorWithSymbol}` : factorWithSymbol;
    } catch (error) {
      logger.warn(LogCategory.UI, 'Erreur lors du formatage du facteur d\'ajustement', {
        error: error instanceof Error ? error.message : String(error),
        factor
      });
      
      // Valeur par défaut en cas d'erreur
      return includePrefix ? 'Ajustement: 1.00×' : '1.00×';
    }
  }
  
  /**
   * Formate une valeur nutritionnelle individuelle avec son unité
   * 
   * @param value Valeur numérique
   * @param type Type de nutriment ('calories', 'carbs', 'protein', 'fat')
   * @param includeUnit Inclure l'unité dans le résultat
   * @returns Valeur formatée avec unité si demandée
   */
  formatNutrientValue(
    value: number,
    type: 'calories' | 'carbs' | 'protein' | 'fat',
    includeUnit: boolean = true
  ): string {
    try {
      // Utiliser le service de formatage existant
      const formattedValue = nutritionEngine.formatForUI(value, type);
      
      // Ajouter l'unité si demandé
      if (includeUnit) {
        const unit = type === 'calories' ? 'kcal' : 'g';
        return `${formattedValue} ${unit}`;
      }
      
      return formattedValue;
    } catch (error) {
      logger.warn(LogCategory.UI, 'Erreur lors du formatage d\'une valeur nutritionnelle', {
        error: error instanceof Error ? error.message : String(error),
        value,
        type
      });
      
      // Valeur par défaut en cas d'erreur
      return value.toString() + (includeUnit ? (type === 'calories' ? ' kcal' : ' g') : '');
    }
  }
  
  /**
   * Crée un texte d'affichage complet pour les valeurs nutritionnelles
   * 
   * @param macros Valeurs nutritionnelles
   * @param totalWeight Poids total
   * @param displayMode Mode d'affichage
   * @returns Texte formaté avec toutes les informations
   */
  createNutritionDisplayText(
    macros: MacroNutrientsBase,
    totalWeight: number,
    displayMode: NutritionDisplayMode = NutritionDisplayMode.PER_100G
  ): string {
    try {
      const result = this.formatNutritionFor100g(macros, totalWeight, displayMode);
      
      // Construire un texte complet avec les valeurs nutritionnelles
      const caloriesText = this.formatNutrientValue(result.normalizedMacros.calories, 'calories');
      const proteinText = this.formatNutrientValue(result.normalizedMacros.protein, 'protein');
      const carbsText = this.formatNutrientValue(result.normalizedMacros.carbs, 'carbs');
      const fatText = this.formatNutrientValue(result.normalizedMacros.fat, 'fat');
      
      // Texte d'affichage principal (ex: "Pour 100g")
      const displayText = result.displayText;
      
      // Ajouter le facteur d'ajustement si ce n'est pas 1.0 (AS_IS)
      const adjustmentText = displayMode !== NutritionDisplayMode.AS_IS
        ? ` (${this.formatAdjustmentFactor(result.adjustmentFactor, false)})`
        : '';
      
      return `${displayText}${adjustmentText} • ${caloriesText} • P: ${proteinText} • G: ${carbsText} • L: ${fatText}`;
    } catch (error) {
      logger.error(LogCategory.UI, 'Erreur lors de la création du texte d\'affichage nutritionnel', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return 'Informations nutritionnelles indisponibles';
    }
  }
  
  /**
   * Génère les classes CSS pour l'affichage conditionnel des composants nutritionnels
   * 
   * @param isStandardized Si l'affichage est standardisé (100g)
   * @param isEmpty Si les valeurs sont vides/nulles
   * @returns Classes CSS à appliquer aux composants
   */
  getNutritionCssClasses(isStandardized: boolean = true, isEmpty: boolean = false): Record<string, string> {
    return {
      container: `nutrition-container ${isStandardized ? 'standardized' : ''} ${isEmpty ? 'empty' : ''}`,
      label: isStandardized ? 'nutrition-label nutrition-label-100g' : 'nutrition-label',
      value: isEmpty ? 'nutrition-value empty' : 'nutrition-value',
      icon: isStandardized ? 'nutrition-icon standardized' : 'nutrition-icon'
    };
  }
}

// Export d'une instance unique du service
export const nutritionUIService = new NutritionUIService();
