import { View, colors, fonts } from "@/components/Themed";
import {  StyleSheet, Text } from "react-native";
import { usePageQuery } from "@/saleor/api.generated";
import { parseEditorJSData } from "@/utils/parseJsonEditor";


export interface RichTextProps {
    jsonStringData?: string;
  }
  
export function RichText({ jsonStringData }: RichTextProps) {
    const data = parseEditorJSData(jsonStringData);
    if (!data) {
      return null;
    }
  
    // Simplified render for just title and description
    const renderBlock = (block: any, index: number) => {
      switch (block.type) {
        case "header":
          return (
            <Text key={index} style={styles.title}>
              {block.data.text}
            </Text>
          );
        case "paragraph":
          return (
            <Text key={index} style={styles.description}>
              {block.data.text}
            </Text>
          );
        default:
          return null;
      }
    };
  
    return <View style={styles.container}>{data.blocks.map(renderBlock)}</View>;
  }

const BannerSimple = () => {
  const { data, loading, error } = usePageQuery({
    variables: {
      slug: "banner",
    },
  });
  const content = data?.page?.content
  if(loading) return null
  return (
    <>
 
      <View style={styles.container}>
        {content ? <RichText jsonStringData={content} /> : <></>}
    </View>

    </>
  );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"

    },
    title: {
        color: colors.primary,
        fontSize:fonts.body,
        fontWeight: "bold",
    },
    description: {
      fontSize: fonts.caption,
      color:colors.textSecondary,
      textAlign: "center",
    },
  });
  



export default BannerSimple;
