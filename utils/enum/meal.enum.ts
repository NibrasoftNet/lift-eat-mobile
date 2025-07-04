export enum MealTypeEnum {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
}

export const MealTypeArray = Object.values(MealTypeEnum) as unknown as Readonly<
  [MealTypeEnum, ...MealTypeEnum[]]
>;

export enum CuisineTypeEnum {
  GENERAL = 'GENERAL',
  AFRICAN = 'AFRICAN',
  EUROPEAN = 'EUROPEAN',
  ASIAN = 'ASIAN',
  TUNISIAN = 'TUNISIAN',
  AMERICAN = 'AMERICAN',
  CHINESE = 'CHINESE',
  FRENCH = 'FRENCH',
  ITALIAN = 'ITALIAN',
  JAPANESE = 'JAPANESE',
  MEXICAN = 'MEXICAN',
}

export const CuisineTypeArray = Object.values(
  CuisineTypeEnum,
) as unknown as Readonly<[CuisineTypeEnum, ...CuisineTypeEnum[]]>;

export enum MealUnitEnum {
  GRAMMES = 'GRAMMES',
  KILOGRAMMES = 'KILOGRAMMES',
  MILLILITRES = 'MILLILITRES',
  LITRES = 'LITRES',
  PIECES = 'PIECES',
  PORTION = 'PORTION',
  CUILLERES_A_SOUPE = 'CUILLERES_A_SOUPE',
  CUILLERES_A_CAFE = 'CUILLERES_A_CAFE',
  TASSES = 'TASSES',
  SERVING = 'SERVING',
  PLATE = 'PLATE',
  BOWL = 'BOWL',
}

export const MealUnitArray = Object.values(MealUnitEnum) as unknown as Readonly<
  [MealUnitEnum, ...MealUnitEnum[]]
>;

/**
 * Énumération des pays disponibles pour la recherche de produits
 */
export enum CountryTypeEnum {
  TUNISIA = 'tunisia',
  FRANCE = 'france',
  MOROCCO = 'morocco',
  ALGERIA = 'algeria',
  EGYPT = 'egypt',
  SPAIN = 'spain',
  ITALY = 'italy',
  GERMANY = 'germany',
  UK = 'uk',
}

/**
 * Configuration des pays avec leurs URLs et codes
 */
export const CountryConfig: Record<CountryTypeEnum, { url: string; code: string }> = {
  [CountryTypeEnum.TUNISIA]: { url: 'https://tn.openfoodfacts.org', code: 'tn' },
  [CountryTypeEnum.FRANCE]: { url: 'https://fr.openfoodfacts.org', code: 'fr' },
  [CountryTypeEnum.MOROCCO]: { url: 'https://ma.openfoodfacts.org', code: 'ma' },
  [CountryTypeEnum.ALGERIA]: { url: 'https://dz.openfoodfacts.org', code: 'dz' },
  [CountryTypeEnum.EGYPT]: { url: 'https://eg.openfoodfacts.org', code: 'eg' },
  [CountryTypeEnum.SPAIN]: { url: 'https://es.openfoodfacts.org', code: 'es' },
  [CountryTypeEnum.ITALY]: { url: 'https://it.openfoodfacts.org', code: 'it' },
  [CountryTypeEnum.GERMANY]: { url: 'https://de.openfoodfacts.org', code: 'de' },
  [CountryTypeEnum.UK]: { url: 'https://uk.openfoodfacts.org', code: 'uk' },
}

/**
 * Libellés français pour l'affichage des pays dans l'interface (FR)
 */
export const CountryLabelMap: Record<CountryTypeEnum, string> = {
  [CountryTypeEnum.TUNISIA]: 'Tunisie',
  [CountryTypeEnum.FRANCE]: 'France',
  [CountryTypeEnum.MOROCCO]: 'Maroc',
  [CountryTypeEnum.ALGERIA]: 'Algérie',
  [CountryTypeEnum.EGYPT]: 'Égypte',
  [CountryTypeEnum.SPAIN]: 'Espagne',
  [CountryTypeEnum.ITALY]: 'Italie',
  [CountryTypeEnum.GERMANY]: 'Allemagne',
  [CountryTypeEnum.UK]: 'Royaume-Uni',
};
