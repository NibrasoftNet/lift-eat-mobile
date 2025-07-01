import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/themeNew';

import { SearchIcon } from '@/components/ui/icon';

export interface SearchPlanNewProps {
  /** Valeur actuelle du champ */
  value: string;
  /** Callback lorsque le texte change */
  onChangeText: (text: string) => void;
  /** Placeholder du champ */
  placeholder?: string;
  /** Appelé lors de la soumission/clavier "search" */
  onSubmitEditing?: () => void;
  /** Style supplémentaire sur le conteneur */
  style?: any;
}

/**
 * SearchPlanNew – barre de recherche pour la liste des plans nutritifs (Figma node 55652-1184)
 * Conçue pour remplacer le composant <Input> générique et respecter pixel-perfect Figma.
 */
const SearchPlanNew: React.FC<SearchPlanNewProps> = ({
  value,
  onChangeText,
  placeholder = 'Rechercher des plans…',
  onSubmitEditing,
  style,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <SearchIcon width={20} height={20} stroke={theme.color('blueGrey')} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.color('blueGrey')}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.color('background'),
      borderRadius: theme.radius('2xl'),
      borderWidth: 1,
      borderColor: theme.color('overlayGrey'),
      paddingHorizontal: theme.space('md'),
      height: 48,
    },
    icon: {
      marginRight: theme.space('sm'),
    },
    input: {
      flex: 1,
      paddingVertical: 0,
      color: theme.color('primary'),
      fontSize: 16,
    },
  });

export default SearchPlanNew;
