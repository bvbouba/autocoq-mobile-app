import AddressBookCard from "@/components/address/addressBookCard";
import { useAuth } from "@/lib/authProvider";
import {  useCurrentUserAddressesQuery } from "@/saleor/api.generated";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";


const AddressBookScreen = ()=> {
  const {authenticated} = useAuth()
  const { loading, error, data, refetch } = useCurrentUserAddressesQuery({
    skip: !authenticated,
    fetchPolicy: "network-only",
  });


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <View style={styles.container}><Text style={styles.error}>Error: {error.message}</Text>
      </View>
  }

  const addresses = data?.me?.addresses || [];

  if (addresses.length === 0) {
    return <View style={styles.container}><Text>No address data available</Text></View>;
  }

  return (
    <FlatList
      data={addresses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AddressBookCard address={item} onRefreshBook={()=>refetch()} />
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default AddressBookScreen;
