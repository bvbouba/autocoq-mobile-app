import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox, useColorScheme } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from "../components/Themed";
import SearchHeader from "../components/layout/SearchHeader";
import { CartProvider } from "../context/useCartContext";
import { OrderProvider } from "../context/useOrderContext";
import { PaymentProvider } from "../context/usePaymentContext";
import { ProductsProvider } from "../context/useProductContext";
export {
  ErrorBoundary
} from "expo-router";
import { getConfig } from "../config";
import SimpleBackHeader from "../components/layout/SimpleBackHeader";
import * as SplashScreen from 'expo-splash-screen'; // Corrected import
import { CarFilterProvider } from "@/context/useCarFilterContext";
import { AuthProvider } from "@/lib/providers/authProvider";
import SimpleCloseHeader from "@/components/layout/SimpleCloseHeader";
import { BackUrlProvider } from "@/context/backUrl";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Gérer l'erreur lors du chargement des polices
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) {
      SplashScreen.preventAutoHideAsync(); // Empêcher l'écran de démarrage de se cacher
    } else {
      SplashScreen.hideAsync(); // Masquer l'écran de démarrage après le chargement des polices
    }
  }, [loaded]);

  return (
    <>
      {!loaded ? (
        // Pas besoin de rendre explicitement SplashScreen en tant que composant
        <></>
      ) : (
        <RootLayoutNav />
      )}
    </>
  );
}

LogBox.ignoreAllLogs();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
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
    <ApolloProvider client={apolloClient}>
    <AuthProvider>
    <BackUrlProvider>
     <CarFilterProvider>
      <ProductsProvider>
        <CartProvider>
          <OrderProvider>
            <PaymentProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown:false
                    }}
                  />
                  <Stack.Screen
                    name="products/results"
                    options={{
                      headerStyle: {
                        backgroundColor: colors.background,
                      },
                      header: () => <SearchHeader withBack />,
                    }}
                  />
                  <Stack.Screen
                    name="categories/[slug]"
                    options={{
                      headerStyle: {
                        backgroundColor: colors.background,
                      },
                      header: () => <SearchHeader withBack />,
                    }}
                  />
                  <Stack.Screen name="products/details/[id]" options={baseHeaderProps} />
                  <Stack.Screen name="checkout" options={{
                    header:()=><SimpleCloseHeader  title="Commande" subTitle="Paiement et Révision"/>
                    }}  />
                  <Stack.Screen name="personalDetails" options={baseHeaderProps} />
                  <Stack.Screen name="shippingAddress" options={{
                    header:()=><SimpleCloseHeader  title="Commande" subTitle="Addresse de Livraison"/>
                    }} />
                  <Stack.Screen name="billingAddress" options={{
                    header:()=><SimpleCloseHeader  title="Commande" subTitle="Addresse de Facturation"/>
                    }}  />
                  <Stack.Screen name="shippingMethods" options={baseHeaderProps} />
                  <Stack.Screen name="paymentMethods" options={baseHeaderProps} />
                  <Stack.Screen name="orderDetails/[id]" options={baseHeaderProps} />
                  <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                  <Stack.Screen name="account/profile" options={{ headerTitle: "Mon profil"}} />
                  <Stack.Screen name="account/faq" options={{ headerTitle: "FAQ"}} />
                  <Stack.Screen name="account/terms" options={{ headerTitle: "Termes et conditions"}} />
                  <Stack.Screen name="account/auth" options={{
                                                      headerTitle: "",
                                                      header: () => <SimpleBackHeader hasLogo={true} />,
                                                    }} />
                  <Stack.Screen name="account/signup" options={{
                                                      headerTitle: "",
                                                      header: () => <SimpleBackHeader hasLogo={true} />,
                                                    }} />
                  <Stack.Screen name="account/signin" options={{
                                                      headerTitle: "",
                                                      header: () => <SimpleBackHeader hasLogo={true} />,
                                                    }} />
                  <Stack.Screen name="account/addresses" options={{ headerTitle: "Adresses"}} />
                  <Stack.Screen name="account/orders" options={{ headerTitle: "Mes commandes"}} />
                </Stack>
              </ThemeProvider>
              </GestureHandlerRootView>
            </PaymentProvider>
          </OrderProvider>
        </CartProvider>
      </ProductsProvider>
      </CarFilterProvider>
      </BackUrlProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
