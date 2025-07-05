/**
 * Interfaces pour la gestion des versions d'API
 */

/**
 * Version de l'API externe
 * Permet de tracer les changements d'API et de gérer la rétrocompatibilité
 */
export interface ApiVersion {
  major: number;
  minor: number;
  patch: number;
  toString(): string;
  isCompatibleWith(other: ApiVersion): boolean;
}

/**
 * Informations sur une API externe
 */
export interface ExternalApiInfo {
  name: string;
  baseUrl: string;
  currentVersion: ApiVersion;
  lastCheckedAt: Date;
}

/**
 * Classe pour représenter une version d'API
 */
export class ApiVersionImpl implements ApiVersion {
  constructor(
    public major: number,
    public minor: number,
    public patch: number,
  ) {}

  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  /**
   * Compare si cette version est compatible avec une autre version
   * @param other Version à comparer
   * @returns true si les versions sont compatibles (même major)
   */
  isCompatibleWith(other: ApiVersion): boolean {
    return this.major === other.major;
  }
}
