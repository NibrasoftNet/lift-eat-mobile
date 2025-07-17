/**
 * SelectionDrawer (new layer)
 * --------------------------------------
 * Temporaire : réexporte l'ancien composant pour éviter les imports cassés.
 * Prochaine étape : réécrire complètement le drawer avec les nouveaux atomes UI
 * (Box, Text, Button, Drawer primitives) et retirer toutes les dépendances
 * Gluestack. Penser à :
 *   • Extraction des props génériques (pagination, recherche)
 *   • Animation & accessibilité
 *   • Support Dark Mode via themeNew
 *   • Tests RTL
 */
// TODO: Refactor to use new UI atoms and remove Gluestack dependencies.

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Box from '@/components-new/ui/atoms/base/Box';
import { Text } from '@/components-new/ui/atoms/base';
import Button from '@/components-new/ui/atoms/inputs/Button';
import TextInputField from '@/components-new/ui/molecules/form/TextInputField';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

export interface SelectionItem {
  id: number | string;
  name: string;
  /** Clé unique si différente de l'id */
  uniqueId?: string;
  [key: string]: any;
}

export interface SelectionDrawerProps<T extends SelectionItem> {
  /** Titre affiché en haut */
  title: string;
  /** État ouvert/fermé */
  isOpen: boolean;
  /** Setter pour fermer */
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  /** Données à afficher */
  data: T[] | undefined;
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  isRefreshing?: boolean;
  refetch?: () => Promise<any>;
  fetchNextPage?: () => Promise<any>;
  hasNextPage?: boolean;

  /** Màj du terme de recherche (délai géré à l'extérieur) */
  onSearchTermChange?: (term: string) => void;
  searchPlaceholder?: string;

  /** Rendu d'un item */
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;

  /** Pied de page custom (bouton valider…) */
  footer?: React.ReactNode;
}

/**
 * Nouveau composant SelectionDrawer.
 * – Basé sur React-Native Modal (plein écran, slide-up Android/iOS)
 * – Zéro dépendance Gluestack.
 * – Utilise les atomes Box / Text / Button / TextInputField et FlashList.
 * – Pagination et recherche restent à la charge du parent via props.
 */
function SelectionDrawer<T extends SelectionItem>({
  title,
  isOpen,
  setIsOpen,
  data,
  isLoading,
  isFetchingNextPage,
  isRefreshing,
  refetch,
  fetchNextPage,
  hasNextPage,
  onSearchTermChange,
  searchPlaceholder = 'Search…',
  renderItem,
  footer,
}: SelectionDrawerProps<T>) {
  const theme = useAppTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Propage le terme de recherche (déboursé) vers le parent
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchTermChange?.(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearchTermChange]);

  const handleClose = () => setIsOpen(false);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <Box
          row
          alignItems="center"
          justifyContent="space-between"
          px="lg"
          py="md"
          bg={theme.color('background')}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.color('overlayGrey'),
          }}
        >
          <Text variant="h3" semibold>
            {title}
          </Text>
          <Button variant="ghost" onPress={handleClose}>
            ✕
          </Button>
        </Box>

        {/* Search input */}
        {onSearchTermChange && (
          <Box px="lg" py="sm">
            <TextInputField
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder={searchPlaceholder}
              size="md"
              variant="filledLight"
              isClearable
            />
          </Box>
        )}

        {/* List */}
        <FlashList
          data={data || []}
          renderItem={renderItem}
          keyExtractor={(item) => (item.uniqueId ? item.uniqueId : `${item.id}`)}
          estimatedItemSize={100}
          onEndReached={() => {
            if (hasNextPage && fetchNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            refetch ? (
              <RefreshControl
                refreshing={!!isRefreshing}
                onRefresh={refetch}
                colors={[theme.color('primary')]}
              />
            ) : undefined
          }
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator
                style={{ marginVertical: 16 }}
                color={theme.color('primary')}
              />
            ) : null
          }
          ListEmptyComponent={() =>
            !isLoading && data && data.length === 0 ? (
              <View style={styles.emptyView}>
                <Text variant="body">No result</Text>
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: footer ? 120 : 40 }}
        />

        {/* Footer */}
        {footer && <View style={styles.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  emptyView: { alignItems: 'center', marginTop: 40 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SelectionDrawer;

