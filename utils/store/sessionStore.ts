import { SessionProps, UserSessionProps } from '@/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the state shape and actions
interface SessionState extends SessionProps {
  setToken: (token: string | null) => void;
  setTokenExpire: (tokenExpire: number | null) => void;
  setUser: (user: UserSessionProps | null) => void;
  clearSession: () => void;
}

// Create the session store using AsyncStorage for persistence
const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      tokenExpire: null,
      user: null,
      setToken: (token) => set({ token }),
      setTokenExpire: (tokenExpire) => set({ tokenExpire }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, tokenExpire: null, user: null }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Ne persister que le token et l'expiration pour éviter de conserver un ancien utilisateur
      partialize: (state) => ({
        token: state.token,
        tokenExpire: state.tokenExpire,
      }),
    },
  ),
);

export default useSessionStore;
