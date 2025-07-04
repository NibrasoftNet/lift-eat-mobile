import React from 'react';
import { Image, ImageProps } from 'react-native';

// PNG exportée depuis Figma : Emoji "Green salad"
// Assurez-vous que le fichier existe dans assets/emoji (nom exact ci-dessous)
const saladPng = require('../../emoji/Emoji=Green salad, Component=Fluent Emojis.png');

export interface GreenSaladEmojiProps extends ImageProps {
  /** Taille (largeur = hauteur) en pixels. Par défaut : 48 */
  size?: number;
}

/**
 * Composant Emoji 🥗 (Green Salad) conforme au style des autres Fluent Emojis.
 * Utilise l’image PNG exportée depuis Figma.
 */
export const GreenSaladEmoji: React.FC<GreenSaladEmojiProps> = ({ size = 48, style, ...props }) => {
  return (
    <Image
      source={saladPng}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      {...props}
    />
  );
};

export default GreenSaladEmoji;
