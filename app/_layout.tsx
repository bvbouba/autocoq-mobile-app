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

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Handle error during font loading
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) {
      SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding
    } else {
      SplashScreen.hideAsync(); // Hide splash screen after fonts are loaded
    }
  }, [loaded]);

  return (
    <>
      {!loaded ? (
        // No need to explicitly render SplashScreen as a component
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

  const companyName = "AUTOCOQ";

  return (
    <ApolloProvider client={apolloClient}>
      <ProductsProvider>
        <CartProvider>
          <OrderProvider>
            <PaymentProvider>
            <CarFilterProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      header: () => <SearchHeader withBack={false} cleanSearch companyName={companyName}/>,
                    }}
                  />
                  <Stack.Screen
                    name="products/results"
                    options={{
                      headerStyle: {
                        backgroundColor: colors.header,
                      },
                      header: () => <SearchHeader withBack />,
                    }}
                  />
                  <Stack.Screen name="products/details/[id]" options={baseHeaderProps} />
                  <Stack.Screen name="checkout" options={{ ...baseHeaderProps, headerTitle: "Checkout" }} />
                  <Stack.Screen name="personalDetails" options={baseHeaderProps} />
                  <Stack.Screen name="shippingAddress" options={baseHeaderProps} />
                  <Stack.Screen name="billingAddress" options={baseHeaderProps} />
                  <Stack.Screen name="shippingMethods" options={baseHeaderProps} />
                  <Stack.Screen name="orderDetails/[id]" options={baseHeaderProps} />
                  <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                </Stack>
              </ThemeProvider>
              </GestureHandlerRootView>
           </CarFilterProvider>
            </PaymentProvider>
          </OrderProvider>
        </CartProvider>
      </ProductsProvider>
    </ApolloProvider>
  );
}
