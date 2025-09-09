import { View, Text, fonts, colors } from "@/components/Themed";
import { StyleSheet, useWindowDimensions, Pressable, Image } from "react-native";
import { useGetMenuQuery } from "@/saleor/api.generated";
import { getConfig } from "@/config";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useState } from "react";
import { Skeleton } from "moti/skeleton";

const HomepageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();
  const router = useRouter();

  // Fetch menu items
  const { data, loading,previousData } = useGetMenuQuery({
    variables: { channel: getConfig().channel, slug: "carousel" },
    fetchPolicy: "cache-first",
  });

  if (loading) return <Skeleton colorMode="light" height={250} width="100%"  />
  if (!data?.menu?.items) return null;
   
  const items = data.menu.items || previousData?.menu?.items
 
  const carouselItems = items.map(menu => ({
    slug: menu.collection?.slug,
    name: menu.name,
    id: menu.id,
    image: menu.collection?.backgroundImage?.url || "",
  }));

  return (
    <>
      <View style={styles.container}>
        <Carousel
          autoPlay
          autoPlayInterval={6000}
          loop
          width={width}
          height={250} // Updated height
          snapEnabled
          onSnapToItem={(index) => setCurrentIndex(index)}
          data={carouselItems}
          defaultIndex={0}
          renderItem={({ index, item }) =>
            item.image ? (
              <Pressable onPress={() => router.push(`/collections/${item.slug}`)}>
                <View style={styles.slide} key={index}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="stretch"
                  />
                </View>
              </Pressable>
            ) : (
              <View style={styles.slide} key={index}>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            )
          }
        />
      </View>

      {/* Dots for navigation */}
      <View style={styles.dotsContainer}>
        {carouselItems.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentIndex === index ? "gray" : "white" },
            ]}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 250, // Updated height
    alignItems: "center",
  },
  slide: {
    width: "100%",
    height: 250, // Updated height
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 250, // Updated height
    borderRadius: 0,
  },
  text: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: fonts.h2,
    color: "white",
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: colors.background,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default HomepageCarousel;
