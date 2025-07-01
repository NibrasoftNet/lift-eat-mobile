import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../atoms/base/Text';
interface FoodNameProps {
  /**
   * Nom de l'aliment
   */
  name: string;
  
  /**
   * Couleur du texte (varie selon le mode sombre/clair)
   */
  color: string;
}

/**
 * Composant FoodName
 * Affiche le nom d'un aliment selon les spécifications exactes du design Figma
 */
const FoodName: React.FC<FoodNameProps> = ({ 
  name,
  color
}) => {
  // Diviser le nom "Hamburger" en deux lignes comme dans le design Figma
  // Si le nom est "Hamburger", diviser après "Hamburg"
  // Gestion stricte du retour à la ligne pour 'Hamburger' (fidèle à Figma)
  const formattedName = name === "Hamburger" ? (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 50 }}>
      <Text style={[styles.text, { color, marginBottom: -8 }]}>Hamburg</Text>
      <Text style={[styles.text, { color, marginTop: -10 }]}>er</Text>
    </View>
  ) : (
    <Text style={[styles.text, { color }]}>{name}</Text>
  );
  
  return (
    <View style={styles.container}>
      {formattedName}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'Urbanist',
    fontSize: 18, // Taille exacte de 18px selon Figma (node-id=48468:22898)
    fontWeight: '700', // Bold (700) selon Figma
    textAlign: 'center',
    lineHeight: 25.2, // 18px × 1.4 (lineHeight 1.4em selon Figma)
    color: '#212121', // Couleur exacte selon Figma (ID: fill_HU4VQT)
  },
});

export default FoodName;
