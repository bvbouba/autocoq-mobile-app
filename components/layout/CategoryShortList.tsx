import { View, Text, colors, PaddedView, fonts } from "@/components/Themed";
import { StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { useGetMainMenuQuery } from "@/saleor/api.generated";
import { getConfig } from "@/config";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { useState } from "react";
import { Skeleton } from "moti/skeleton";
import { Button } from "react-native-paper";


const CategoryShortList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { data: categoriesData, error: catError, loading } = useGetMainMenuQuery({
    variables: { channel: getConfig().channel },
  });

  if (loading) return <View style={styles.skeletonContainer}>
    {[...Array(5)].map((_, index) => (
      <View key={index} style={styles.skeletonButton}>
        <Skeleton colorMode="light" height={30} width={width * 7 / 20} radius={2} />
      </View>
    ))}
  </View>;

  if (!categoriesData?.menu?.items) return null;

  return (
    <>
      <View style={styles.container}>
        <PaddedView>
          <Text style={styles.categoryListTitle}>{`Les plus populaires`}</Text>
        </PaddedView>
        <Carousel
          style={{ width: "100%" }}
          autoPlay={false}
          vertical={false}
          loop={false}
          width={width * 7 / 20}
          snapEnabled
          onSnapToItem={(index) => setCurrentIndex(index)}
          data={categoriesData.menu?.items.map(menu => {
            return {
              slug: menu.category?.slug,
              name: menu.name,
              id: menu.category?.id,
            };
          }) || []}
          defaultIndex={0}
          renderItem={({ index, item }) =>
            item ? (
              <Button
                onPress={() => router.push(`/categories/${item.id}`)}
                style={[
                  styles.button,
                ]}
              >
                  <Text style={[styles.buttonText]}>
                    {item.name}
                  </Text>
              </Button>
            ) : <View></View>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
  },

  categoryListTitle: {
    fontSize: fonts.h2,
    lineHeight: 34,
    fontWeight: 'bold',
    textAlign: 'left',
    color: colors.textPrimary
  },

  button: {
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    height: 40,
    borderColor: colors.textPrimary,
  },
  buttonHovered: {
    borderColor: "gray",
  },
  buttonText: {
    padding: 0,
    fontSize: fonts.body,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  buttonTextHovered: {
    color: "gray",
  },
  skeletonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  skeletonButton: {
    margin: 5,
    borderRadius: 5,
  },
});

export default CategoryShortList;
