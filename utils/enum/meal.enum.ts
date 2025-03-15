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
  CARIBBEAN = 'CARIBBEAN',
  TUNISIAN = 'TUNISIAN',
  QATARI = 'QATARI',
  AMERICAN = 'AMERICAN',
  CHINESE = 'CHINESE',
  FRENCH = 'FRENCH',
  INDIAN = 'INDIAN',
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
