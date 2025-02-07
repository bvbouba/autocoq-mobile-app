import { View, Text, colors, PaddedView, Divider } from "../Themed";
import { StyleSheet, Pressable } from "react-native";
import {  useCategoryBySlugQuery } from "@/saleor/api.generated";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";

import { useEffect, useState } from "react";
import Loading from "../Loading";
import { mapEdgesToItems } from "@/utils/map";
import ListItem from "../ListItem";


const CategoryList = () => {
    const {slug } = useLocalSearchParams();
    const {data,loading} = useCategoryBySlugQuery({
        variables:{
            slug:slug ? String(slug) : "pieces-auto"
        }
    })

    if (loading) {
        return (
          <Loading />
        );
      }

  if (!data?.category) return null;
  
  const childrens = mapEdgesToItems(data.category.children)

  return (
    <>
    <View style={styles.container}>
        <PaddedView>
            <Text style={styles.categoryListTitle}>{`Shop By Category`}</Text>
        </PaddedView>
        <PaddedView style={{
          flexDirection:"column"
        }}>
          {
             childrens.map(children=>(
              <View style={{

              }} key={children.id}>
                <ListItem name={children.name} url={`/shop/?slug=${children.slug}`}/>
                <Divider />
              </View>
             ))
          }
        </PaddedView>
      

    </View>
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
},

categoryListTitle: {
    fontSize: 16,
    lineHeight: 34,
    fontWeight: 'bold',
    textAlign: 'left',
},


  
});

export default CategoryList;
