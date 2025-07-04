import React from 'react';

/**
 * Contexte pour gérer le thème sombre/clair dans l'application
 * Utilisé par les composants d'UI pour adapter leur apparence
 */
export const DarkModeContext = React.createContext<boolean>(false);
