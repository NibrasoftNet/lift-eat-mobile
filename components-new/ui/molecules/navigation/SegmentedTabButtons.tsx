import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components-new/ui/atoms/base';

/**
 * Interface pour les options des onglets
 */
export interface TabOption {
  id: string;
  label: string;
}

/**
 * Props pour le composant SegmentedTabButtons
 */
interface SegmentedTabButtonsProps {
  tabs: TabOption[];
  activeTabId: string;
  onTabPress: (tabId: string) => void;
}

/**
 * Composant pour afficher des boutons d'onglets segmentés
 * Style inspiré des segmented controls d'iOS et des chips Material Design
 */
const SegmentedTabButtons: React.FC<SegmentedTabButtonsProps> = ({
  tabs,
  activeTabId,
  onTabPress,
}) => {
  return (
    <View style={styles.segmentedButtonContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.segmentButton, activeTabId === tab.id && styles.activeSegmentButton]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text
            style={activeTabId === tab.id ? styles.activeSegmentText : styles.segmentText}
            variant="body"
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedButtonContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 0,
    height: 50,
    alignItems: 'center',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegmentButton: {
    backgroundColor: '#A4C73B', // Couleur verte exacte de la capture d'écran
  },
  segmentText: {
    color: '#222222',
    fontSize: 14,
    fontFamily: 'Urbanist-Medium',
    textAlign: 'center',
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontFamily: 'Urbanist-SemiBold',
    textAlign: 'center',
  },
});

export default SegmentedTabButtons;
