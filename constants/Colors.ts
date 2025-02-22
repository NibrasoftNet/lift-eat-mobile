/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// Define the primary and secondary colors
const primaryColor = '#3b82f6'; // bg-blue-500
const secondaryColor = '#f59e0b'; // bg-amber-500

// Define the tint colors for light and dark modes
const tintColorLight = primaryColor; // Use primary color for light mode
const tintColorDark = secondaryColor; // Use secondary color for dark mode

export const Colors = {
  grey: '#A6A3AF',
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  primary: {
    text: '#FFFFFF',
    background: primaryColor,
    tint: primaryColor,
    icon: '#FFFFFF',
    tabIconDefault: '#FFFFFF',
    tabIconSelected: primaryColor,
  },
  secondary: {
    text: '#ECEDEE',
    background: secondaryColor,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};


