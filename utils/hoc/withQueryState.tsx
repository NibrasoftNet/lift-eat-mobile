import React from 'react';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { UseQueryResult } from '@tanstack/react-query';

/**
 * HOC pour encapsuler les états de requête communs
 * Ce HOC standardise l'utilisation de QueryStateHandler à travers l'application
 * 
 * @param WrappedComponent - Le composant à envelopper
 * @returns Un composant avec gestion des états de requête intégrée
 */
function withQueryState<P extends object, T>(
  WrappedComponent: React.ComponentType<P & { data: T }>
) {
  // Utiliser un nom descriptif pour le composant HOC 
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  // Le composant HOC qui enveloppe le composant d'origine
  const WithQueryState = (props: Omit<P, 'data'> & {
    queryResult: UseQueryResult<T, Error>;
    loadingMessage?: string;
    errorFallback?: React.ReactNode;
  }) => {
    const { 
      queryResult,
      loadingMessage = 'Chargement des données en cours...',
      errorFallback,
      ...passThroughProps 
    } = props;
    
    const {
      data,
      isLoading,
      isFetching,
      isPending,
      isRefetching,
      isFetchedAfterMount,
      error
    } = queryResult;
    
    // Utiliser QueryStateHandler pour gérer les états
    return (
      <QueryStateHandler
        isLoading={isLoading}
        isFetching={isFetching}
        isPending={isPending}
        isRefetching={isRefetching || false}
        isFetchedAfterMount={isFetchedAfterMount}
        data={data}
      >
        {error && errorFallback ? (
          errorFallback
        ) : (
          <WrappedComponent {...(passThroughProps as P)} data={data as T} />
        )}
      </QueryStateHandler>
    );
  };
  
  // Définir un displayName pour le debugging
  WithQueryState.displayName = `withQueryState(${displayName})`;
  
  return WithQueryState;
}

export default withQueryState;
