/**
 * Configuration for React Native Reanimated
 *
 * This disables strict mode warnings for the Ingredients drawer to prevent excessive
 * logs from animations in nested components. This doesn't affect functionality,
 * but removes noise from the logs.
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/debugging/logger-configuration
 */
export const configureReanimated = () => {
  // Disable 'strict' mode warnings in development
  if (__DEV__) {
    try {
      // Méthode alternative: Override la fonction de logging pour filtrer les warnings Reanimated
      // Cette approche est compatible TypeScript et ne nécessite pas d'accéder à des propriétés globales
      const originalConsoleWarn = console.warn;
      console.warn = (...args: any[]) => {
        // Filtrer les messages de warning Reanimated
        const isReanimatedWarning = args.some(
          (arg) =>
            typeof arg === 'string' &&
            (arg.includes('[Reanimated]') ||
              arg.includes('Reading from `value`') ||
              arg.includes('Writing to `value`')),
        );

        // Ignorer les warnings Reanimated, laisser passer les autres
        if (!isReanimatedWarning) {
          originalConsoleWarn(...args);
        }
      };

      console.log(
        '[Reanimated] Warning: Warnings have been suppressed for better console readability',
      );
    } catch (error) {
      console.error(
        '[Reanimated] Error configuring warning suppression:',
        error,
      );
    }
  }
};
