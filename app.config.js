export default () => ({
  "owner": "vaflaly",
  "extra": {
    saleorApi: process.env.EXPO_PUBLIC_SALEOR_API_URL,
    stripePK: process.env.EXPO_PUBLIC_STRIPE_PK,
    channel: process.env.EXPO_PUBLIC_CHANNEL,
    locale: process.env.EXPO_PUBLIC_LOCALE?.split(","),
    "eas": {
              "projectId": "1b5a74aa-d133-4c94-9651-4dba78bf303f"
    },
  },
  "name": "AutoCoq",
  "slug": "autocoq",
  "newArchEnabled": true,
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "splash": {
    "image": "./assets/images/splash-icon.png",
    "resizeMode": "cover",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": ["**/*"],
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.anonymous.exposhop",
    "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    }
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.anonymous.exposhop"
  },
  "web": {
    "bundler": "metro",
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  },
  "updates": {
    "url": "https://u.expo.dev/1b5a74aa-d133-4c94-9651-4dba78bf303f"
  },
  "runtimeVersion": "1.0.0",
  "plugins": [
    [
      "@stripe/stripe-react-native",
      {
        "merchantIdentifier": "",
        "enableGooglePay": false
      }
    ],
    "expo-router",
    ["expo-updates", { "useClassicUpdates": false }],
    "expo-asset"
  ],
  "experiments": {
    "typedRoutes": true,
    "newArchEnabled": true
  }
});
