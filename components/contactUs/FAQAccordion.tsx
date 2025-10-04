import { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors, fonts, Text, View } from "@/components/Themed";
import { FAQPair } from "@/lib/types";
import { IconButton } from "react-native-paper";

interface Props {
    faqPairs: FAQPair[];
}

export function FAQAccordion({ faqPairs }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter FAQs by search term
    const filteredFaqs = faqPairs.filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Highlight search term in questions
    const highlightText = (text: string, highlight: string) => {
        if (!highlight) return <Text>{text}</Text>;

        const regex = new RegExp(`(${highlight})`, "gi");
        const parts = text.split(regex);

        return (
            <Text>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <Text key={i} style={styles.highlight}>
                            {part}
                        </Text>
                    ) : (
                        <Text key={i}>{part}</Text>
                    )
                )}
            </Text>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>FAQ</Text>

            {/* 🔍 Search bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            {/* FAQ List */}
            <View style={styles.list}>
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <View key={index} style={styles.card}>
                            <TouchableOpacity
                                onPress={() => setOpenIndex(openIndex === index ? null : index)}
                                style={styles.questionButton}
                            >
                                <View style={styles.row}>
                                    <Text style={styles.question} numberOfLines={0}>
                                        {highlightText(faq.question, searchTerm)}
                                    </Text>
                                    <IconButton
                                        icon={openIndex === index ? "chevron-up" : "chevron-down"}
                                        iconColor={colors.primary}
                                        style={styles.iconButton}
                                    />
                                </View>
                            </TouchableOpacity>

                            {openIndex === index && (
                                <View style={styles.answerContainer}>
                                    {faq.answer.map((item, i) => (
                                        <Text key={i} style={styles.answer}>
                                            • {item}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noResults}>Aucun résultat trouvé.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    searchInput: {
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    list: {
        marginTop: 8,
    },
    card: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: 12,
        overflow: "hidden",
    },
    questionButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.background,
    },
    toggle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    answerContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    answer: {
        fontSize: fonts.body,
        color: "#555",
        marginBottom: 5,
    },
    highlight: {
        backgroundColor: "yellow",
    },
    noResults: {
        textAlign: "center",
        fontStyle: "italic",
        color: "#888",
        marginTop: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:colors.background
      },
      question: {
        flex: 1,            
        fontSize: fonts.body,
        fontWeight: "500",
        flexWrap: "wrap",    // allow text wrapping
        marginRight: 8,      // spacing before icon
      },
      iconButton: {
        margin: 0,           // remove extra space around icon
        alignSelf: "center", // ensure vertical alignment
      },
});
