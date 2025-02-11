import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors, fonts } from "./Themed";
import { useCartContext } from "@/context/useCartContext";
import { useModal } from "@/context/useModal";
import { useGetCitiesQuery } from "@/saleor/api.generated";

const ZoneSelector: React.FC = () => {
  const { delivery, setDelivery } = useCartContext();
  const { openModal, closeModal } = useModal();
  const { data, loading } = useGetCitiesQuery();

  // Function to handle zone selection
  const handleSelectZone = (zone: string) => {
    setDelivery({
      ...delivery,
      zone
    });
    closeModal()
  };

  const renderItem = ({ item }: { item: { name: string } }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() => handleSelectZone(item.name)}
    >
      <Text style={styles.zoneText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        openModal(
          "shipping",
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez votre zone</Text>
            {loading ? (
              <Text style={styles.loadingText}>Chargement...</Text>
            ) : (
              <FlatList
                data={data?.getShippingZones?.filter((zone) => zone !== null) as { name: string }[]}
                keyExtractor={(item, idx) => `${item.name}-${idx}`}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                nestedScrollEnabled={true} 
                keyboardShouldPersistTaps="handled" 
              />

            )}
          </View>
        )
      }
    >
      <FontAwesome name="map-marker" size={24} color={colors.warning} />
      <Text style={styles.text}>
        {delivery.method?.name
          ? `Zone sélectionnée: ${delivery.method.name}`
          : "Choisissez votre zone pour voir les options de livraison"}
      </Text>
    </TouchableOpacity>
  );
};

export default ZoneSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: fonts.caption,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: fonts.body,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 10,
  },
  zoneItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  zoneText: {
    fontSize: fonts.body,
    color: colors.textPrimary,
  },
  loadingText: {
    textAlign: "center",
    fontSize: fonts.body,
    color: colors.textSecondary,
  },
});
