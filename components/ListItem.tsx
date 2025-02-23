import { FC } from "react";
import { colors, fonts, Text, View } from "./Themed";
import { StyleSheet, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import IconComponent from "./icon/IconComponent";

interface Props {
  name: string;
  onPress: () => void;
  slug?: string;
  icon?: string;
}

const ListItem: FC<Props> = ({ name, onPress,icon }) => {

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <View style={styles.titleWrapper}>
            <View style={{
                flexDirection:"row",
                alignItems:"center",
            }}>
            {icon && <IconComponent name={icon} size={24} />}
            <Text style={styles.title}>{name}</Text>
            </View>
          <IconButton icon="chevron-right" onPress={onPress} style={styles.icon} />
        </View>
      </View>
    </Pressable>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
  },
  title: {
    fontSize: fonts.body,
    marginLeft: 8,
    color:colors.textPrimary
  },
  icon: {
    marginTop: 0,
    marginRight: 5,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: "contain",
    borderWidth:1
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
  },
});
