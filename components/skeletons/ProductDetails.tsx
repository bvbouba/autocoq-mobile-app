import { View, StyleSheet } from 'react-native';
import { colors, Divider, PaddedView } from '@/components/Themed';
import { Skeleton } from 'moti/skeleton';

const ProductDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
        <PaddedView>
          <View style={{ flexDirection: "column", marginBottom: 15, padding: 8 }}>
                <Skeleton colorMode="light" width="80%" height={20} radius={2} />
                <View style={{
                    marginVertical:5
                }}>
                <Skeleton colorMode="light" width="60%" height={10} radius={2} />
                </View>
          </View>
        </PaddedView>

        <PaddedView>
        <Skeleton colorMode="light" width="100%" height={250} radius={2} />
        </PaddedView>
        <PaddedView>
        <Skeleton colorMode="light" width="100%" height={30} radius={2} />
        </PaddedView>

        <Divider style={{ borderBottomWidth: 5 }} />

        <PaddedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
        <Skeleton colorMode="light" width="50%" height={20} radius={2} />
        <Skeleton colorMode="light" width="60%" height={30} radius={2} />
        </PaddedView>
        <Divider style={{ borderBottomWidth: 5 }} />
        
        <PaddedView>
        <Skeleton colorMode="light" width="100%" height={40} radius={2} />
       
        </PaddedView>
        
        <Divider style={{ borderBottomWidth: 5 }} />
        <View style={styles.buttonContainer}>
          <View style={{ marginVertical: 5 }}>
          <Skeleton colorMode="light" width="100%" height={30} radius={2} />
          </View>

          <Skeleton colorMode="light" width="100%" height={40} radius={2} />

        </View>

        <Divider style={{ borderBottomWidth: 5 }} />

        <PaddedView style={styles.descriptionContainer}>
        <Skeleton colorMode="light" width="100%" height={40} radius={2} />
        </PaddedView>

        <Divider style={{ borderBottomWidth: 5 }} />

    </View>
  );
};

const styles = StyleSheet.create({
 
    container: {},

      descriptionContainer: {
        paddingHorizontal: 16,
      },
    
      listBlock: {
        marginBottom: 8,
      },

      scrollContainer: {
        paddingBottom: 16,
      },
      buttonContainer: {
        padding: 5,
        alignItems: "center",
      },
      button: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        alignItems: "center",
        width: "95%",
      },
      buttonText: {
        color: "#fff",
        fontWeight: "400",
      },
      sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
});

export default ProductDetailsSkeleton;
