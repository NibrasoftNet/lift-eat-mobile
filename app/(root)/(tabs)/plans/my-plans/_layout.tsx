import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function MyPlansLayout() {
  return (
      <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            orientation: 'portrait',
            navigationBarHidden: true,
            statusBarHidden: true,
          }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Mes plans' }} />
        <Stack.Screen name="create" options={{ headerShown: true, title: 'Créer un plan' }} />
        <Stack.Screen
          name="details/[id]"
          options={{
              headerShown: true,
              headerShadowVisible: false,
              title: 'Détails du plan'
          }}
        />
      </Stack>
  );
}