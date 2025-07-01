const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path aliases
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'sql'],
  extraNodeModules: {
    '@': path.resolve(__dirname, './'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
