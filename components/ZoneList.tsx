import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { colors, fonts } from "./Themed";
import { useModal } from "@/context/useModal";
import { useGetCitiesQuery } from "@/saleor/api.generated";
import { useCheckout } from "@/context/CheckoutProvider";
import { setZoneName } from "@/context/zone";


export const ZoneList = () => {
    const { delivery, setDelivery } = useCheckout();
    const { data, loading } = useGetCitiesQuery();
    const {  closeModal } = useModal();
    
     // Function to handle zone selection
  const handleSelectZone = (zone: string) => {
    setZoneName(zone)
    setDelivery({
      ...delivery,
      zone
    });
    closeModal("shipping")
  };

  const renderItem = ({ item }: { item: { name: string } }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() => handleSelectZone(item.name)}
    >
      <Text style={styles.zoneText}>{item.name}</Text>
    </TouchableOpacity>
  );

   return(<>
     <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner votre ville</Text>
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
    </>)
}


const styles = StyleSheet.create({

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