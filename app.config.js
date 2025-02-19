export default ({ config }) => ({
  "owner": "vaflaly",
  "extra": {
    saleorApi: process.env.SALEOR_API_URL || "",
    stripePK: process.env.STRIPE_PK || "",
    channel: process.env.CHANNEL || "",
    locale: process.env.LOCALE?.split(",") || [],
    "eas": {
              "projectId": "1b5a74aa-d133-4c94-9651-4dba78bf303f"
    },
  },
  "name": "mobile",
  "slug": "autocoq",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "splash": {
    "image": "./assets/images/splash-icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "assetBundlePatterns": ["**/*"],
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.anonymous.exposhop"
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
    "url": "https://u.expo.dev/cdad611e-f28e-4cc5-b36b-1aa869bc7f94"
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
    ["expo-updates", { "useClassicUpdates": false }]
  ],
  "experiments": {
    "typedRoutes": true,
    "newArchEnabled": true
  }
});
