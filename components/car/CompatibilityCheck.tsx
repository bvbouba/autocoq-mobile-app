import { ProductFragment, useCompatibilityCheckQuery } from "@/saleor/api.generated"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useState } from "react"
import {  StyleSheet, TouchableOpacity } from "react-native"
import {PaddedView, Text, View , colors, fonts } from "@/components/Themed"

import { Button } from "react-native-paper"
import CarFilterModal from "./Modal"
import { useCarFilter } from "@/context/useCarFilterContext"
import { useRouter } from "expo-router"
import { useModal } from "@/context/useModal"
import { WhiteButton } from "../button"
import Loading from "../Loading"




interface props {
  product: ProductFragment;
}

const CompatibilityCheck = ({ product }: props) => {
  const {openModal} = useModal()
  const { selectedCar } = useCarFilter()
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

  if (loading) {
    return (
      <Loading />
    );
  }

  const isCompatible = data?.checkProductCompatibility;
  
  return (
    <>
      <View style={{ alignItems: "center" }}>
        <PaddedView
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
              flexDirection: "row",
              backgroundColor:"inherent" 
            }}>
              <View style={{ position: "relative", backgroundColor:"inherent" }}>
              <FontAwesome name="car" size={20} color={colors.secondary} style={{
              }} />
               
               <FontAwesome
                    name={(selectedCar?.name) ? isCompatible ? "check" : "warning" : "exclamation-circle"}
                    size={13}
                    color={(selectedCar?.name) ? isCompatible ? colors.success : colors.error : colors.warning}
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: -5,
                    }}
                  />

              </View>
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
              alignItems:"center",
              backgroundColor:"inherent"
            }}>
              {selectedCar?.name &&
              <>
                <TouchableOpacity onPress={() => openModal("carFilter",<CarFilterModal/>)}>
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
                    router.push(`/products/results?"${params.toString()}`)
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
            <WhiteButton 
            title={"Sélectionner un véhicule"}
            onPress={() => openModal("carFilter",<CarFilterModal/>)}
            />
            }
        </PaddedView>
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
    marginLeft: 5,
  },
  vehicleButton: {
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: colors.secondary,
  },
  vehicleButtonText: {
    fontSize: fonts.sm
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