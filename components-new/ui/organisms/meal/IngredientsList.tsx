import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { IngredientWithUniqueId } from '@/utils/interfaces/drawer.interface';
import { useTheme } from '../../../../themeNew';
import { ThemeInterface } from '../../../../themeNew';
import { Text } from '../../atoms/base';
import IngredientListItem from '../../molecules/tracking/IngredientListItem';
import { InfoCircleRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/InfoCircleRegularBoldIcon';



interface IngredientsListProps {
  /** Liste des ingrédients */
  ingredients: IngredientWithUniqueId[];
  /** Mode d'affichage sombre */
  isDarkMode?: boolean;
  /** Fonction callback lorsqu'on clique sur un ingrédient */
  onIngredientPress?: (id: string) => void;
  /** Fonction callback lorsqu'on supprime un ingrédient */
  onIngredientDelete?: (id: string) => void;
  /** Indique si les boutons de suppression doivent être affichés */
  showDeleteButtons?: boolean;
  /** Titre de la section */
  title?: string;
}

/**
 * Composant IngredientsList
 * Affiche la liste des ingrédients d'un repas
 * Utilise FlatList pour une performance optimale et suit l'architecture MCP
 */
const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  isDarkMode = false,
  onIngredientPress,
  onIngredientDelete,
  showDeleteButtons = true,
  title = 'Ingrédients',
}) => {
  const theme = useTheme();
  const isDark = isDarkMode || theme.isDark;
  // Couleurs selon le thème
  const backgroundColor = theme.colors.background;
  const textColor = isDark ? '#FFFFFF' : '#212121';
  const secondaryTextColor = isDark ? '#CDCDCD' : '#757575';
  const borderColor = isDark ? '#35383F' : '#EEEEEE';
  const iconColor = isDark ? '#FFFFFF' : '#212121';
  // Styles dépendants du thème
  const styles = React.useMemo(
    () => createStyles(theme, isDark),
    [theme, isDark],
  );

  // Gestionnaire de clic sur un ingrédient
  const handleIngredientPress = (id: string) => {
    if (onIngredientPress) {
      onIngredientPress(id);
    }
  };

  // Gestionnaire de suppression d'un ingrédient
  const handleIngredientDelete = (id: string) => {
    if (onIngredientDelete) {
      // Confirmation avant suppression
      Alert.alert(
        "Supprimer l'ingrédient",
        'Voulez-vous vraiment supprimer cet ingrédient ?',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Supprimer',
            onPress: () => onIngredientDelete(id),
            style: 'destructive',
          },
        ],
      );
    }
  };

  // Rendu d'un élément de la liste
  const renderItem = ({ item }: { item: IngredientWithUniqueId }) => (
    <IngredientListItem
      id={`${item.id}`}
      name={item.name}
      quantity={item.quantity}
      unit={item.displayUnit}
      imageUrl={item.imageUrl}
      isDarkMode={isDarkMode}
      onPress={handleIngredientPress}
      onDelete={showDeleteButtons ? handleIngredientDelete : undefined}
      showDeleteButton={showDeleteButtons}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* En-tête de la section */}
      <View style={styles.header}>
        <InfoCircleRegularBoldIcon width={20} height={20} color={iconColor} />
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>

      {/* Liste des ingrédients */}
      {ingredients.length > 0 && (
        <FlatList
          data={ingredients}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          style={[styles.list, { backgroundColor }]}
          contentContainerStyle={[styles.listContent, { borderColor }]}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      )}
      {ingredients.length === 0 && (
        <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
          Aucun ingrédient dans ce repas
        </Text>
      )}
    </View>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 12,
      width: '100%',
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#35383F' : '#EEEEEE',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontFamily: 'Urbanist',
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 8,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    list: {
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    listContent: {
      overflow: 'hidden',
      borderWidth: 0,
      paddingBottom: 0,
    },
    emptyText: {
      fontFamily: 'Urbanist',
      fontSize: 16,
      fontWeight: '400',
      textAlign: 'center',
      padding: 12,
      color: isDark ? '#CDCDCD' : '#757575',
    },
  });

export default IngredientsList;
