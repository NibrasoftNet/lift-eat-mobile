import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlanDetailHeaderProps {
  // Les props seront définies ici, par exemple :
  // title: string;
  // imageUrl: string;
  // nutritionData: any;
}

const PlanDetailHeader: React.FC<PlanDetailHeaderProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlanDetailHeader</Text>
      {/* Le contenu de l'en-tête (ImageBackground, NutritionsChart, etc.) sera implémenté ici */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles pour le conteneur principal
  },
  title: {
    // Styles pour le titre
  },
});

export default PlanDetailHeader;
