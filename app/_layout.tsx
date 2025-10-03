import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client/main.cjs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from "@/components/Themed";
import SearchHeader from "@/components/layout/SearchHeader";
import SimpleBackHeader from "@/components/layout/SimpleBackHeader";
import SimpleCloseHeader from "@/components/layout/SimpleCloseHeader";

import { getConfig } from "@/config";

import { CarFilterProvider } from "@/context/useCarFilterContext";
import { AuthProvider } from "@/lib/providers/authProvider";
import { ModalProvider } from "@/context/useModal";
import { CheckoutProvider } from "@/context/CheckoutProvider";
import { LoadingProvider } from "@/context/LoadingContext";
import { MessageProvider } from "@/context/MessageContext";
import { MenuProvider } from "@/context/MenuProvider";
import { NavigationProvider } from "@/context/NavigationContext";
import * as Sentry from '@sentry/react-native';


Sentry.init({
  dsn: 'https://52e1edc32f09d618306384d6b24ae402@o4508599315529728.ingest.us.sentry.io/4510047000133632',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default Sentry.wrap(function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) {
      import("expo-splash-screen").then(SplashScreen => SplashScreen.preventAutoHideAsync());
    } else {
      import("expo-splash-screen").then(SplashScreen => SplashScreen.hideAsync());
    }
  }, [loaded]);

  return !loaded ? null : <RootLayoutNav />;
});

LogBox.ignoreAllLogs();

function RootLayoutNav() {
  const apiUrl = getConfig().saleorApi;

  const apolloClient = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache(),
  });

  const baseHeaderProps = {
    headerTitle: "",
    header: () => <SimpleBackHeader />,
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
      <MessageProvider>
        <AuthProvider>
          <CheckoutProvider>
          <LoadingProvider>
            <ModalProvider>
                <MenuProvider>
                  <CarFilterProvider>
                      <NavigationProvider>
                        <Stack>
                          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                          <Stack.Screen
                            name="search"
                            options={{
                              headerStyle: { backgroundColor: colors.background },
                              header: () => <SearchHeader withBack />,
                            }}
                          />
                          <Stack.Screen
                            name="categories/[slug]"
                            options={{
                              headerStyle: { backgroundColor: colors.background },
                              header: () => <SearchHeader withBack hasNavigationLink={true} />,
                            }}
                          />
                          <Stack.Screen
                            name="collections/[slug]"
                            options={{
                              headerStyle: { backgroundColor: colors.background },
                              header: () => <SearchHeader withBack />,
                            }}
                          />
                          <Stack.Screen
                            name="products/[id]"
                            options={{
                              header: () => <SearchHeader withBack withVehicle={false} />,
                            }}
                          />
                          <Stack.Screen
                            name="checkout"
                            options={{
                              header: () => (
                                <SimpleCloseHeader title="Commande" subTitle="Paiement et Révision" />
                              ),
                            }}
                          />
                          <Stack.Screen name="personalDetails" options={baseHeaderProps} />
                          <Stack.Screen
                            name="shippingAddress"
                            options={{
                              header: () => (
                                <SimpleCloseHeader title="Commande" subTitle="Addresse de Livraison" />
                              ),
                            }}
                          />
                          <Stack.Screen
                            name="billingAddress"
                            options={{
                              header: () => (
                                <SimpleCloseHeader title="Commande" subTitle="Addresse de Facturation" />
                              ),
                            }}
                          />
                          <Stack.Screen name="shippingMethods" options={baseHeaderProps} />
                          <Stack.Screen name="paymentMethods" options={baseHeaderProps} />
                          <Stack.Screen name="orders/[id]" options={{
                             headerTitle: "",
                             header: () => <SimpleBackHeader hasNavigationLink={true} />,
                          }} />
                          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                          <Stack.Screen
                            name="account/profile"
                            options={{
                              header: () => <SimpleBackHeader hasLogo={false} title="Mon profil" />,
                            }}
                          />
                          <Stack.Screen
                            name="account/faq"
                            options={{
                              header: () => <SimpleBackHeader hasLogo={false} title="FAQ" />,
                            }}
                          />
                          <Stack.Screen
                            name="account/terms"
                            options={{
                              header: () => <SimpleBackHeader hasLogo={false} title="Termes et conditions" />,
                            }}
                          />
                          <Stack.Screen
                            name="account/addresses"
                            options={{
                              header: () => <SimpleBackHeader hasLogo={false} title="Mes Adresses" />,
                            }}
                          />
                          <Stack.Screen
                            name="account/orders"
                            options={{
                              header: () => <SimpleBackHeader hasLogo={false} title="Mes commandes" />,
                            }}
                          />
                           <Stack.Screen
                            name="account/deleteAccount"
                            options={{
                              header: () => <SimpleBackHeader hasLogo={false} title="Supprimer mon compte" />,
                            }}
                          />
                        </Stack>
                      </NavigationProvider>
                  </CarFilterProvider>
                </MenuProvider>
            </ModalProvider>
           </LoadingProvider>
          </CheckoutProvider>
        </AuthProvider>
        </MessageProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}