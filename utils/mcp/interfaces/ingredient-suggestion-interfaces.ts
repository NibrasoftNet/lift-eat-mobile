import { IngredientSuggestionsOrmProps } from '@/db/schema';
import { IaIngredientType } from '@/utils/validation/ia/ia.schemas';

// Interface pour saveIngredientSuggestionViaMCP
export interface SaveIngredientSuggestionParams {
  suggestion: IaIngredientType;
  userId: number;
  status?: 'pending' | 'accepted' | 'rejected';
  source?: string;
}

export interface SaveIngredientSuggestionResult {
  success: boolean;
  suggestionId?: number;
  error?: string;
}

// Interface pour getIngredientSuggestionsViaMCP
export interface GetIngredientSuggestionsParams {
  userId: number;
  status?: 'pending' | 'accepted' | 'rejected';
  limit?: number;
}

export interface GetIngredientSuggestionsResult {
  success: boolean;
  suggestions?: IngredientSuggestionsOrmProps[];
  error?: string;
}

// Interface pour updateIngredientSuggestionViaMCP
export interface UpdateIngredientSuggestionParams {
  suggestionId: number;
  userId: number;
  status: 'pending' | 'accepted' | 'rejected';
  data?: Partial<IaIngredientType>;
}

export interface UpdateIngredientSuggestionResult {
  success: boolean;
  error?: string;
}

// Interface pour deleteIngredientSuggestionViaMCP
export interface DeleteIngredientSuggestionParams {
  suggestionId: number;
  userId: number;
}

export interface DeleteIngredientSuggestionResult {
  success: boolean;
  error?: string;
}
