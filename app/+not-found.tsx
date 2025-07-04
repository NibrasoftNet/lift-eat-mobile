import { Link, router, Stack } from 'expo-router';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components-new/ui/atoms/base';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

export default function NotFoundScreen() {
  // Utilisation du thème de l'application
  const theme = useAppTheme();
  
  // Styles dynamiques basés sur le thème
  const successColor = theme.color('successLighter');
  const dynamicStyles = {
    container: {
      backgroundColor: theme.colors.background,
    },
    button: {
      backgroundColor: theme.colors.successLighter,
    },
    title: {
      color: theme.colors.primary,
    },
    subtitle: {
      color: theme.colors.blueGrey,
    },
    buttonText: {
      color: theme.colors.background,
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page introuvable',
        headerShown: false
      }} />
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={styles.contentContainer}>
          {/* Élément visuel 404 */}
          <View style={[styles.visualContainer, { borderColor: successColor }]}>
            <Text
              variant="h1"
              bold
              style={[styles.errorCode, { color: successColor }]}
            >
              404
            </Text>
            <View style={[styles.visualLine, { backgroundColor: successColor }]} />
          </View>
          
          {/* Texte principal */}
          <Text 
            variant="h1" 
            bold
            style={dynamicStyles.title}
          >
            Oups, page introuvable!
          </Text>
          
          <Text 
            variant="body" 
            style={[styles.subtitle, dynamicStyles.subtitle]}
          >
            La page que vous recherchez n'existe pas ou a été déplacée.
          </Text>
          
          {/* Bouton pour retourner à la page précédente */}
          <TouchableOpacity 
            style={[styles.button, dynamicStyles.button]}
            onPress={() => router.back()}
          >
            <View style={styles.buttonContent}>
              <ArrowLeft size={20} color={theme.colors.background} />
              <Text 
                variant="button" 
                semibold
                style={[styles.buttonText, dynamicStyles.buttonText]}
              >
                Retour à la page précédente
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  visualContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#A4C73B',
    padding: 20,
  },
  errorCode: {
    fontSize: 72,
    color: '#A4C73B',
    marginBottom: 12,
  },
  visualLine: {
    width: 80,
    height: 6,
    backgroundColor: '#A4C73B',
    borderRadius: 3,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    width: '100%',
  },
  buttonText: {
    marginLeft: 8,
  },
});
