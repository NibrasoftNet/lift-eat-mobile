import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HamburgerEmoji } from '../../../../assets/icons/fluent-emojis/HamburgerEmoji';

interface FoodEmojiProps {
  /**
   * Composant emoji ou icône à afficher
   */
  emoji?: React.ReactNode;

  /**
   * Taille de l'emoji
   */
  size?: number;
}

/**
 * Composant FoodEmoji
 * Affiche l'emoji d'un aliment selon les spécifications exactes du design Figma
 * node-id=48485:28635
 */
const FoodEmoji: React.FC<FoodEmojiProps> = ({ emoji, size = 48 }) => {
  return (
    <View style={styles.container}>
      {/* Toujours utiliser la taille exacte Figma et le bon composant */}
      {emoji ? (
        React.cloneElement(emoji as React.ReactElement, { size })
      ) : (
        <HamburgerEmoji size={size} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56, // Taille exacte selon Figma (node-id=48468:22898)
    height: 56, // Taille exacte selon Figma (node-id=48468:22898)
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8, // Espacement exact selon Figma
  },
});

export default FoodEmoji;
