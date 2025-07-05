/**
 * Dropdown - Composant de menu déroulant
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=2766-23992
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';
// Importer les icônes nécessaires pour le dropdown
import { ArrowDown2RegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowDown2RegularBoldIcon';
import { TickSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/TickSquareRegularBoldIcon';

// Type pour les éléments du dropdown
export interface DropdownItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

// Types d'affichage du dropdown
type DropdownType = 'simple' | 'checkbox';

interface DropdownProps {
  // Configuration
  label?: string;
  placeholder?: string;
  items: DropdownItem[];
  selectedValue?: string | number;
  onSelect: (item: DropdownItem) => void;
  type?: DropdownType;
  multiple?: boolean; // Pour le type checkbox, permet la sélection multiple
  // Style
  containerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  // Thème
  darkMode?: boolean;
}

/**
 * Dropdown - Composant de menu déroulant personnalisable
 * Basé sur les spécifications Figma (node-id=2766-23992)
 */
const Dropdown: React.FC<DropdownProps> = ({
  // Configuration
  label,
  placeholder = 'Sélectionner une option',
  items,
  selectedValue,
  onSelect,
  type = 'simple',
  multiple = false,
  // Style
  containerStyle,
  dropdownStyle,
  // Thème
  darkMode = false,
}) => {
  const theme = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<DropdownItem[]>([]);
  const buttonRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Mettre à jour les éléments sélectionnés lorsque selectedValue change
  useEffect(() => {
    if (!multiple) {
      const selected = items.find((item) => item.value === selectedValue);
      setSelectedItems(selected ? [selected] : []);
    }
  }, [selectedValue, items, multiple]);

  // Récupérer la position du bouton pour positionner le dropdown
  const measureButton = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownPosition({
        top: pageY + height,
        left: pageX,
        width,
      });
    });
  };

  // Ouvrir le dropdown
  const toggleDropdown = () => {
    if (!isOpen) {
      measureButton();
    }
    setIsOpen(!isOpen);
  };

  // Gérer la sélection d'un élément
  const handleSelect = (item: DropdownItem) => {
    if (type === 'checkbox' && multiple) {
      // En mode multiple, on ajoute ou supprime l'élément de la sélection
      const isSelected = selectedItems.some(
        (selected) => selected.value === item.value,
      );
      let newSelectedItems;

      if (isSelected) {
        // Supprimer l'élément s'il est déjà sélectionné
        newSelectedItems = selectedItems.filter(
          (selected) => selected.value !== item.value,
        );
      } else {
        // Ajouter l'élément s'il n'est pas déjà sélectionné
        newSelectedItems = [...selectedItems, item];
      }

      setSelectedItems(newSelectedItems);
      onSelect(item);
    } else {
      // En mode simple, on remplace l'élément sélectionné
      setSelectedItems([item]);
      onSelect(item);
      setIsOpen(false);
    }
  };

  // Vérifier si un élément est sélectionné
  const isSelected = (item: DropdownItem) => {
    return selectedItems.some((selected) => selected.value === item.value);
  };

  // Afficher le texte du bouton
  const buttonText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    } else if (multiple && selectedItems.length > 1) {
      return `${selectedItems.length} éléments sélectionnés`;
    } else {
      return selectedItems[0]?.label;
    }
  };

  // Déterminer les couleurs selon le thème
  const backgroundColor = darkMode ? theme.color('background') : 'white';
  const textColor = darkMode ? 'white' : theme.color('primary');
  const dropdownBackgroundColor = darkMode ? '#262A35' : 'white'; // Couleur exacte du Figma
  const dividerColor = darkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : theme.color('blueGrey') + '20';

  return (
    <Box style={containerStyle as ViewStyle}>
      {/* Label */}
      {label && (
        <Text
          variant="caption"
          color={theme.color('blueGrey')}
          mb={theme.space('xs')}
          medium
        >
          {label}
        </Text>
      )}

      {/* Bouton du dropdown */}
      <TouchableOpacity activeOpacity={0.8} onPress={toggleDropdown}>
        <View
          ref={buttonRef}
          style={[
            styles.button,
            {
              backgroundColor,
              borderColor: theme.color('blueGrey') + '40',
              borderRadius: 12, // Valeur exacte du Figma
            },
          ]}
        >
          <Text
            color={
              selectedItems.length > 0 ? textColor : theme.color('blueGrey')
            }
            style={styles.buttonText}
          >
            {buttonText()}
          </Text>
          <ArrowDown2RegularBoldIcon
            size={20}
            color={theme.color('blueGrey')}
            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          />
        </View>
      </TouchableOpacity>

      {/* Modal du dropdown */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                backgroundColor: dropdownBackgroundColor,
                borderRadius: 10, // Valeur exacte du Figma
                // Ombre exacte du Figma
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 20,
                },
                shadowOpacity: 0.08,
                shadowRadius: 100,
                elevation: 5,
              },
              dropdownStyle as ViewStyle,
            ]}
          >
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {items.map((item, index) => (
                <React.Fragment key={item.value.toString()}>
                  <TouchableOpacity
                    style={[
                      styles.item,
                      {
                        backgroundColor:
                          isSelected(item) && type === 'simple'
                            ? darkMode
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.05)'
                            : 'transparent',
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    {item.icon && (
                      <View style={styles.iconContainer}>{item.icon}</View>
                    )}

                    <Text color={textColor} style={styles.itemText}>
                      {item.label}
                    </Text>

                    {type === 'checkbox' && isSelected(item) && (
                      <TickSquareRegularBoldIcon
                        size={20}
                        color={theme.color('success')}
                      />
                    )}
                  </TouchableOpacity>

                  {/* Séparateur (sauf pour le dernier élément) */}
                  {index < items.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: dividerColor },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    height: 56, // Hauteur fixe selon Figma
    paddingHorizontal: 16,
  },
  buttonText: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    maxHeight: 300,
    padding: 0,
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: 300,
  },
  scrollContent: {
    padding: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20, // Padding exacts du Figma (20px gauche, 28px droite)
    marginRight: 8,
  },
  itemText: {
    flex: 1,
  },
  iconContainer: {
    marginRight: 12, // Espacement exact du Figma
  },
  divider: {
    height: 1,
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    marginVertical: 8, // Espacement exact du Figma (16px entre items)
  },
});

export default Dropdown;
