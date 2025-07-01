import { useState, useEffect, useCallback } from 'react';
import IAVoiceService from '@/utils/services/ia/iaVoiceService';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Hook pour utiliser les fonctionnalités vocales du service IA dans les composants React
 * 
 * @param initialAutoRead État initial de la lecture automatique
 * @returns Méthodes et état pour interagir avec l'IA en utilisant la synthèse vocale
 */
export const useIAVoice = (initialAutoRead: boolean = false) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState<boolean>(initialAutoRead);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Synchroniser l'état de la lecture automatique avec le service
  useEffect(() => {
    try {
      IAVoiceService.setAutoRead(autoReadEnabled);
    } catch (err) {
      logger.error(LogCategory.IA, `Erreur lors de la configuration de la lecture automatique: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [autoReadEnabled]);

  // Vérifier périodiquement l'état de la synthèse vocale
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSpeaking) {
      interval = setInterval(async () => {
        const speaking = await IAVoiceService.isSpeakingNow();
        if (!speaking && isSpeaking) {
          setIsSpeaking(false);
        }
      }, 500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSpeaking]);

  // Méthode pour générer une réponse IA avec synthèse vocale
  const generateResponse = useCallback(async (
    prompt: string,
    forceVoiceOutput: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await IAVoiceService.generateResponseWithVoice(prompt, forceVoiceOutput);
      
      setIsSpeaking(response.voiceOutput);
      setIsLoading(false);
      
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(`Erreur lors de la génération de réponse: ${err instanceof Error ? err.message : String(err)}`);
      logger.error(LogCategory.IA, `Erreur lors de la génération de réponse vocale: ${err instanceof Error ? err.message : String(err)}`);
      
      return {
        text: `Désolé, une erreur s'est produite: ${err instanceof Error ? err.message : String(err)}`,
        voiceOutput: false
      };
    }
  }, []);

  // Méthode pour analyser les habitudes alimentaires avec synthèse vocale
  const analyzeNutritionHabits = useCallback(async (
    forceVoiceOutput: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await IAVoiceService.analyzeNutritionHabitsWithVoice(forceVoiceOutput);
      
      setIsSpeaking(response.voiceOutput);
      setIsLoading(false);
      
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(`Erreur lors de l'analyse des habitudes: ${err instanceof Error ? err.message : String(err)}`);
      logger.error(LogCategory.IA, `Erreur lors de l'analyse vocale des habitudes: ${err instanceof Error ? err.message : String(err)}`);
      
      return {
        text: `Désolé, une erreur s'est produite: ${err instanceof Error ? err.message : String(err)}`,
        success: false,
        voiceOutput: false
      };
    }
  }, []);

  // Méthode pour générer un plan nutritionnel avec synthèse vocale
  const generateNutritionPlan = useCallback(async (
    goal: string,
    preferences?: {
      mealCount?: number;
      cuisinePreferences?: string[];
      allergies?: string[];
      specificRequirements?: string;
    },
    forceVoiceOutput: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await IAVoiceService.generateNutritionPlanWithVoice(
        goal,
        preferences,
        forceVoiceOutput
      );
      
      setIsSpeaking(response.voiceOutput);
      setIsLoading(false);
      
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(`Erreur lors de la génération du plan: ${err instanceof Error ? err.message : String(err)}`);
      logger.error(LogCategory.IA, `Erreur lors de la génération vocale du plan: ${err instanceof Error ? err.message : String(err)}`);
      
      return {
        text: `Désolé, une erreur s'est produite: ${err instanceof Error ? err.message : String(err)}`,
        success: false,
        voiceOutput: false
      };
    }
  }, []);

  // Méthode pour lire un texte spécifique à voix haute
  const speakText = useCallback(async (
    text: string,
    options?: {
      language?: string;
      rate?: number;
      pitch?: number;
    }
  ) => {
    try {
      setError(null);
      setIsSpeaking(true);
      
      await IAVoiceService.speakText(text, options);
    } catch (err) {
      setIsSpeaking(false);
      setError(`Erreur lors de la lecture vocale: ${err instanceof Error ? err.message : String(err)}`);
      logger.error(LogCategory.IA, `Erreur lors de la lecture vocale: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  // Méthode pour arrêter la synthèse vocale
  const stopSpeaking = useCallback(async () => {
    try {
      await IAVoiceService.stopSpeaking();
      setIsSpeaking(false);
    } catch (err) {
      setError(`Erreur lors de l'arrêt de la synthèse: ${err instanceof Error ? err.message : String(err)}`);
      logger.error(LogCategory.IA, `Erreur lors de l'arrêt de la synthèse: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  // Méthode pour activer/désactiver la lecture automatique
  const toggleAutoRead = useCallback(() => {
    setAutoReadEnabled(prev => !prev);
  }, []);

  // Arrêter la synthèse vocale lors du démontage du composant
  useEffect(() => {
    return () => {
      // Cleanup: arrêter la synthèse vocale si le composant est démonté
      IAVoiceService.stopSpeaking().catch(err => {
        logger.error(LogCategory.IA, `Erreur lors de l'arrêt de la synthèse vocale (cleanup): ${err instanceof Error ? err.message : String(err)}`);
      });
    };
  }, []);

  return {
    generateResponse,
    analyzeNutritionHabits,
    generateNutritionPlan,
    speakText,
    stopSpeaking,
    toggleAutoRead,
    setAutoReadEnabled,
    isSpeaking,
    autoReadEnabled,
    isLoading,
    error,
    
    // Configurer les options de synthèse vocale
    configureVoice: useCallback((options: {
      language?: string;
      rate?: number;
      pitch?: number;
    }) => {
      try {
        IAVoiceService.configureVoice(options);
      } catch (err) {
        setError(`Erreur lors de la configuration vocale: ${err instanceof Error ? err.message : String(err)}`);
        logger.error(LogCategory.IA, `Erreur lors de la configuration vocale: ${err instanceof Error ? err.message : String(err)}`);
      }
    }, []),
  };
};

export default useIAVoice;
