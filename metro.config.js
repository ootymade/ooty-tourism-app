const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite's web implementation (wa-sqlite) ships a .wasm binary that
// Metro doesn't treat as an asset by default.
config.resolver.assetExts.push('wasm');

module.exports = config;
