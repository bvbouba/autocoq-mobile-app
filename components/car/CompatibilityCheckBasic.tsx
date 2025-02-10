import { ProductFragment, useCompatibilityCheckQuery } from "@/saleor/api.generated"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useCarFilter } from "@/context/useCarFilterContext"
import { Text, View, colors } from "@/components/Themed"
import SkeletonContent from "react-native-skeleton-content"
import { useModal } from "@/context/useModal"
import CarFilterModal from "./Modal"


interface props {
  product: ProductFragment;
  setFilterOpen: (filterOpen: boolean) => void,
}

const CompatibilityCheckBasic = ({ product, setFilterOpen }: props) => {
  const { selectedCar } = useCarFilter()
  const {openModal} = useModal()

  const { data, loading } = useCompatibilityCheckQuery({
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

  if (loading) return
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
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "inherent"
            }}>
              <View style={{ position: "relative" }}>
                <FontAwesome name="car" size={15} color={colors.secondary} style={{
                  backgroundColor:colors.warningBg
                }} />
                  <FontAwesome
                    name="exclamation-circle"
                    size={10}
                    color={colors.warning}
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -5,
                    }}
                  />
              </View>
              <Text style={styles.vehicleText}>
                {selectedCar?.name
                  ? isCompatible
                    ? <>
                      <TouchableOpacity onPress={() => openModal("carFilter",<CarFilterModal/>)}>
                        <Text style={[styles.vehicleButtonText, {
                          fontWeight: "bold"
                        }]}>Compatible avec votre </Text>
                        <Text style={[styles.vehicleButtonText, {
                          textDecorationLine: "underline"
                        }]}>{selectedCar?.name}</Text>
                      </TouchableOpacity>

                    </>

                    : <>
                      <TouchableOpacity onPress={() => openModal("carFilter",<CarFilterModal/>)}>
                        <Text style={[styles.vehicleButtonText, {
                          fontWeight: "bold",
                          textDecorationLine: "underline"
                        }]}> Non compatible </Text>
                        <Text
                          style={[styles.vehicleButtonText, {
                            textDecorationLine: "underline"
                          }


                          ]}
                        >avec votre véhicule {selectedCar?.name}</Text>
                      </TouchableOpacity>

                    </>
                  :

                  <TouchableOpacity onPress={() => openModal("carFilter",<CarFilterModal/>)}>
                    <Text style={[styles.vehicleText, {
                      textDecorationLine: "underline"
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