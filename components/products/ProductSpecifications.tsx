import { View, Text, StyleSheet, FlatList } from "react-native";
import { ProductFragment } from "@/saleor/api.generated";
import { colors, fonts } from "../Themed";

const ProductSpecifications = ({ product }: { product: ProductFragment }) => {
  if (!product?.attributes || product.attributes.length === 0) {
    return <Text style={styles.noSpecs}>Aucune spécification disponible</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spécifications du produit</Text>
      <FlatList
        data={product.attributes}
        keyExtractor={(item) => item.attribute.id}
        renderItem={({ item, index }) => {
          // Get the first available value from the attribute
          const value =
            item.values?.[0]?.plainText ||
            item.values?.[0]?.name ||
            item.values?.[0]?.value ||
            "Non spécifié";

          return (
            <View
              style={[
                styles.specRow,
                { backgroundColor: index % 2 === 0 ? "white" : colors.background },
              ]}
            >
              <Text style={styles.specKey}>{item.attribute.name}:</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal:15,
  },
  specRow: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  specKey: {
    flex: 1,
  },
  specValue: {
    fontWeight: "bold",
    flex: 2,
  },
  noSpecs: {
    textAlign: "center",
    padding: 15,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ProductSpecifications;
