import AddressBookCard from "@/components/address/addressBookCard";
import { useAuth } from "@/lib/providers/authProvider";
import { useCurrentUserAddressesQuery } from "@/saleor/api.generated";
import { useState } from "react";
import {  StyleSheet, FlatList } from "react-native";
import {fonts, PaddedView, Text, View } from "@/components/Themed"
import { Skeleton } from "moti/skeleton";


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
      <View style={styles.container}>
          {[...Array(2)].map((_, index) => (
               <PaddedView key={index}>
                  <Skeleton colorMode="light" height={150} width="100%" />
                  </PaddedView>
          ))}
      </View>
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
      <PaddedView style={styles.container}>
        <Text>Aucune adresse disponible</Text>
      </PaddedView>
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
    padding:10
  },
  error: {
    color: "red",
    fontSize:fonts.h2,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CarnetDAdressesScreen;
