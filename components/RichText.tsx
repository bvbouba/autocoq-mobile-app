import { parseEditorJSData } from "@/utils/parseJsonEditor";
import {  StyleSheet, useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import {fonts, Text, View ,} from "@/components/Themed"

export interface RichTextProps {
  jsonStringData?: string;
  stylesOverride?: {
    paragraph?: object;
    header?: object;
    list?: object;
    listItem?: object;
  };
}

export function RichText({ jsonStringData, stylesOverride = {} }: RichTextProps) {
  const { width } = useWindowDimensions();
  const data = parseEditorJSData(jsonStringData);

  if (!data || !data.blocks) {
    console.error("Invalid or empty JSON data:", jsonStringData);
    return null;
  }

  // Merge default styles with passed styles
  const mergedStyles = {
    paragraph: { ...styles.paragraph, ...stylesOverride.paragraph },
    header: { ...styles.header, ...stylesOverride.header },
    list: { ...styles.list, ...stylesOverride.list },
    listItem: { ...styles.listItem, ...stylesOverride.listItem },
  };

  // Define a function to render blocks based on the type
  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "paragraph":
        if (!block.data?.text) return null; 
        try {
          return (
            <RenderHtml
              key={index}
              contentWidth={width}
              source={{ html: block.data.text || "" }}
              baseStyle={mergedStyles.paragraph}
            />
          );
        } catch (error) {
          console.error("RenderHtml error:", error);
          return null;
        }
      case "header":
        return (
          <Text key={index} style={[mergedStyles.header, { fontSize: block.data.level * 6 }]}>
            {block.data.text}
          </Text>
        );
      case "list":
        return (
          <View key={index} style={mergedStyles.list}>
            {block.data.items.map((item: string, itemIndex: number) => (
              <Text key={itemIndex} style={mergedStyles.listItem}>
                • {item}
              </Text>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{data.blocks.map(renderBlock)}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor:"inherit"
  },
  paragraph: {
    fontSize:fonts.body,
    marginBottom: 8,
    lineHeight: 22,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    fontSize:fonts.body,
    marginBottom: 4,
    marginLeft: 16,
  },
});

export default RichText;
