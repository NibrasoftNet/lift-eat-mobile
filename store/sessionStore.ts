import { SessionProps, UserProps } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the state shape and actions
interface SessionState extends SessionProps {
    setToken: (token: string | null) => void;
    setTokenExpire: (tokenExpire: number | null) => void;
    setUser: (user: UserProps | null) => void;
    clearSession: () => void;
}

// Create the session store
const sessionStore = create<SessionState>()(
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
            name: "session-storage", // name of the item in storage
        }
    )
);

export default sessionStore;