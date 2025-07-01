/**
 * Formate une valeur nutritionnelle en nombre entier
 * @param value Valeur à formater
 * @returns Valeur formatée en nombre entier
 */
export const formatNutritionalValue = (value: number): number => {
  return Math.round(value);
};
