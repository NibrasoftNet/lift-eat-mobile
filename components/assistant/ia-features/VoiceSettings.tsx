import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, PanResponder } from 'react-native';
import { Switch, Text } from '@gluestack-ui/themed';
import { useIAVoice } from '@/hooks/ia/voice';
import { Volume, Volume1, Volume2 } from 'lucide-react-native';

/**
 * Composant de paramètres vocaux pour configurer la synthèse vocale
 * Permet de contrôler l'activation automatique et les propriétés de la voix
 */
export const VoiceSettings = () => {
  const { autoReadEnabled, setAutoReadEnabled, configureVoice } = useIAVoice();
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  
  // Créer des PanResponders pour les sliders
  const ratePanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Obtenir l'élément parent pour calculer la position relative
        const element = evt.currentTarget as any;
        element.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          // Calculer la position relative du toucher par rapport à l'élément
          const touchX = evt.nativeEvent.pageX - pageX;
          // Calculer la valeur du slider basée sur la position du toucher
          const newValue = 0.5 + (touchX / width) * 1.0;
          // Limiter la valeur entre 0.5 et 1.5
          const clampedValue = Math.max(0.5, Math.min(1.5, newValue));
          // Arrondir à 0.1 près
          const roundedValue = Math.round(clampedValue * 10) / 10;
          setRate(roundedValue);
        });
      },
    })
  ).current;
  
  const pitchPanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Obtenir l'élément parent pour calculer la position relative
        const element = evt.currentTarget as any;
        element.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          // Calculer la position relative du toucher par rapport à l'élément
          const touchX = evt.nativeEvent.pageX - pageX;
          // Calculer la valeur du slider basée sur la position du toucher
          const newValue = 0.5 + (touchX / width) * 1.0;
          // Limiter la valeur entre 0.5 et 1.5
          const clampedValue = Math.max(0.5, Math.min(1.5, newValue));
          // Arrondir à 0.1 près
          const roundedValue = Math.round(clampedValue * 10) / 10;
          setPitch(roundedValue);
        });
      },
    })
  ).current;

  // Appliquer les changements de configuration
  useEffect(() => {
    configureVoice({
      rate,
      pitch
    });
  }, [rate, pitch, configureVoice]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Paramètres vocaux</Text>

        {/* Activation de la lecture automatique */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Lecture automatique</Text>
          <Switch
            value={autoReadEnabled}
            onValueChange={(value) => setAutoReadEnabled(value)}
            trackColor={{
              false: "#D1D5DB",
              true: "#4F46E5",
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Contrôle de la vitesse de lecture */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Vitesse de lecture</Text>
          <View style={styles.controlRow}>
            <Volume size={18} color="#666" />
            <View 
              style={styles.sliderContainer}
              {...ratePanResponder.panHandlers}
            >
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFilled, { width: `${((rate - 0.5) / 1) * 100}%` }]} />
              </View>
              <View style={[styles.sliderThumb, { left: `${((rate - 0.5) / 1) * 100}%` }]} />
            </View>
            <Volume2 size={18} color="#666" />
          </View>
          <Text style={styles.valueText}>{rate.toFixed(1)}x</Text>
        </View>

        {/* Contrôle de la hauteur de la voix */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Hauteur de la voix</Text>
          <View style={styles.controlRow}>
            <Volume1 size={18} color="#666" />
            <View 
              style={styles.sliderContainer}
              {...pitchPanResponder.panHandlers}
            >
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFilled, { width: `${((pitch - 0.5) / 1) * 100}%` }]} />
              </View>
              <View style={[styles.sliderThumb, { left: `${((pitch - 0.5) / 1) * 100}%` }]} />
            </View>
            <Volume2 size={18} color="#666" />
          </View>
          <Text style={styles.valueText}>{pitch.toFixed(1)}</Text>
        </View>

        <Text style={styles.hint}>
          La lecture automatique permet à l'assistant de lire à voix haute ses réponses dès qu'elles sont reçues.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingGroup: {
    marginVertical: 8,
    gap: 8,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    gap: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  hint: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
    fontStyle: 'italic',
  },
  sliderContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginHorizontal: 8,
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  sliderFilled: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    left: 0,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    position: 'absolute',
    top: -6,
    marginLeft: -8,
  },

});

export default VoiceSettings;
