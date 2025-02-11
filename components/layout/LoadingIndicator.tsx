import { ProgressBar } from "react-native-paper"
import { colors, View } from "@/components/Themed";
import { FC } from "react";
import { useLoading } from "@/context/Loading";

interface Props {
    style?: any
}

const LoadingIndicator: FC<Props> = ({ style }) => {
    const { isLoading } = useLoading();
    


    if (!isLoading) {
        return <></>
    }

    return <View style={{ backgroundColor: "white" }}>
        <ProgressBar color={colors.primary} indeterminate style={{ ...(style || {}), }} />
    </View>
}

export default LoadingIndicator