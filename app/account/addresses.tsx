import AddressBookCard from "@/components/address/addressBookCard";
import Loading from "@/components/Loading";
import { useAuth } from "@/lib/providers/authProvider";
import { useCurrentUserAddressesQuery } from "@/saleor/api.generated";
import { useState } from "react";
import {  StyleSheet, FlatList } from "react-native";
import {Text, View } from "@/components/Themed"


const CarnetDAdressesScreen = () => {
  const { authenticated, token, checkAndRefreshToken } = useAuth();
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  // Requête pour les adresses de l'utilisateur actuel
  const { loading, error, data, refetch } = useCurrentUserAddressesQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    },
    onCompleted: () => {
      setIsValidatingToken(false);
    },
    onError: async (error) => {
      if (error.message.includes("Signature has expired")) {
        await checkAndRefreshToken();
      }
      setIsValidatingToken(false);
    },
  });

  if (loading || isValidatingToken) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Erreur : {error.message}</Text>
      </View>
    );
  }

  const addresses = data?.me?.addresses || [];

  if (addresses.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Aucune adresse disponible</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={addresses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AddressBookCard address={item} onRefreshBook={() => refetch()} />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CarnetDAdressesScreen;
