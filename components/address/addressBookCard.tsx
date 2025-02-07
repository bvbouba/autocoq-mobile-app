import { AddressDetailsFragment, useAddressDeleteMutation, useSetAddressDefaultMutation } from "@/saleor/api.generated";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AddressDisplay from "./addressDisplay";
import { Ionicons } from "@expo/vector-icons"; // Use FontAwesome if preferred

export interface AddressBookCardProps {
  address: AddressDetailsFragment;
  onRefreshBook: () => void;
}

export function AddressBookCard({ address, onRefreshBook }: AddressBookCardProps) {
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useAddressDeleteMutation();

  let cardHeader = "";
  if (address.isDefaultShippingAddress && address.isDefaultBillingAddress) {
    cardHeader = "Default Billing and Shipping Address";
  } else if (address.isDefaultShippingAddress) {
    cardHeader = "Default Shipping Address";
  } else if (address.isDefaultBillingAddress) {
    cardHeader = "Default Billing Address";
  }

  const confirmDeleteAddress = (addressId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAddressMutation({ variables: { id: addressId } });
            onRefreshBook();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Delete Icon */}
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => confirmDeleteAddress(address.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#dc3545" />
      </TouchableOpacity>
      
      {/* Card Header */}
      {!!cardHeader && <Text style={styles.header}>{cardHeader}</Text>}
      
      {/* Address Display */}
      <AddressDisplay address={address} />
      
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {!address.isDefaultBillingAddress && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setAddressDefaultMutation({
                variables: { id: address.id, type: "BILLING" },
              })
            }
          >
            <Text style={styles.buttonText}>Set Default Billing Address</Text>
          </TouchableOpacity>
        )}
        {!address.isDefaultShippingAddress && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setAddressDefaultMutation({
                variables: { id: address.id, type: "SHIPPING" },
              })
            }
          >
            <Text style={styles.buttonText}>Set Default Shipping Address</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    position: "relative",
  },
  deleteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
  },
});

export default AddressBookCard;
