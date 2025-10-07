import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View, colors, fonts } from "@/components/Themed";
import { useGetCompanyInfoQuery } from "@/saleor/api.generated";

export default function SupportContactInfo() {

  const {data,loading} = useGetCompanyInfoQuery()
  const companyAddress = data?.shop.companyAddress
    

  if(loading) return <></>

  const handleCall = () => {
    Linking.openURL(`tel:${companyAddress?.phone}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toujours besoin d’aide ?</Text>
      <Text style={styles.subtitle}>
        Vous pouvez aussi nous contacter par téléphone ou nous rendre visite.
      </Text>

      {/* 📞 Call Section */}
      <TouchableOpacity style={styles.callContainer} onPress={handleCall}>
        <FontAwesome name="phone" size={22} color={colors.primary} />
        <View style={styles.callTextContainer}>
          <Text style={styles.callLabel}>Appelez-nous :</Text>
          <Text style={styles.callNumber}>{companyAddress?.phone}</Text>
          <Text style={styles.callHours}>Lun - Ven : 8h à 18h (UTC)</Text>
        </View>
      </TouchableOpacity>

      {/* 📍 Address Section */}
      <View style={styles.addressContainer}>
        <FontAwesome name="map-marker" size={22} color={colors.primary} />
        <View style={styles.addressTextContainer}>
          <Text style={styles.addressLabel}>Adresse :</Text>
          <Text style={styles.addressText}>
            {`${companyAddress?.companyName}, ${companyAddress?.streetAddress1}, ${companyAddress?.city}, ${companyAddress?.country.country}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom:0
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: 20,
    fontSize: fonts.body,
  },
  callContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  callTextContainer: {
    marginLeft: 12,
    backgroundColor: colors.background,
  },
  callLabel: {
    fontSize: fonts.h3,
    color: colors.textPrimary,
  },
  callNumber: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    color: colors.primary,
  },
  callHours: {
    fontSize: fonts.h3,
    color: colors.textPrimary,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressTextContainer: {
    marginLeft: 12,
    flex: 1,
    backgroundColor: colors.background,
  },
  addressLabel: {
    fontSize: fonts.h3,
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: fonts.body,
    color: colors.textPrimary,
    flexWrap: "wrap",
  },
});
