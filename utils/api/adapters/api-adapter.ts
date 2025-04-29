import { ApiVersion, ApiVersionImpl, ExternalApiInfo } from '../interfaces/version';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

/**
 * Classe de base pour adapter les API externes
 * Fournit un mécanisme uniforme pour gérer le versionnage des API
 */
export abstract class ExternalApiAdapter {
  protected apiInfo: ExternalApiInfo;
  protected fallbackImplementations: Map<string, Function> = new Map();

  constructor(name: string, baseUrl: string, version: ApiVersion) {
    this.apiInfo = {
      name,
      baseUrl,
      currentVersion: version,
      lastCheckedAt: new Date()
    };

    logger.info(LogCategory.INTEGRATION, `${name} API adapter initialized with version ${version.toString()}`);
  }

  /**
   * Enregistre une version d'API avec son implémentation
   * @param methodName Nom de la méthode API
   * @param version Version de l'API
   * @param implementation Fonction d'implémentation
   */
  protected registerVersionedMethod(methodName: string, version: ApiVersion, implementation: Function): void {
    const key = `${methodName}_v${version.toString()}`;
    this.fallbackImplementations.set(key, implementation);
    logger.debug(LogCategory.INTEGRATION, `Registered API method: ${methodName} at version ${version.toString()}`);
  }

  /**
   * Adapte un appel API pour utiliser la version appropriée ou une version de fallback
   * @param methodName Nom de la méthode API
   * @param requiredVersion Version demandée
   * @param params Paramètres pour l'appel API
   * @returns Résultat de l'appel API
   */
  protected async adaptApiCall<T>(
    methodName: string, 
    requiredVersion: ApiVersion, 
    params: any
  ): Promise<T> {
    const startTime = performance.now();
    try {
      // Vérifier si la version requise est compatible avec la version actuelle
      if (requiredVersion.isCompatibleWith(this.apiInfo.currentVersion)) {
        logger.debug(
          LogCategory.INTEGRATION, 
          `Using current implementation for ${methodName} (required: ${requiredVersion.toString()}, current: ${this.apiInfo.currentVersion.toString()})`
        );
        // Utiliser l'implémentation actuelle (this[methodName])
        // @ts-ignore - methodName est dynamique
        return await this[methodName](params);
      }

      // Chercher une implémentation compatible dans les fallbacks
      const compatibleKey = Array.from(this.fallbackImplementations.keys())
        .filter(key => key.startsWith(`${methodName}_v`))
        .find(key => {
          const keyVersion = key.split('_v')[1];
          const [major, minor, patch] = keyVersion.split('.').map(Number);
          const keyApiVersion = new ApiVersionImpl(major, minor, patch);
          return keyApiVersion.isCompatibleWith(requiredVersion);
        });

      if (compatibleKey) {
        logger.info(
          LogCategory.INTEGRATION, 
          `Using fallback implementation for ${methodName} (required: ${requiredVersion.toString()})`
        );
        const implementation = this.fallbackImplementations.get(compatibleKey);
        if (implementation) {
          return await implementation(params);
        }
      }

      throw new Error(
        `No compatible implementation found for ${methodName} at version ${requiredVersion.toString()}`
      );
    } catch (error) {
      logger.error(
        LogCategory.INTEGRATION, 
        `Error in API call ${methodName}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    } finally {
      const accessTime = performance.now() - startTime;
      logger.debug(
        LogCategory.INTEGRATION, 
        `API access time for ${methodName}: ${accessTime.toFixed(2)}ms`
      );
    }
  }

  /**
   * Met à jour la version actuelle de l'API
   * @param newVersion Nouvelle version
   */
  public updateApiVersion(newVersion: ApiVersion): void {
    const oldVersion = this.apiInfo.currentVersion;
    this.apiInfo.currentVersion = newVersion;
    this.apiInfo.lastCheckedAt = new Date();

    logger.info(
      LogCategory.INTEGRATION, 
      `Updated ${this.apiInfo.name} API version from ${oldVersion.toString()} to ${newVersion.toString()}`
    );
  }

  /**
   * Vérifie la version actuelle de l'API avec un endpoint de vérification
   * À implémenter par les classes concrètes
   */
  public abstract checkApiVersion(): Promise<ApiVersion>;
}
