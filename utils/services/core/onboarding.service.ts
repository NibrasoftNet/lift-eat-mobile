import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface pour les données utilisateur d'onboarding
 */
export interface UserOnboardingData {
  name?: string;
  gender?: 'male' | 'female' | null;
  birthDate?: string; // format ISO
  height?: number;
  heightUnit?: 'cm' | 'ft';
  currentWeight?: number;
  targetWeight?: number;
  weightUnit?: 'kg' | 'lbs';
  physicalActivity?: string; // Niveau d'activité physique (SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTRA_ACTIVE)
  onboardingCompleted?: boolean;
}

/**
 * Service pour gérer les données d'onboarding
 */
export class OnboardingService {
  private static STORAGE_KEY = 'user_onboarding_data';

  /**
   * Sauvegarde les données d'onboarding de l'utilisateur
   */
  static async saveUserData(data: Partial<UserOnboardingData>): Promise<void> {
    try {
      // Récupérer les données existantes
      const existingDataStr = await AsyncStorage.getItem(this.STORAGE_KEY);
      const existingData: Partial<UserOnboardingData> = existingDataStr
        ? JSON.parse(existingDataStr)
        : {};

      // Fusionner les données existantes avec les nouvelles
      const updatedData = { ...existingData, ...data };

      // Enregistrer les données mises à jour
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));

      console.log("Données d'onboarding sauvegardées avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des données d'onboarding:",
        error,
      );
      throw error;
    }
  }

  /**
   * Récupère les données d'onboarding de l'utilisateur
   */
  static async getUserData(): Promise<Partial<UserOnboardingData> | null> {
    try {
      const dataStr = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!dataStr) return null;

      return JSON.parse(dataStr) as Partial<UserOnboardingData>;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'onboarding:",
        error,
      );
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur a complété l'onboarding
   */
  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      return userData?.onboardingCompleted === true;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'onboarding:",
        error,
      );
      return false;
    }
  }

  /**
   * Marque l'onboarding comme complété
   */
  static async completeOnboarding(): Promise<void> {
    await this.saveUserData({ onboardingCompleted: true });
  }

  /**
   * Supprime toutes les données d'onboarding (utilisé lors d'un changement d'utilisateur)
   */
  static async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      console.log("Données d'onboarding effacées");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression des données d'onboarding:",
        error,
      );
    }
  }

  /**
   * Calcule l'IMC (Indice de Masse Corporelle) basé sur les données utilisateur
   */
  static calculateBMI(
    height: number,
    weight: number,
    heightUnit: 'cm' | 'ft',
    weightUnit: 'kg' | 'lbs',
  ): number {
    // Convertir en unités métriques si nécessaire
    const heightInM = heightUnit === 'cm' ? height / 100 : height * 0.3048;
    const weightInKg = weightUnit === 'kg' ? weight : weight * 0.453592;

    // Formule IMC = poids (kg) / taille² (m)
    const bmi = weightInKg / (heightInM * heightInM);

    return parseFloat(bmi.toFixed(1));
  }
}
