import { View, Text, PaddedView, Divider, fonts } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useCategoryBySlugQuery } from "@/saleor/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";

import Loading from "../Loading";
import { mapEdgesToItems } from "@/utils/map";
import ListItem from "../ListItem";
import { useLoading } from "@/context/Loading";
import { useEffect } from "react";
import { usePath } from "@/context/path";


const CategoryList = () => {
   const {setIsLoading} = useLoading()
   const {setPathSlug} = usePath()
   const router = useRouter();

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

    setPathSlug(category.parent?.slug || "")
     
    const childrens = mapEdgesToItems(category.children);

    const categoryName = (childrens) ? category.name: "Voir par catégorie"

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
                            const onPress = () => {                            
                                if (child.length > 0) {
                                    router.push(`/shop?slug=${children.slug}` )
                                }else{
                                    router.push(`/categories/${children.slug}`)
                                }
                            } 
                            return (
                                <View key={children.id}>
                                    <ListItem 
                                        name={children.name} 
                                        onPress={onPress} 
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
