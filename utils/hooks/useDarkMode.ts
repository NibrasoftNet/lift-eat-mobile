import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

/**
 * Hook pour accéder au mode sombre/clair de l'application
 * @returns {boolean} true si le mode sombre est activé, false sinon
 */
export const useDarkMode = (): boolean => {
  return useContext(DarkModeContext);
};
