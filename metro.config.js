const path = require("path");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

module.exports = (() => {
  const config = getSentryExpoConfig(__dirname);

  // Ensure .svg and .mjs files are correctly resolved
  config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
  config.resolver.sourceExts.push("svg", "mjs");

  // ✅ Fix tslib resolution
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    tslib: path.resolve(__dirname, "node_modules/tslib"),
  };

  config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

  config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

  return config;
})();