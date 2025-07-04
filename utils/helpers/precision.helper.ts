/**
 * Utilitaires pour améliorer la précision des calculs nutritionnels
 * en évitant les arrondis prématurés et en utilisant des techniques de manipulation
 * numérique plus précises
 */

/**
 * Arrondit un nombre à un nombre spécifié de décimales
 * @param value Valeur à arrondir
 * @param decimals Nombre de décimales (défaut: 2)
 * @returns Valeur arrondie
 */
export const roundToDecimals = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

/**
 * Effectue des calculs intermédiaires précis sans arrondis
 * @param callback Fonction de calcul qui utilise les valeurs précises
 * @param values Valeurs d'entrée (seront utilisées sans arrondis)
 * @param finalDecimals Nombre de décimales pour le résultat final
 * @returns Résultat du calcul arrondi à la fin seulement
 */
export const preciseCalculation = <T extends number[]>(
  callback: (...args: T) => number,
  values: T,
  finalDecimals: number = 0
): number => {
  // Exécuter la fonction avec les valeurs précises
  const result = callback(...values);
  
  // Appliquer l'arrondi uniquement au résultat final
  return roundToDecimals(result, finalDecimals);
};

/**
 * Convertit macronutriments en calories avec précision
 * @param carbs Grammes de glucides
 * @param protein Grammes de protéines
 * @param fat Grammes de lipides
 * @returns Calories calculées avec précision
 */
export const preciseMacroToCalories = (
  carbs: number,
  protein: number,
  fat: number
): number => {
  return preciseCalculation(
    (c, p, f) => c * 4 + p * 4 + f * 9,
    [carbs, protein, fat],
    0 // Arrondir à l'entier pour les calories
  );
};

/**
 * Ajuste les valeurs nutritionnelles selon un facteur avec précision
 * @param values Valeurs nutritionnelles à ajuster
 * @param factor Facteur d'ajustement
 * @param decimals Nombre de décimales pour les résultats
 * @returns Valeurs ajustées avec précision
 */
export const preciseAdjustment = <T extends Record<string, number>>(
  values: T,
  factor: number,
  decimals: number = 0
): T => {
  const result = { ...values };
  
  for (const key in result) {
    if (typeof result[key] === 'number') {
      result[key] = roundToDecimals(result[key] * factor, decimals) as unknown as T[Extract<keyof T, string>];
    }
  }
  
  return result;
};

/**
 * Somme des valeurs nutritionnelles de plusieurs objets avec précision
 * @param items Tableau d'objets avec propriétés numériques
 * @param keys Clés à additionner
 * @param decimals Nombre de décimales pour les résultats
 * @returns Objet avec les sommes précises
 */
export const preciseSumByKeys = <T extends Record<K, number>, K extends keyof T>(
  items: T[],
  keys: K[],
  decimals: number = 0
): Pick<T, K> => {
  // Initialiser l'objet résultat avec des zéros
  const result = {} as Pick<T, K>;
  
  keys.forEach(key => {
    // Calculer la somme sans arrondis intermédiaires
    const sum = items.reduce((acc, item) => acc + (item[key] || 0), 0);
    
    // Appliquer l'arrondi seulement au résultat final
    result[key] = roundToDecimals(sum, decimals) as unknown as T[K];
  });
  
  return result;
};
