/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// Define the colors
const primaryColor = '#3361A2'; // Hex equivalent of your RGB '51 97 162'
const secondaryColor = '#6B7280'; // Neutral gray (Tailwind's "gray-500")
const tertiaryColor = '#FF9F00'; // Hex for RGB 255 159 0

// Define the tint colors for light and dark modes
const tintColorLight = primaryColor; // Use primary color for light mode
const tintColorDark = secondaryColor; // Use secondary color for dark mode

export const Colors = {
  grey: '#A6A3AF',
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#FFFFFF',
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
    text: '#FFFFFF', // White text (optimal contrast)
    background: primaryColor, // Your exact navy (RGB 51,97,162)
    tint: '#7F9FD1', // Lighter navy tint (RGB ~127,159,209)
    icon: '#FFFFFF', // White icons
    tabIconDefault: '#9CA3AF', // gray-400 for inactive tabs
    tabIconSelected: primaryColor, // Navy for active tab
  },
  secondary: {
    text: '#FFFFFF', // White text for contrast on mid-gray
    background: secondaryColor, // Gray background
    tint: '#9CA3AF', // Lighter gray for highlights (Tailwind's "gray-400")
    icon: '#FFFFFF', // White icons
    tabIconDefault: '#D1D5DB', // Light gray for inactive tabs ("gray-300")
    tabIconSelected: secondaryColor, // Base gray for active tab
  },
  tertiary: {
    text: '#000000', // Black (optimal contrast on amber)
    background: tertiaryColor, // Your exact amber (RGB 255,159,0)
    tint: '#FFC245', // Lighter amber tint (RGB 255,194,69)
    icon: '#000000', // Black icons
    tabIconDefault: '#D1D5DB', // gray-300 for inactive tabs
    tabIconSelected: tertiaryColor, // Amber for active tab
  },
  blue: {
    light: '#DBEAFE',
    background: '#2563EB',
  },
  red: {
    light: '#FEE2E2',
    background: '#D60404',
  },
  amber: {
    light: '#FEE2E2',
    background: '#D97706',
  },
  green: {
    light: '#DCFCE7',
    background: '#059669',
    icon: '#29CC29',
  },
};
