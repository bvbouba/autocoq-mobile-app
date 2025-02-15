import React, { useState } from "react";
import {  TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { AddressDetailsFragment, CheckoutError, useCurrentUserAddressesQuery } from "@/saleor/api.generated";
import { useAuth } from "@/lib/providers/authProvider";
import {fonts, Text, View } from "@/components/Themed"
import { useRouter } from "expo-router";


// Mock AddressFormData type
type AddressFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  postalCode: string;
};

interface SavedAddressSelectionListProps {
  updateAddressMutation: (address: AddressFormData) => Promise<CheckoutError[] | undefined>;
}

const SavedAddressSelectionList = ({ updateAddressMutation }: SavedAddressSelectionListProps) => {
    const {authenticated,token,checkAndRefreshToken} = useAuth()
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const router = useRouter()
    const { loading, error, data } = useCurrentUserAddressesQuery({
      skip: !authenticated, 
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
    const [selectedSavedAddress, setSelectedSavedAddress] =
      React.useState<AddressDetailsFragment | null>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [uError, setUError] = useState<string | null>(null);

  if (loading && isValidatingToken) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  const addresses = data?.me?.addresses || [];

  if (addresses.length === 0) return null;

  const onSelectSavedAddress = async (address: AddressDetailsFragment) => {
    setSelectedSavedAddress(address);
    setIsUpdating(true);
    const errors =
      (await updateAddressMutation({
        firstName: address?.firstName,
        lastName: address?.lastName,
        phone: address?.phone || "",
        country: address?.country?.country || "CI",
        streetAddress1: address?.streetAddress1,
        streetAddress2: "",
        city: address?.city,
        postalCode: address?.postalCode,
      })) || [];

    setIsUpdating(false);

    if (errors && errors.length > 0) {
      setUError(`Error: ${errors[0].field}`);
    } else {
      router.push("/checkout")
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {addresses.map((address: any) => (
        <View key={address?.id} style={styles.addressWrapper}>
          <TouchableOpacity
            style={[
              styles.addressCard,
              address?.id === selectedSavedAddress?.id && styles.selectedAddress,
            ]}
            onPress={() => onSelectSavedAddress(address)}
            disabled={isUpdating}
          >
            <Text style={styles.nameText}>{`${address?.firstName} ${address?.lastName}`}</Text>
            <Text style={styles.detailsText}>{address?.streetAddress1}</Text>
            <Text style={styles.detailsText}>
              {`${address?.postalCode} ${address?.city}, ${address?.country.country}`}
            </Text>
          </TouchableOpacity>
          {isUpdating && selectedSavedAddress?.id === address?.id && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
        </View>
      ))}
      {uError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{uError}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  addressWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fff",
  },
  selectedAddress: {
    borderColor: "#007AFF",
  },
  nameText: {
    fontSize:fonts.h2,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailsText: {
    fontSize:fonts.body,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  errorContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});

export default SavedAddressSelectionList;
