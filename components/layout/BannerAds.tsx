import { View, Text } from "@/components/Themed";
import { StyleSheet, Image } from "react-native";
import { useCollectionBySlugQuery } from "@/saleor/api.generated";
import RichText from "../RichText";

export interface Props {
  slug: string;
}

const BannerAds = ({ slug }: Props) => {
  const { data, loading } = useCollectionBySlugQuery({
    variables: { slug },
  });

  const collection = data?.collection;
  const imageUrl = collection?.backgroundImage?.url;
  const imageAlt = collection?.backgroundImage?.alt || "Banner image";
  const description = collection?.description || "";

  if (loading) return null;
  if (!collection) return null;

  return (
    <View style={styles.container}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} 
        style={styles.image} 
        alt={imageAlt} 
        resizeMode="contain"
        />
      )}
      {description ? <RichText jsonStringData={description} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
});

export default BannerAds;
