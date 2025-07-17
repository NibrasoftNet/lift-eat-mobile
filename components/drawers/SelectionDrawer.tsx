import React, {
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl, ActivityIndicator } from 'react-native';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
/* Custom Providers */
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
/* Gluestack ui components */
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { CircleChevronDown, SearchIcon } from 'lucide-react-native';
/* Services */
import { drawerUIService } from '@/utils/services/ui/drawer-ui.service';

// Interface générique pour les items avec ID
interface SelectionItem {
  id: number;
  name: string;
  uniqueId?: string;
  [key: string]: any; // Permettre d'autres propriétés
}

// Interface pour les propriétés du composant
interface SelectionDrawerProps<T extends SelectionItem> {
  title: string;
  showDrawer: boolean;
  setShowDrawer: Dispatch<SetStateAction<boolean>>;
  data: T[] | undefined;
  isLoading: boolean;
  isPending: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean | undefined;
  setSearchTerm: (term: string | undefined) => void;
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => React.ReactElement;
  getItemType?: (item: T) => string; // Aide à l'optimisation en identifiant les types d'items différents
  searchPlaceholder?: string;
  onEndReachedThreshold?: number;
  estimatedItemSize?: number;
  additionalActions?: React.ReactNode;
  footerComponent?: React.ReactNode;
}

/**
 * Composant générique pour les drawers de sélection avec recherche, pagination et optimisations de performance
 */
function SelectionDrawer<T extends SelectionItem>({
  title,
  showDrawer,
  setShowDrawer,
  data,
  isLoading,
  isPending,
  isFetchingNextPage,
  isRefetching,
  refetch,
  fetchNextPage,
  hasNextPage,
  setSearchTerm,
  renderItem,
  searchPlaceholder = 'Search...',
  onEndReachedThreshold = 0.5,
  estimatedItemSize = 300,
  additionalActions,
  footerComponent,
}: SelectionDrawerProps<T>) {
  // États locaux
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<
    string | undefined
  >(undefined);

  // Vérifier l'authentification de l'utilisateur
  const userId = useMemo(() => getCurrentUserIdSync(), []);

  useEffect(() => {
    if (!userId) {
      logger.warn(
        LogCategory.AUTH,
        'No user in session when SelectionDrawer opened (ignored)',
      );
    }
  }, [userId]);

  // Utiliser le service pour le debounce du terme de recherche
  useEffect(() => {
    // Ne rien faire si le terme de recherche est undefined
    if (typeof debouncedSearchTerm === 'undefined') return;

    // Fonction de rappel qui appelle setSearchTerm
    const updateSearchTerm = (term: string) => {
      setSearchTerm(term);
    };

    // Utiliser le service pour débouncer le terme de recherche
    drawerUIService.debounceSearchTerm(
      debouncedSearchTerm,
      updateSearchTerm,
      300,
    );
  }, [debouncedSearchTerm, setSearchTerm]);

  // Gestionnaire de recherche optimisé
  const handleSearch = (term: string | undefined) => {
    setDebouncedSearchTerm(term || '');
  };

  // Utiliser le service pour créer un gestionnaire optimisé de fin de liste
  const handleEndReached = useCallback(() => {
    // Utiliser le service pour gérer la fin de liste atteinte
    drawerUIService.createEndReachedHandler(hasNextPage, fetchNextPage)();
  }, [hasNextPage, fetchNextPage]);

  return (
    <Drawer
      isOpen={showDrawer}
      onClose={() => setShowDrawer(false)}
      size="lg"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent className="bg-secondary-100 p-2 pb-0 relative">
        <DrawerHeader className="flex items-center justify-between w-full border-b border-secondary-300 p-2">
          <Heading size="xl" className="text-center font-semibold">
            {title}
          </Heading>
          <Button
            onPress={() => setShowDrawer(false)}
            className="bg-transparent w-12 h-12"
            action="secondary"
          >
            <ButtonIcon as={CircleChevronDown} className="w-10 h-10" />
          </Button>
        </DrawerHeader>
        <DrawerBody className="pb-16">
          {/* pb-16 pour faire de la place pour le footer fixe */}
          <VStack className="gap-2 flex-1">
            <Input
              variant="outline"
              className="bg-white/90 rounded-xl h-12 p-1"
            >
              <InputIcon as={SearchIcon} className="text-gray-400" />
              <InputField
                placeholder={searchPlaceholder}
                value={debouncedSearchTerm}
                onChangeText={handleSearch}
              />
            </Input>

            {additionalActions}

            <QueryStateHandler
              data={data}
              isLoading={isLoading}
              isFetching={isFetchingNextPage}
              isPending={isPending}
              isRefetching={isRefetching}
            >
              <FlashList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.uniqueId || `${item.id}`}
                // Paramètres spécifiques fournis ou valeurs par défaut optimisées
                estimatedItemSize={
                  estimatedItemSize ||
                  drawerUIService.getFlashListConfig().estimatedItemSize
                }
                // Ajouter un padding suffisant en bas pour éviter que le footer ne cache des éléments
                contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
                onEndReached={handleEndReached}
                onEndReachedThreshold={
                  onEndReachedThreshold ||
                  drawerUIService.getFlashListConfig().onEndReachedThreshold
                }
                // Optimisations pour FlashList compatibles avec les types existants
                estimatedListSize={
                  drawerUIService.getFlashListConfig().estimatedListSize
                }
                ListFooterComponent={() =>
                  isFetchingNextPage ? (
                    <ActivityIndicator size="large" color="#000" />
                  ) : (
                    // Ajouter un espace vide en bas pour garantir que le dernier élément est visible
                    <VStack style={{ height: 60 }} />
                  )
                }
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching && !isFetchingNextPage}
                    onRefresh={refetch}
                    colors={['#4F46E5']} // Couleur de chargement assortie au thème
                  />
                }
              />
            </QueryStateHandler>
          </VStack>
        </DrawerBody>
        <DrawerFooter className="bg-secondary-100 py-3 absolute bottom-0 left-0 right-0 border-t border-secondary-300 shadow-md z-10">
          {footerComponent ? (
            footerComponent
          ) : (
            <Button onPress={() => setShowDrawer(false)} className="w-full">
              <ButtonText>Close</ButtonText>
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default SelectionDrawer;
