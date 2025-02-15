import { AddressDetailsFragment, useAddressDeleteMutation, useSetAddressDefaultMutation } from "@/saleor/api.generated";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import AddressDisplay from "./addressDisplay";
import { Ionicons } from "@expo/vector-icons"; // Use FontAwesome if preferred
import {fonts, Text, View  } from "@/components/Themed"

export interface AddressBookCardProps {
  address: AddressDetailsFragment;
  onRefreshBook: () => void;
}

export function AddressBookCard({ address, onRefreshBook }: AddressBookCardProps) {
  const [setAddressDefaultMutation] = useSetAddressDefaultMutation();
  const [deleteAddressMutation] = useAddressDeleteMutation();

  let cardHeader = "";
  if (address.isDefaultShippingAddress && address.isDefaultBillingAddress) {
    cardHeader = "Adresse de facturation et de livraison par défaut";
  } else if (address.isDefaultShippingAddress) {
    cardHeader = "Adresse de livraison par défaut";
  } else if (address.isDefaultBillingAddress) {
    cardHeader = "Adresse de facturation par défaut";
  }

  const confirmDeleteAddress = (addressId: string) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette adresse ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
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
      {/* Icône de suppression */}
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => confirmDeleteAddress(address.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#dc3545" />
      </TouchableOpacity>
      
      {/* En-tête de la carte */}
      {!!cardHeader && <Text style={styles.header}>{cardHeader}</Text>}
      
      {/* Affichage de l'adresse */}
      <AddressDisplay address={address} />
      
      {/* Boutons */}
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
            <Text style={styles.buttonText}>Définir comme adresse de facturation par défaut</Text>
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
            <Text style={styles.buttonText}>Définir comme adresse de livraison par défaut</Text>
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
    fontSize:fonts.body,
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
    fontSize:fonts.body,
  },
});

export default AddressBookCard;
