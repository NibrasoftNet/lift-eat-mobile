import { useState } from 'react';
import geminiService from '@/utils/services/gemini-service';

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
      const result = await geminiService.generateResponse(prompt);
      setResponse(result);
      return result;
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
