// lib/analytics.ts
let analytics: any;

try {
  // Always export a callable function
  const analyticsModule = require('@react-native-firebase/analytics').default;
  analytics = () => analyticsModule();
} catch (e) {
  // In Expo Go fallback, return a dummy object
  analytics = () => ({
    logEvent: async () => {},
    setUserId: async () => {},
    setUserProperty: async () => {},
  });
}

export default analytics;