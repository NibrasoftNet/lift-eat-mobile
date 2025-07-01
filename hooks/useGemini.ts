import { useState } from 'react';
import { geminiCoreService } from '@/utils/services/core/gemini-core.service';
import iaService from '@/utils/services/ia/ia.service';
import { getCurrentUserId } from '@/utils/helpers/userContext';

interface UseGeminiReturn {
  loading: boolean;
  error: string | null;
  response: string | null;
  generateResponse: (prompt: string) => Promise<string>;
  clearResponse: () => void;
}

export const useGemini = (): UseGeminiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const generateResponse = async (prompt: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer l'ID utilisateur courant et le définir pour IAService
      const userId = await getCurrentUserId();
      if (userId) {
        iaService.setCurrentUserId(userId);
      }
      
      // Utiliser IAService qui enrichit le prompt avec le contexte utilisateur
      const result = await iaService.generateResponse(prompt);
      setResponse(result.text); // IAService retourne un objet avec text et action
      return result.text;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error in useGemini hook:', err);
      return 'Désolé, une erreur est survenue lors du traitement de votre demande.';
    } finally {
      setLoading(false);
    }
  };

  const clearResponse = (): void => {
    setResponse(null);
    setError(null);
  };

  return {
    loading,
    error,
    response,
    generateResponse,
    clearResponse,
  };
};

export default useGemini;
