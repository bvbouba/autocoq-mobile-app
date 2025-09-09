import { View, Text, ActivityIndicator, StyleSheet, useWindowDimensions } from "react-native";
import { ProductCollectionQueryVariables, useProductCollectionQuery } from "@/saleor/api.generated";
import { useCarFilter } from "@/context/useCarFilterContext";
import { mapEdgesToItems } from "@/utils/map";
import { fonts } from "../Themed";
import ProductCard from "./ProductCard";
import Carousel from "react-native-reanimated-carousel";
import { useState } from "react";
import { getConfig } from "@/config";

const diviserTableau = (tableau: any[], taille: number) => {
  return Array.from({ length: Math.ceil(tableau.length / taille) }, (_, index) =>
    tableau.slice(index * taille, index * taille + taille)
  );
};

const ProduitsRecommandés = ({ categoryID, perPage }: { perPage?: number; categoryID: string }) => {
  const { selectedCar } = useCarFilter();
  const [, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions(); // Récupère la largeur de l'écran

  const largeurArticle = width / 2 - 15; // Chaque produit occupe la moitié de l'écran moins la marge

  const variables: ProductCollectionQueryVariables = {
    filter: {
      categories: [categoryID],
      ...(selectedCar && {
        ...(selectedCar.year && { carYear: [selectedCar.year.id] }),
        ...(selectedCar.make && { carMake: [selectedCar.make.id] }),
        ...(selectedCar.model && { carModel: [selectedCar.model.id] }),
        ...(selectedCar.engine && { carEngine: [selectedCar.engine.id] }),
        ...(selectedCar.variant && { carVariant: [selectedCar.variant.id] }),
      }),
    },
    first: perPage,
    channel: getConfig().channel,
  };

  const { loading, error, data } = useProductCollectionQuery({ variables });

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Erreur : {error.message}</Text>;
  if (!data?.products?.edges.length) return <Text>Aucun produit recommandé.</Text>;

  const produits = mapEdgesToItems(data.products);
  const pairesProduits = diviserTableau(produits, 2); // Regroupe les produits par paires de 2

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommandé pour vous</Text>

      <Carousel
        style={{ width: "100%", height: 300 }} // Définit une hauteur appropriée
        autoPlay={false}
        loop={false}
        width={width} // Pleine largeur de l'écran
        height={300} // Hauteur fixe
        snapEnabled
        onSnapToItem={(index) => setCurrentIndex(index)}
        data={pairesProduits} // Affiche les paires au lieu d'éléments uniques
        defaultIndex={0}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            {item.map((produit: any) => (
              <View key={produit.id} style={{ width: largeurArticle, marginHorizontal: 5 }}>
                <ProductCard product={produit} />
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, width: "100%" },
  title: { fontSize: fonts.h2, fontWeight: "bold", marginBottom: 10 },
  slideContainer: {
    flexDirection: "row", // Aligne deux produits dans un seul slide
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ProduitsRecommandés;
