import { parseEditorJSData } from "@/utils/parseJsonEditor";
import { View, Text, StyleSheet } from "react-native";

export interface RichTextProps {
  jsonStringData?: string;
}

export function RichText({ jsonStringData }: RichTextProps) {
  const data = parseEditorJSData(jsonStringData);

  if (!data) {
    return null;
  }

  // Define a function to render blocks based on the type
  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <Text key={index} style={styles.paragraph}>
            {block.data.text}
          </Text>
        );
      case "header":
        return (
          <Text key={index} style={[styles.header, { fontSize: block.data.level * 6 }]}>
            {block.data.text}
          </Text>
        );
      case "list":
        return (
          <View key={index} style={styles.list}>
            {block.data.items.map((item: string, itemIndex: number) => (
              <Text key={itemIndex} style={styles.listItem}>
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
    padding: 16,
  },
  paragraph: {
    fontSize: 14,
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
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 16,
  },
});

export default RichText;
