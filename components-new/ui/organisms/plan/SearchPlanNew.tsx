import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/themeNew';

import { SearchRegularBoldIcon } from '@/assets/icons/figma/regular-bold/SearchRegularBoldIcon';

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
      <SearchRegularBoldIcon
        size={20}
        color={theme.color('blueGrey')}
        style={styles.icon}
      />
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
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 12,
      marginBottom: 16,
      backgroundColor: theme.colors.background,
      borderColor: '#EEEEEE',
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
