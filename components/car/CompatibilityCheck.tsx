import { ProductFragment, useCompatibilityCheckQuery } from "@/saleor/api.generated"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useEffect, useState } from "react"
import {  StyleSheet, TouchableOpacity } from "react-native"
import {PaddedView, Text, View , colors, fonts } from "@/components/Themed"

import { Button } from "react-native-paper"
import VehicleSelectionFilter from "./VehicleSelection"
import { carType, useCarFilter } from "@/context/useCarFilterContext"
import { useRouter } from "expo-router"
import { useModal } from "@/context/useModal"
import { WhiteButton } from "../button"
import Loading from "../Loading"
import { Skeleton } from "moti/skeleton"
import AddVehicle from "./VehicleSelection"




interface props {
  product: ProductFragment;
}

const CompatibilityCheck = ({ product }: props) => {
  const {openModal} = useModal()
  const { setSelectedCar, selectedCar } = useCarFilter()
  const categorySlug = product.category?.slug || ""
  const router = useRouter()
  const [selectedLocalCar, setSelectedLocalCar] = useState<carType | undefined>()
  const car = selectedLocalCar || selectedCar

  const { data,loading } = useCompatibilityCheckQuery({
    variables: {
      productId: product.id,
      car: {
        make: car?.make?.id,
        model: car?.model?.id,
        engine: car?.engine?.id,
        year: car?.year?.id
      }
    }
  })

  if (loading) return <Skeleton height={40} width="100%" radius={2} colorMode="light" />

  const isCompatible = data?.checkProductCompatibility;
  
  return (
    <>
      <View style={{ alignItems: "center" }}>
        <PaddedView
          style={[
            styles.vehicleContainer,
            isCompatible && styles.compatible,
            !isCompatible && car?.name && styles.noCompatible,
          ]}
        >
          <View
            style={[
              styles.vehicleCheck,
              isCompatible && styles.compatibleVehicleCheck,
              !isCompatible && car?.name && styles.noCompatibleVehicleCheck,
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
                    name={(car?.name) ? isCompatible ? "check" : "warning" : "exclamation-circle"}
                    size={13}
                    color={(car?.name) ? isCompatible ? colors.success : colors.error : colors.warning}
                    style={{
                      position: "absolute",
                      bottom: 4,
                      right: -5,
                    }}
                  />

              </View>
              <Text style={styles.vehicleText}>
                {car?.name
                  ? isCompatible
                    ? <><Text style={{
                      fontWeight: "bold"
                    }}>Compatible avec votre </Text>{car?.name}</>
                    : <>
                      <Text style={{
                        fontWeight: "bold"
                      }}> Non compatible </Text>avec votre véhicule {car?.name} </>
                  : "Vérifiez si votre véhicule est compatible"}
              </Text>
            </View>
            <View style={{
              flexDirection:"row",
              alignItems:"center",
              backgroundColor:"inherent"
            }}>
              {car?.name &&
              <>
                <TouchableOpacity onPress={() => openModal({
                  id:"AddVehicle",
                content:<AddVehicle  />,
                closeButtonVisible:true,
                marginTop:700
              }
              )}>
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
                    setSelectedCar(car)
                    router.push(`/categories/${categorySlug}`)
                  }}>
                    <Text style={styles.vehicleButtonText}>
                      {"Voir les pièces adaptées"}
                    </Text>
                  </Button>}
                </>
                }

            </View>
          </View>

          {!car?.name &&
            <WhiteButton 
            title={"Sélectionner un véhicule"}
            onPress={() => openModal({
              id:"AddVehicle",
              content:<AddVehicle />,
              closeButtonVisible:true,
               marginTop:700
             }
            )}
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