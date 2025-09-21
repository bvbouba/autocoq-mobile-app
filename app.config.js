export default () => ({
  "owner": "vaflaly",
  "extra": {
    saleorApi: process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://django.autocoq.com/graphql/",
    stripePK: process.env.EXPO_PUBLIC_STRIPE_PK || "",
    channel: process.env.EXPO_PUBLIC_CHANNEL || "ci",
    locale: process.env.EXPO_PUBLIC_LOCALE?.split(",") || ["fr"],
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
    },
    "googleServicesFile": "./GoogleService-Info.plist"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.anonymous.exposhop",
    "googleServicesFile": "./google-services.json"
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
    "expo-asset",
    "@react-native-firebase/app",
    "@react-native-firebase/analytics",
  ],
  "experiments": {
    "typedRoutes": true,
    "newArchEnabled": true
  }
});
