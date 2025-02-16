import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager } from '@tanstack/react-query';

export function useAppState(onAppStateChange?: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
      if (onAppStateChange) {
        onAppStateChange(status);
      }
    });

    return () => subscription.remove();
  }, [onAppStateChange]);
}