import { useEffect } from 'react';
import { onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

export function useOnlineManager() {
  useEffect(() => {
    // Enable auto-refetch when the app reconnects to the internet
    return onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });
  }, []);
}
