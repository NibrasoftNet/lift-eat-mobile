/**
 * Factory pour créer des instances de fournisseurs d'IA
 */
import { IaProvider, IaProviderFactory } from './iaProvider.interface';
import { GeminiProvider, GeminiConfig } from './geminiProvider';
import { createIaLogger } from '../loggingEnhancer';
import { IaError, IaErrorType } from '../errorHandler';
import { GEMINI_API_KEY, GEMINI_API_BASE_URL } from '@/utils/constants/Config';

// Configuration du logger pour la factory
const logger = createIaLogger('IaProviderFactory');

/**
 * Types de fournisseurs d'IA supportés
 */
export enum IaProviderType {
  GEMINI = 'gemini',
  // Ajouter d'autres fournisseurs ici si nécessaire
}

/**
 * Factory pour créer des instances de fournisseurs d'IA
 */
class IaProviderFactoryImpl implements IaProviderFactory {
  private providers: Map<string, IaProvider> = new Map();
  private defaultProviderType: IaProviderType;

  /**
   * Initialise la factory avec un type de fournisseur par défaut
   * @param defaultProviderType Type de fournisseur par défaut
   */
  constructor(defaultProviderType: IaProviderType = IaProviderType.GEMINI) {
    this.defaultProviderType = defaultProviderType;
    logger.info('IaProviderFactory initialisée', 'constructor', {
      defaultProvider: defaultProviderType,
    });
  }

  /**
   * Crée un fournisseur d'IA en fonction de la configuration
   * @param providerType Type de fournisseur à créer
   * @param config Configuration du fournisseur
   * @returns Instance du fournisseur d'IA
   * @throws IaError si le type de fournisseur n'est pas supporté
   */
  createProvider(
    providerType: string,
    config?: Record<string, any>,
  ): IaProvider {
    logger.debug("Création d'un fournisseur IA", 'createProvider', {
      providerType,
    });

    // Vérifier si un fournisseur de ce type a déjà été créé
    const existingProvider = this.providers.get(providerType);
    if (existingProvider) {
      return existingProvider;
    }

    // Créer un nouveau fournisseur en fonction du type
    let provider: IaProvider;

    switch (providerType.toLowerCase()) {
      case IaProviderType.GEMINI:
        // Récupérer la clé API depuis le fichier Config ou les variables d'environnement si non fournie
        if (!config?.apiKey) {
          if (GEMINI_API_KEY) {
            config = { ...config, apiKey: GEMINI_API_KEY };
            logger.debug(
              'Utilisation de la clé API Gemini depuis le fichier de configuration',
              'createProvider',
            );
          } else if (process.env.GEMINI_API_KEY) {
            config = { ...config, apiKey: process.env.GEMINI_API_KEY };
            logger.debug(
              "Utilisation de la clé API Gemini depuis les variables d'environnement",
              'createProvider',
            );
          } else {
            throw new IaError(
              "Clé API Gemini non trouvée. Définissez GEMINI_API_KEY dans le fichier de configuration ou les variables d'environnement.",
              IaErrorType.UNAUTHORIZED_ERROR,
            );
          }
        }

        // Utiliser l'URL de base depuis le fichier Config ou les variables d'environnement si disponible
        if (!config?.apiBaseUrl) {
          if (GEMINI_API_BASE_URL) {
            config = { ...config, apiBaseUrl: GEMINI_API_BASE_URL };
            logger.debug(
              "Utilisation de l'URL de base Gemini depuis le fichier de configuration",
              'createProvider',
            );
          } else if (process.env.GEMINI_API_BASE_URL) {
            config = { ...config, apiBaseUrl: process.env.GEMINI_API_BASE_URL };
            logger.debug(
              "Utilisation de l'URL de base Gemini depuis les variables d'environnement",
              'createProvider',
            );
          }
        }

        provider = new GeminiProvider(config as GeminiConfig);
        break;

      default:
        throw new IaError(
          `Type de fournisseur IA non supporté: ${providerType}`,
          IaErrorType.UNSUPPORTED_OPERATION,
        );
    }

    // Stocker le fournisseur pour une utilisation ultérieure
    this.providers.set(providerType, provider);

    return provider;
  }

  /**
   * Retourne le fournisseur par défaut configuré dans l'application
   * @returns Instance du fournisseur d'IA par défaut
   */
  getDefaultProvider(): IaProvider {
    logger.debug(
      'Récupération du fournisseur par défaut',
      'getDefaultProvider',
    );

    // Vérifier si le fournisseur par défaut a déjà été créé
    const existingProvider = this.providers.get(this.defaultProviderType);
    if (existingProvider) {
      return existingProvider;
    }

    // Sinon, créer un nouveau fournisseur par défaut
    return this.createProvider(this.defaultProviderType);
  }

  /**
   * Change le type de fournisseur par défaut
   * @param providerType Nouveau type de fournisseur par défaut
   */
  setDefaultProviderType(providerType: IaProviderType): void {
    this.defaultProviderType = providerType;
    logger.info(
      'Type de fournisseur par défaut modifié',
      'setDefaultProviderType',
      {
        newDefaultProvider: providerType,
      },
    );
  }
}

// Exporter une instance singleton de la factory
export const iaProviderFactory = new IaProviderFactoryImpl();
