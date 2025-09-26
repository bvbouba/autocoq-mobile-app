export default () => ({
  owner: "vaflaly",
  extra: {
    saleorApi:
      process.env.EXPO_PUBLIC_SALEOR_API_URL ||
      "https://django.autocoq.com/graphql/",
    channel: process.env.EXPO_PUBLIC_CHANNEL || "ci",
    locale: process.env.EXPO_PUBLIC_LOCALE?.split(",") || ["fr"],
    eas: {
      projectId: "1b5a74aa-d133-4c94-9651-4dba78bf303f",
    },
  },
  name: "AutoCoq",
  slug: "autocoq",
  newArchEnabled: true,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "cover",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.exposhop",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    googleServicesFile: "./GoogleService-Info.plist",
  },
  android: {
    versionCode: 2,
    splash: {
      image: "./assets/images/splash-android.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    usesCleartextTraffic: true, 
    package: "com.anonymous.exposhop",
    googleServicesFile: "./google-services.json",
    /**
     * 👇 Explicitly declare permissions to exclude AD_ID
     * Add only the permissions you actually need (INTERNET is added by default)
     */
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      // add others you really need here (camera, location, etc.)
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  updates: {
    url: "https://u.expo.dev/1b5a74aa-d133-4c94-9651-4dba78bf303f",
  },
  runtimeVersion: "1.0.0",
  plugins: [
    "expo-router",
    ["expo-updates", { useClassicUpdates: false }],
    "expo-asset",
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          buildReactNativeFromSource: true,
          useNewArch: true,
        },
        android: {
          // also here for good measure
          permissions: [
            "android.permission.INTERNET",
            "android.permission.ACCESS_NETWORK_STATE",
          ],
        },
      },
    ],
    "./plugins/withDisableNonModularHeadersWarning.js",
  ],
  experiments: {
    typedRoutes: true,
    newArchEnabled: true,
  },
});
