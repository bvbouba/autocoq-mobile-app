import Loading from '@/components/Loading';
import RichText from '@/components/RichText';
import { usePageQuery } from '@/saleor/api.generated';
import { StyleSheet, ScrollView } from 'react-native';
import {fonts, Text, View  } from "@/components/Themed"

export default function TermsScreen() {
  const { data, loading, error } = usePageQuery({
    variables: {
      slug: "terms",
    },
  });

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erreur : {error.message}</Text>
      </View>
    );
  }

  const content = data?.page?.content;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {content ? <RichText jsonStringData={content} /> : <Text>Aucun contenu disponible.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize:fonts.h1,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
    backgroundColor: "#007bff",
    color: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 8,
    fontSize:fonts.h2,
    color: "#555",
  },
  error: {
    color: "red",
    fontSize:fonts.h2,
    textAlign: "center",
  },
});
