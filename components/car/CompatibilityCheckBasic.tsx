import { ProductCardFragment, useCompatibilityCheckQuery } from "@/saleor/api.generated"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { StyleSheet, TouchableOpacity } from "react-native"
import { carType, useCarFilter } from "@/context/useCarFilterContext"
import { Text, View, colors } from "@/components/Themed"
import { useModal } from "@/context/useModal"
import { useState } from "react"
import { Skeleton } from "moti/skeleton"
import SelectVehicle from "./SelectVehicle"


interface props {
  product: ProductCardFragment;
}

const CompatibilityCheckBasic = ({ product }: props) => {
  const [selectedLocalCar, setSelectedLocalCar] = useState<carType | undefined>()
  const { selectedCar } = useCarFilter()
  const {openModal} = useModal()
  const car = selectedLocalCar || selectedCar

  const { data, loading } = useCompatibilityCheckQuery({
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

  if (loading) return <Skeleton height={30} width="100%" radius={2} colorMode="light" />
  
  const isCompatible = data?.checkProductCompatibility;

  return (
    <>
      <View style={{ alignItems: "center" }}>
        <View
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
              alignItems: "center",
              backgroundColor: "inherent"
            }}>
              <View style={{ position: "relative" }}>
                <FontAwesome name="car" size={15} color={colors.secondary} style={{
                  backgroundColor:colors.warningBg
                }} />
          
                  <FontAwesome
                    name={(car?.name) ? isCompatible ? "check-circle" : "warning" : "exclamation-circle"}
                    size={10}
                    color={(car?.name) ? isCompatible ? colors.success : colors.error : colors.warning}
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -5,
                    }}
                  />
              </View>
              <Text style={styles.vehicleText}>
                {car?.name
                  ? isCompatible
                    ? <>
                      <TouchableOpacity onPress={() => openModal({
                        id:"selectVehicle",
                      content:<SelectVehicle setSelectedLocalCar={setSelectedLocalCar}/>,
                      closeButtonVisible:true,
                      marginTop:300,
                      disableScroll:true
                    })}>
                        <Text style={[styles.vehicleButtonText, {
                          fontWeight: "bold"
                        }]}>Compatible avec votre </Text>
                        <Text style={[styles.vehicleButtonText, {
                          textDecorationLine: "underline"
                        }]}>{car?.name}</Text>
                      </TouchableOpacity>

                    </>

                    : <>
                      <TouchableOpacity onPress={() => openModal({
                        id:"selectVehicle",
                      content:<SelectVehicle setSelectedLocalCar={setSelectedLocalCar}/>,
                      closeButtonVisible:true,
                       marginTop:300,
                       disableScroll:true
                 }
                    )}>
                        <Text style={[styles.vehicleButtonText, {
                          fontWeight: "bold",
                          textDecorationLine: "underline"
                        }]}> Non compatible </Text>
                        <Text
                          style={[styles.vehicleButtonText, {
                            textDecorationLine: "underline"
                          }


                          ]}
                        >avec votre véhicule {car?.name}</Text>
                      </TouchableOpacity>

                    </>
                  :

                  <TouchableOpacity onPress={() => openModal({
                    id:"selectVehicle",
                    content:<SelectVehicle setSelectedLocalCar={setSelectedLocalCar}/>,
                    closeButtonVisible:true,
                    marginTop:300,
                    disableScroll:true
                  }
                  )}>
                    <Text style={[styles.vehicleText, {
                      textDecorationLine: "underline",
                    }]}>
                      {`Vérifiez si votre véhicule est compatible`}
                    </Text>
                  </TouchableOpacity>

                }
              </Text>
            </View>
            <View style={{
              flexDirection: "row",
              alignItems: "center"
            }}>


            </View>
          </View>


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
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  vehicleCheck: {
    flexDirection: "column",
    backgroundColor: colors.warningBg,
    alignItems: "center",
    width: "100%",
  },
  vehicleText: {
    fontSize: 10,
    marginLeft: 5,
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

export default CompatibilityCheckBasic