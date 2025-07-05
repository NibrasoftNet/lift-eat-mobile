/**
 * Service de gestion du formulaire de genre
 * Fournit des fonctionnalités pour l'animation et les styles du composant GenderFormInput
 */

import { GenderEnum } from '@/utils/enum/user-gender-activity.enum';
import { SharedValue } from 'react-native-reanimated';
import { GenderFormServiceInterface } from '@/utils/interfaces/form-input.interface';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Implémentation du service de gestion du formulaire de genre
 */
class GenderFormService implements GenderFormServiceInterface {
  /**
   * Initialise les valeurs d'animation pour le genre
   * @param defaultGender - Le genre par défaut
   * @param maleBarWidth - Valeur partagee pour la largeur de la barre masculine
   * @param femaleBarWidth - Valeur partagee pour la largeur de la barre féminine
   */
  initializeGenderAnimations(
    defaultGender: GenderEnum,
    maleBarWidth: SharedValue<number>,
    femaleBarWidth: SharedValue<number>,
  ): void {
    try {
      // Définir les valeurs initiales en fonction du genre par défaut
      maleBarWidth.value = defaultGender === GenderEnum.MALE ? 100 : 0;
      femaleBarWidth.value = defaultGender === GenderEnum.FEMALE ? 100 : 0;
    } catch (error) {
      logger.error(
        LogCategory.FORM,
        `Error initializing gender animations: ${error}`,
      );
    }
  }

  /**
   * Anime les barres de genre lors du changement
   * @param selectedGender - Le genre sélectionné
   * @param maleBarWidth - Valeur partagee pour la largeur de la barre masculine
   * @param femaleBarWidth - Valeur partagee pour la largeur de la barre féminine
   * @param duration - Durée de l'animation en ms
   */
  animateGenderChange(
    selectedGender: GenderEnum,
    maleBarWidth: SharedValue<number>,
    femaleBarWidth: SharedValue<number>,
    duration: number = 300,
  ): void {
    try {
      // Animer les barres en fonction du genre sélectionné avec la durée spécifiée
      maleBarWidth.value = selectedGender === GenderEnum.MALE ? 100 : 0;
      femaleBarWidth.value = selectedGender === GenderEnum.FEMALE ? 100 : 0;
    } catch (error) {
      logger.error(LogCategory.FORM, `Error animating gender change: ${error}`);
    }
  }

  /**
   * Obtient les styles CSS pour les boutons de genre
   * @param currentGender - Le genre actuel
   * @param targetGender - Le genre cible pour les styles
   * @returns Les classes CSS pour le bouton
   */
  getGenderButtonStyles(
    currentGender: GenderEnum,
    targetGender: GenderEnum,
  ): {
    buttonClass: string;
    textClass: string;
  } {
    try {
      // Bouton sélectionné ou non
      const isSelected = currentGender === targetGender;

      // Classes de base pour tous les boutons
      const baseButtonClass = 'w-full h-full';
      const baseTextClass = 'text-gray-500';

      // Ajouter des classes pour le bouton sélectionné
      const buttonClass = isSelected
        ? `${baseButtonClass} bg-transparent`
        : `${baseButtonClass} bg-transparent`;

      // Ajouter des classes pour le texte du bouton sélectionné
      const textClass = isSelected
        ? `${baseTextClass} font-bold`
        : baseTextClass;

      return { buttonClass, textClass };
    } catch (error) {
      logger.error(
        LogCategory.FORM,
        `Error getting gender button styles: ${error}`,
      );
      // Retourner des styles par défaut en cas d'erreur
      return {
        buttonClass: 'w-full h-full bg-transparent',
        textClass: 'text-gray-500',
      };
    }
  }

  /**
   * Obtient les styles pour les barres d'animation de genre
   * @param gender - Le genre pour lequel obtenir les styles
   * @returns Les styles pour la barre d'animation
   */
  getGenderBarStyles(gender: GenderEnum) {
    return {
      barColor: gender === GenderEnum.MALE ? 'blue' : 'orange',
      position: gender === GenderEnum.MALE ? 'left' : 'right',
    };
  }
}

// Exporter une instance unique du service
export const genderFormService = new GenderFormService();
