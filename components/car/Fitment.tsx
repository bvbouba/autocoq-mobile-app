import { StyleSheet } from "react-native"
import { IconButton } from "react-native-paper"
import { useState } from "react";
import {Text, View , PaddedView } from "@/components/Themed"


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
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    listItem: {
      fontSize: 14,
      marginBottom: 4,
    },
    fitmentContainer: {
      padding: 8,
      borderRadius: 8,
    },
    fitmentTitle: {
      fontWeight: "bold",
      marginBottom: 8,
      fontSize: 16,
    },
    fitmentText: {
      fontSize: 12,
      marginBottom: 4,
    },

    fitmentSection: {
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 4,
    },
    listText: {
      fontSize: 14,
    },

 
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });

  export default Fitment