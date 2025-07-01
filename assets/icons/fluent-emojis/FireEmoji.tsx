import React from 'react';
import { Image, ImageProps } from 'react-native';

// IMPORTANT : veillez à placer le PNG "Emoji=Fire, Component=Fluent Emojis.png"
// dans le dossier assets/emoji pour que l'import fonctionne.
// Si le fichier porte un autre nom, ajustez le require ci-dessous.
const firePng = require('../../emoji/Emoji=Fire, Component=Fluent Emojis.png');

export interface FireEmojiProps extends ImageProps {
  /** Taille (largeur = hauteur) en pixels. Par défaut : 48 */
  size?: number;
}

/**
 * Composant Emoji 🔥 (Flame) conforme au style Fluent Emojis.
 */
export const FireEmoji: React.FC<FireEmojiProps> = ({ size = 48, style, ...props }) => {
  return (
    <Image
      source={firePng}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      {...props}
    />
  );
};

export default FireEmoji;
