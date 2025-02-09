import { ProductFragment, useCompatibilityCheckQuery } from "@/saleor/api.generated"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useState } from "react"
import {  StyleSheet, TouchableOpacity } from "react-native"
import {Text, View , colors, fonts } from "@/components/Themed"

import { Button } from "react-native-paper"
import CarFilterModal from "./Modal"
import { useCarFilter } from "@/context/useCarFilterContext"
import { useRouter } from "expo-router"




interface props {
  product: ProductFragment;
}

const CompatibilityCheck = ({ product }: props) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { selectedCar,setIsFiltered } = useCarFilter()
  const categorySlug = product.category?.slug || ""
  const router = useRouter()
  const params = new URLSearchParams();

  const { data,loading } = useCompatibilityCheckQuery({
    variables: {
      productId: product.id,
      car: {
        make: selectedCar?.make?.id,
        model: selectedCar?.model?.id,
        engine: selectedCar?.engine?.id,
        year: selectedCar?.year?.id
      }
    }
  })

  if(loading) return 
  const isCompatible = data?.checkProductCompatibility;
  
  return (
    <>
      <View style={{ alignItems: "center" }}>
        <View
          style={[
            styles.vehicleContainer,
            isCompatible && styles.compatible,
            !isCompatible && selectedCar?.name && styles.noCompatible,
          ]}
        >
          <View
            style={[
              styles.vehicleCheck,
              isCompatible && styles.compatibleVehicleCheck,
              !isCompatible && selectedCar?.name && styles.noCompatibleVehicleCheck,
            ]}
          >
            <View style={{
              flexDirection: "row"
            }}>
              <FontAwesome name="car" size={20} color={colors.secondary} />
              <Text style={styles.vehicleText}>
                {selectedCar?.name
                  ? isCompatible
                    ? <><Text style={{
                      fontWeight: "bold"
                    }}>Compatible avec votre </Text>{selectedCar?.name}</>
                    : <>
                      <Text style={{
                        fontWeight: "bold"
                      }}> Non compatible </Text>avec votre véhicule {selectedCar?.name} </>
                  : "Vérifiez si votre véhicule est compatible"}
              </Text>
            </View>
            <View style={{
              flexDirection:"row",
              alignItems:"center"
            }}>
              {selectedCar?.name &&
              <>
                <TouchableOpacity onPress={() => setFilterOpen(true)}>
                  <Text style={[styles.vehicleText, {
                    textDecorationLine: "underline"
                  }]}>
                    {`Changer de véhicule`}
                  </Text>
                </TouchableOpacity>
                
                {!isCompatible &&
                  <Button style={[styles.vehicleButton,
                    {
                      marginLeft:10
                    }

                  ]} onPress={() => {
                    params.append("categories", categorySlug)
                    setIsFiltered(true)
                    router.push("/products/results?" + params.toString())
                  }}>
                    <Text style={styles.vehicleButtonText}>
                      {"Voir les pièces adaptées"}
                    </Text>
                  </Button>}
                </>
                }

            </View>
          </View>

          {!selectedCar?.name &&
            <Button style={styles.vehicleButton} onPress={() => setFilterOpen(true)}>
              <Text style={styles.vehicleButtonText}>
                {"Sélectionner un véhicule"}
              </Text>
            </Button>}
        </View>
      </View>

    </>
  );
};

const styles = StyleSheet.create({

  vehicleContainer: {
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.warningBg,
    margin: 5,
    width: "95%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  vehicleCheck: {
    flexDirection: "column",
    backgroundColor: colors.warningBg,
    alignItems: "center",
    width: "50%",
  },
  vehicleText: {
    fontSize:fonts.caption,
    marginLeft: 5
  },
  vehicleButton: {
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: "black",
  },
  vehicleButtonText: {
    fontSize: 10
  },
  compatible: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  compatibleVehicleCheck: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
    width: "100%"
  },
  noCompatible: {
    backgroundColor: "#ffefea",
    borderColor: "red",
  },
  noCompatibleVehicleCheck: {
    backgroundColor: "#ffefea",
    width: "100%",
    padding: 2
  }
});

export default CompatibilityCheck