import { Skeleton } from "moti/skeleton";
import { View, StyleSheet } from "react-native";
import { Divider, PaddedView } from "../Themed";

const  OrderDetailsSkeleton=()=>{
    return (
        <>
         <Divider />
         <PaddedView>
                <View>
                    <View style={styles.statusWrapper}>
                    <Skeleton colorMode="light" width="80%" height={20} radius={4} />
                    </View>
                    <View style={styles.statusWrapper}>
                    <Skeleton colorMode="light" width="80%" height={20} radius={4} />                  
                      </View>
                    <View style={styles.statusWrapper}>
                    <Skeleton colorMode="light" width="80%" height={20} radius={4} /> 
                    </View>
                    <View style={styles.statusWrapper}>
                    <Skeleton colorMode="light" width="80%" height={20} radius={4} /> 
                    </View>
               
                </View>

            </PaddedView>

            <Divider />


            <PaddedView>
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginBottom:10
            }}>
            <Skeleton colorMode="light" width="50%" height={20} radius={4} /> 
            <Skeleton colorMode="light" width="50%" height={20} radius={4} /> 
            </View>
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginBottom:10
            }}>
            <Skeleton colorMode="light" width="50%" height={20} radius={4} /> 
            <Skeleton colorMode="light" width="50%" height={20} radius={4} /> 
            </View>
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                marginBottom:10
            }}>
            <Skeleton colorMode="light" width="50%" height={20} radius={4} /> 
            <Skeleton colorMode="light" width="50%" height={20} radius={4} /> 
            </View>

            </PaddedView>

            <Divider />
            <PaddedView>
            <Skeleton colorMode="light" width="100%" height={100} radius={4} /> 
            </PaddedView>
            

                    <Divider />
            <PaddedView>
            <Skeleton colorMode="light" width="100%" height={100} radius={4} /> 
            </PaddedView>
                </>
    
    );
};

const styles = StyleSheet.create({
    scroll: {
        width: "100%",
        marginTop: 12
    },
    checkoutButton: {
        width: "100%",
    },

    statusWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 4,
    },

    addressWrapper:{
        padding:15
    }
});

export default OrderDetailsSkeleton