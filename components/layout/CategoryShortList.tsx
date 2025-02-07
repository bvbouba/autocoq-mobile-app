import { View, Text, colors, PaddedView } from "../Themed";
import { StyleSheet, useWindowDimensions, Pressable } from "react-native";
import {  useGetHomepageQuery } from "@/saleor/api.generated";
import { getConfig } from "@/config";
import { useRouter } from "expo-router";
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Carousel from "react-native-reanimated-carousel";
import { useState } from "react";


const CategoryShortList = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
    const { width } = useWindowDimensions();
    const router = useRouter();
  const { data: categoriesData, error: catError, loading } = useGetHomepageQuery({
    variables: { channel: getConfig().channel },
  });



  if (loading) return null;
  if (!categoriesData?.menu?.items) return null;

  return (
    <>
    <View style={styles.container}>
        <PaddedView>
            <Text style={styles.categoryListTitle}>{`Most Popular`}</Text>
        </PaddedView>
        <Carousel
            style={{ width: "100%" }}
            autoPlay={false}
            vertical={false}
            loop={false}
            width={width/3}
            snapEnabled
            onSnapToItem={(index) => setCurrentIndex(index)}
            data={categoriesData.menu?.items.map(menu => {
                return {
                    slug: menu.category?.slug,
                    name: menu.name,
                    id: menu.id,
                }
            }) || []}
            defaultIndex={0}
            renderItem={({ index, item }) => 
            
            item ? (
              <Pressable onPress={()=>router.push(`/categories/${item.slug}`)}>
              <View style={styles.button} key={index}>

                <Text 
                style={styles.buttonText}
                >{item.name}</Text>
              </View>
              </Pressable>
            ): <View></View>
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
    fontSize: 16,
    lineHeight: 34,
    fontWeight: 'bold',
    textAlign: 'left',
},

  button:{
    borderWidth:1,
    margin:5,
    borderRadius:5,
  },
  buttonText:{
    color:colors.secondary,
    padding:5
  }
  
});

export default CategoryShortList;
