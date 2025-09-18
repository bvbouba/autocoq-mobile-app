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

import { OrderProvider } from "@/context/useOrderContext";
import { CarFilterProvider } from "@/context/useCarFilterContext";
import { AuthProvider } from "@/lib/providers/authProvider";
// import { NavigationProvider } from "@/context/NavigationContext"; // REMOVE THIS IMPORT
import { ModalProvider } from "@/context/useModal";
import { CheckoutProvider } from "@/context/CheckoutProvider";
import { LoadingProvider } from "@/context/LoadingContext";
import { MessageProvider } from "@/context/MessageContext";
import { MenuProvider } from "@/context/MenuProvider";
import { NavigationProvider } from "@/context/NavigationContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
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
}

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
            <ModalProvider>
                <MenuProvider>
                  <CarFilterProvider>
                    <LoadingProvider>
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
                              header: () => <SearchHeader withBack />,
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
                          <Stack.Screen name="orders/[id]" options={baseHeaderProps} />
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
                        </Stack>
                      </NavigationProvider>
                    </LoadingProvider>
                  </CarFilterProvider>
                </MenuProvider>
            </ModalProvider>
          </CheckoutProvider>
        </AuthProvider>
        </MessageProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}