import { StyleSheet } from "react-native"
import { IconButton } from "react-native-paper"
import { useState } from "react";
import {Text, View , PaddedView, fonts } from "@/components/Themed"


interface car {
    carMakeName?: string | null;
    carModelName?: string | null;
    carEngineName?: string | null;
    carStartYear?: string | null;
    carEndYear?: string | null;
}

interface props {
    isUniversal?:boolean,
    fitmentData: (car|null)[]
}
const Fitment = ({isUniversal,fitmentData}:props) => {
    const [isExpanded, setExpanded] = useState(false);


    return(
        <>
         <PaddedView style={styles.fitmentContainer}>
             <View style={styles.sectionHeader}>
                        <Text
                          style={styles.descriptionTitle}
                          onPress={() => setExpanded(!isExpanded)}
                        >
                          Compatibilités
                        </Text>
                        <IconButton
                          icon={isExpanded ? "chevron-up" : "chevron-down"}
                          onPress={() => setExpanded(!isExpanded)}
                        />
          </View>
          {isExpanded && <>
            {isUniversal ? (
              <Text style={styles.fitmentText}>
                Ce produit est universel et s'adapte à tous les véhicules.
              </Text>
            ) : (
              <>
                {
                  fitmentData.map((fitment, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.listText}>
                        {[
                          fitment?.carMakeName || '',
                          fitment?.carModelName || '',
                          fitment?.carEngineName || '',
                          fitment?.carStartYear || '',
                          fitment?.carEndYear || '',
                        ]
                          .filter(Boolean) // Remove empty values
                          .join(' ')} {/* Join non-empty values with space */}
                      </Text>
                    </View>
                  ))}
              </>
            )}
            </>}
          </PaddedView>
        
        </>
    )
}

const styles = StyleSheet.create({
    descriptionTitle: {
      fontSize:fonts.h2,
      fontWeight: "bold",
      marginBottom: 8,
    },
    listItem: {
      fontSize:fonts.body,
      marginBottom: 4,
    },
    fitmentContainer: {
      padding: 8,
      borderRadius: 8,
    },
    fitmentTitle: {
      fontWeight: "bold",
      marginBottom: 8,
      fontSize:fonts.h2,
    },
    fitmentText: {
      fontSize:fonts.caption,
      marginBottom: 4,
    },

    fitmentSection: {
      marginBottom: 16,
    },
    subtitle: {
      fontSize:fonts.h2,
      marginBottom: 4,
    },
    listText: {
      fontSize:fonts.body,
    },

 
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });

  export default Fitment