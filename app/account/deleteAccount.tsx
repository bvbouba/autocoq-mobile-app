import { StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { colors, fonts, PaddedView, Text, View } from "@/components/Themed";
import { getConfig } from '@/config';
import * as WebBrowser from "expo-web-browser";

export default function DeleteAccountScreen() {
  const handleDeleteRedirect = () => {
    Alert.alert(
      "Supprimer mon compte",
      "Vous allez être redirigé vers le site web pour supprimer votre compte. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Continuer",
          onPress: () => WebBrowser.openBrowserAsync(`https://www.autocoq.com/${getConfig().channel}/accountDeletion`),
        },
      ]
    );
  };

  return (
    <PaddedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: fonts.h2, marginBottom: 12 }}>
            ⚠️ Attention
          </Text>
          <Text style={{ fontSize: fonts.body, marginBottom: 12 }}>
            La suppression de votre compte est définitive et toutes vos données seront perdues.
          </Text>
          <Text style={{ fontSize: fonts.body, marginBottom: 12 }}>
            Si vous êtes sûr de vouloir continuer, cliquez sur le bouton ci-dessous pour accéder à la page web sécurisée de suppression de compte.
          </Text>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRedirect}>
            <Text style={styles.deleteButtonText}>SUPPRIMER MON COMPTE</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: fonts.body }}>
            Si vous changez d'avis, vous pouvez simplement quitter cette page.
          </Text>
        </View>
      </ScrollView>
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollContent: {
    padding: 16,
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: fonts.h2,
  },
});
