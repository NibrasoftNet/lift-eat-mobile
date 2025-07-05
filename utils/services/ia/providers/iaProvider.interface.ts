/**
 * Interface pour les fournisseurs d'IA
 * Définit un contrat commun que toutes les implémentations de fournisseurs d'IA doivent respecter
 */

import { IaErrorType } from '../errorHandler';

/**
 * Options de configuration pour les requêtes IA
 */
export interface IaRequestOptions {
  maxTokens?: number; // Nombre maximum de tokens dans la réponse
  temperature?: number; // Température (contrôle la créativité, 0.0 à 1.0)
  timeout?: number; // Timeout en ms
  stream?: boolean; // Si true, le fournisseur doit supporter le streaming
  modelName?: string; // Nom du modèle à utiliser (si le fournisseur supporte plusieurs modèles)
  topP?: number; // Top-P sampling (alternative à la température)
  stopSequences?: string[]; // Séquences de caractères pour arrêter la génération
  [key: string]: any; // Autres options spécifiques au fournisseur
}

/**
 * Structure de réponse d'un fournisseur d'IA
 */
export interface IaProviderResponse {
  text: string; // Texte de la réponse
  usage?: {
    // Informations sur l'utilisation (si disponible)
    promptTokens?: number; // Nombre de tokens dans le prompt
    completionTokens?: number; // Nombre de tokens dans la réponse
    totalTokens?: number; // Nombre total de tokens
  };
  metadata?: {
    // Métadonnées additionnelles
    modelName?: string; // Nom du modèle utilisé
    finishReason?: string; // Raison de la fin de la génération
    latencyMs?: number; // Latence en millisecondes
    [key: string]: any; // Autres métadonnées
  };
}

/**
 * Interface pour les fournisseurs d'IA
 * Tous les fournisseurs d'IA doivent implémenter cette interface
 */
export interface IaProvider {
  /**
   * Nom du fournisseur (ex: "Gemini", "OpenAI", etc.)
   */
  readonly name: string;

  /**
   * Version de l'API utilisée
   */
  readonly apiVersion: string;

  /**
   * Liste des modèles disponibles pour ce fournisseur
   */
  readonly availableModels: string[];

  /**
   * Modèle par défaut à utiliser
   */
  readonly defaultModel: string;

  /**
   * Envoie une requête au fournisseur d'IA et retourne la réponse
   * @param prompt Le prompt à envoyer
   * @param options Options de la requête
   * @returns Réponse du fournisseur sous forme de texte et métadonnées
   * @throws IaError en cas d'erreur
   */
  sendRequest(
    prompt: string,
    options?: IaRequestOptions,
  ): Promise<IaProviderResponse>;

  /**
   * Vérifie si l'API est disponible
   * @returns true si l'API est disponible, false sinon
   */
  checkAvailability(): Promise<boolean>;

  /**
   * Traduit une erreur spécifique au fournisseur en IaErrorType
   * @param error Erreur spécifique au fournisseur
   * @returns Type d'erreur standardisé
   */
  translateErrorType(error: any): IaErrorType;
}

/**
 * Interface pour la factory de fournisseurs d'IA
 */
export interface IaProviderFactory {
  /**
   * Crée un fournisseur d'IA en fonction de la configuration
   * @param providerType Type de fournisseur à créer
   * @param config Configuration du fournisseur
   * @returns Instance du fournisseur d'IA
   */
  createProvider(
    providerType: string,
    config?: Record<string, any>,
  ): IaProvider;

  /**
   * Retourne le fournisseur par défaut configuré dans l'application
   * @returns Instance du fournisseur d'IA par défaut
   */
  getDefaultProvider(): IaProvider;
}
