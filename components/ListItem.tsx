import { FC } from "react"
import { PaddedView, Text, View } from "./Themed"
import { StyleSheet, Pressable } from "react-native"
import { IconButton } from "react-native-paper"
import { useRouter } from "expo-router"
import { usePath } from "@/context/backUrl"

interface Props {
    name: string,
    url:string
    slug?:string
}

const ListItem: FC<Props> = ({ name,url,slug="" }) => {
     const {addPath} = usePath()
    const router = useRouter();
    const onPress = () => {
        if(slug){
        addPath(slug)
         }
        router.push(url)
    }

    return <Pressable onPress={onPress}>
        <View style={styles.wrapper}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>{name}</Text>
                <IconButton icon="chevron-right" onPress={onPress} style={styles.icon} />
            </View>
        </View>
    </Pressable>
}

export default ListItem

const styles = StyleSheet.create({
    wrapper: {
        // border: "0.5 solid " + colors.dividerGrey,
        borderRadius: 5,
    },
    title: {
        fontSize: 14,
        marginTop: 10,
        marginLeft: 8,
    },
    icon: {
        marginTop: 0,
        marginRight: 5,
    },
    titleWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
    },
})