import React from 'react';
import { Image, ImageProps } from 'react-native';

// PNG exportée : Emoji "Calendar" (Fluent Emojis)
// Assurez-vous que le fichier existe exactement à ce chemin.
const calendarPng = require('../../emoji/Emoji=calendar, Component=Fluent Emojis.png');

export interface CalendarEmojiProps extends ImageProps {
  /** Taille (largeur = hauteur). Par défaut : 24 pour s'adapter à l'en-tête */
  size?: number;
}

/**
 * Emoji 🗓 Calendar (Fluent).
 * Utilisé pour l'icône de sélection de date dans la barre de titre.
 */
export const CalendarEmoji: React.FC<CalendarEmojiProps> = ({ size = 24, style, ...props }) => {
  return (
    <Image
      source={calendarPng}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      {...props}
    />
  );
};

export default CalendarEmoji;
