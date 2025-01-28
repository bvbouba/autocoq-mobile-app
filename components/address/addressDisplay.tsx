import { AddressDetailsFragment } from "@/saleor/api.generated";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface AddressDisplayProps {
  address: AddressDetailsFragment;
}

export function AddressDisplay({ address }: AddressDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <Text style={styles.text}>
          {address?.firstName} {address?.lastName}
        </Text>
        <Text style={styles.text}>{address?.streetAddress1}</Text>
        <Text style={styles.text}>
          {address?.postalCode} {address?.city}, {address?.country.country}
        </Text>
      </View>
      <Text style={styles.phone}>{address?.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  addressContainer: {
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddressDisplay;
