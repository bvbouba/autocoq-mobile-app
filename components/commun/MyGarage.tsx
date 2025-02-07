import { colors, View, Text, fonts } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";



const MyGarage = () =>(
    <View style={{
        flexDirection:"row",
        alignItems:"flex-start",
        flex:1,
        width:"100%",
        marginBottom:10

      }}>
        <View><FontAwesome name="car" size={12} color={colors.secondary} style={{
          padding:3,
          backgroundColor:colors.background,
          borderRadius:20,
          marginRight:5
        }}/></View>
        <View><Text
        style={{
          fontSize:fonts.body,
          fontWeight:"bold"

        }}
        >Mon Garage</Text></View>
      </View>
)

export default MyGarage