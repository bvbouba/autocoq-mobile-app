import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { fonts, PaddedView, Text, View, colors } from "@/components/Themed";
import { usePageQuery } from "@/saleor/api.generated";
import { FAQData, FAQPair } from "@/lib/types";
import { FAQAccordion } from "./FAQAccordion";
import PartRequestForm from "./form";
import SupportContactInfo from "./SupportContactInfo";
import { useLoading } from "@/context/LoadingContext";
import * as WebBrowser from "expo-web-browser";
import { getConfig } from "@/config";

export default function Support() {
  const { setLoading } = useLoading();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { data, loading } = usePageQuery({
    variables: {
      slug: "faq",
    },
  });

  const content = data?.page?.content;

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  let faqPairs: FAQPair[] = [];
  try {
    if (content?.trim()) {
      const faqData = JSON.parse(content) as FAQData;

      for (let i = 0; i < faqData.blocks.length; i++) {
        const block = faqData.blocks[i];
        if (block.type === "header") {
          const next = faqData.blocks[i + 1];
          if (next && next.type === "list") {
            faqPairs.push({
              question: block.data.text,
              answer: next.data.items,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn("Erreur de parsing FAQ JSON:", err);
  }

  const handleOpenLink = (slug: string) => {
    const url = `https://www.autocoq.com/${getConfig().channel}/pages/${slug}`;
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <PaddedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Titre */}
        <Text style={styles.header}>Contactez-nous</Text>
        <Text style={styles.subText}>
          Nous sommes là pour vous aider. Vous pouvez rechercher ci-dessous une réponse à vos questions,
          ou bien nous contacter en bas de l’écran.
        </Text>

        {/* FAQ */}
        <FAQAccordion faqPairs={faqPairs} />

        {/* Formulaire de contact */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Envoyez-nous un message</Text>
          <PartRequestForm title="" />
        </View>

        {/* Coordonnées */}
        <SupportContactInfo />

        {/* 🔒 Privacy and Safety Section */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>
            AutoCoq respecte votre vie privée, votre sécurité et vos préoccupations.
          </Text>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => handleOpenLink("privacy-policy")}>
              <Text style={styles.link}>Politique de confidentialité</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => handleOpenLink("terms")}>
              <Text style={styles.link}>Conditions générales</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => handleOpenLink("faq")}>
              <Text style={styles.link}>FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom:150
  },
  scrollContent: {
    padding: 0,
  },
  header: {
    fontSize: fonts.h1,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: fonts.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 20,
  },
  formContainer: {
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  formTitle: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginBottom: 15,
  },
  privacyContainer: {
    marginTop: 40,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  privacyText: {
    color: colors.textSecondary,
    fontSize: fonts.body,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  linkContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    paddingHorizontal:10
  },
  link: {
    color: colors.textPrimary,
    marginVertical: 6,
    fontSize: fonts.body,
    textDecorationLine:"underline"
  },
  separator: {
    color: "#aaa",
    fontSize: fonts.body,
  },
});
