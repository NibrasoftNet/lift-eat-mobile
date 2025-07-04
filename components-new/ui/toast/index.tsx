// @ts-nocheck
/**
 * Simple toast context based on React context.
 * Only provides the minimal API (toast.show) expected by existing code.
 * It prints the toast message in the console and, on Android, via ToastAndroid.
 * You can enhance this implementation later (animations, styles, etc.).
 */
import React, { createContext, useContext } from 'react';
import { Platform, ToastAndroid } from 'react-native';

// Internal types for toast.show parameters (kept flexible)
interface ToastShowParams {
  placement?: 'top' | 'bottom' | 'center';
  render: (props: { id: string }) => React.ReactNode;
}

interface ToastContextValue {
  show: (params: ToastShowParams) => void;
}

const noop = () => {};

const ToastContext = createContext<ToastContextValue>({
  show: noop,
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const show = ({ render }: ToastShowParams) => {
    // Generate a simple id for the toast instance
    const id = Math.random().toString(36).slice(2);

    // Execute the render function to build the toast component (not displayed here)
    const node = render({ id });

    // Fallback behaviour: log to console / native toast on Android
    if (Platform.OS === 'android') {
      ToastAndroid.show('Toast triggered', ToastAndroid.SHORT);
    }

    console.log('[Toast]', node);
  };

  return <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext);
