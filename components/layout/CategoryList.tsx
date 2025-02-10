import { View, Text, PaddedView, Divider, fonts } from "../Themed";
import { StyleSheet } from "react-native";
import { useCategoryBySlugQuery } from "@/saleor/api.generated";
import { useLocalSearchParams } from "expo-router";

import Loading from "../Loading";
import { mapEdgesToItems } from "@/utils/map";
import ListItem from "../ListItem";
import { useLoading } from "@/context/Loading";
import { useEffect } from "react";


const CategoryList = () => {
   const {setIsLoading} = useLoading()
    const { slug } = useLocalSearchParams();
    const { data, loading } = useCategoryBySlugQuery({
        variables: {
            slug: slug ? String(slug) : "pieces-auto"
        }
    });
    
     useEffect(()=>{
      setIsLoading(loading)
     },[loading])
    if (loading) {
        return <Loading />;
    }

    if (!data?.category) return null;
    const category = data.category;
    const childrens = mapEdgesToItems(category.children);

    const categoryName = (category.children) ? category.name: "Voir par catégorie"

    return (
        <>
            <View style={styles.container}>
                <PaddedView>
                    <Text style={styles.categoryListTitle}>{categoryName}</Text>
                </PaddedView>
                <PaddedView style={{ flexDirection: "column" }}>
                    {
                        childrens.map(children => {
                            const child = mapEdgesToItems(children.children);
                            return (
                                <View key={children.id}>
                                    <ListItem 
                                        name={children.name} 
                                        url={(child.length > 0) ? `/shop/?slug=${children.slug}` : `/categories/${children.slug}`} 
                                        slug={category.slug} 
                                    />
                                    <Divider />
                                </View>
                            );
                        })
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
        fontSize: fonts.h2,
        lineHeight: 34,
        fontWeight: 'bold',
        textAlign: 'left',
    },
});

export default CategoryList;
