import {  TouchableOpacity, Image,StyleSheet } from "react-native";
import {SurfaceView, Text, View , colors, fonts } from "@/components/Themed"
import ImageExpand from "../ImageExpand";
import { EngineDetailsFragment, MakeDetailsFragment, ModelDetailsFragment, YearDetailsFragment } from "@/saleor/api.generated";
import { useState } from "react";
import { useCarFilter } from "@/context/useCarFilterContext";
import { PrimaryButton } from "../button";
import MyGarage from "../commun/MyGarage";
import { useModal } from "@/context/useModal";
import VehicleSelectionFilter from "./VehicleSelection";
import AddVehicle from "./VehicleSelection";

interface props {
    carMake?:MakeDetailsFragment|null,
    carModel?:ModelDetailsFragment|null,
    carEngine?:EngineDetailsFragment|null,
    carYear?: YearDetailsFragment|null,
    clearFilter: () => void
  }

  interface ImageProps {
    url: string;
    alt: string;
  }

const AddVehicleSection =()=>{
    const { selectedCar, clearFilter } = useCarFilter();
    const [expandedImage, setExpandedImage] = useState<ImageProps | null | undefined>(null);
    const {openModal} = useModal()
    
   
    return(<>
     <SurfaceView>
      <MyGarage />
          {selectedCar ? (
            <View style={{
              flexDirection: "row",
            }}>
              <View style={[styles.currentFilterContainer]}>
                <Text style={styles.currentFilterText}>
                  {`Les pièces affichées sont pour`}
                </Text>
                <Text style={styles.currentFilterCar}>
                  {`${selectedCar.name}`}
                </Text>
                <View style={styles.showWithoutVehicle}>
                  <TouchableOpacity onPress={clearFilter}>
                    <Text style={styles.showWithoutVehicleText}> Afficher sans véhicule </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignContent: "center", }}>
                {(selectedCar.model?.imageUrl) && 
                  <>
                    <TouchableOpacity
                      onPress={() => setExpandedImage({
                        url: selectedCar.model?.imageUrl || "",
                        alt: ""
                      })}
                    >
                      <Image
                        style={[styles.tinyLogo]}
                        source={{
                          uri: selectedCar.model?.imageUrl
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    {/* Modal for Expanded Image */}
                    {expandedImage && (
                      <View style={styles.modalContainer}>
                        <ImageExpand image={expandedImage} />
                      </View>
                    )}
               </>
                }
              </View>
              </View>
          ) : (
            <>
              <View style={{ alignItems: "flex-start" }}>
                <Text style={styles.noVehicleText}>Aucun véhicule sélectionné</Text>
                <Text style={styles.vehicleDescription}>
                  Ajoutez un véhicule pour trouver des pièces compatibles
                </Text>
              </View>
              <View style={{ width: "100%" }}>
                <PrimaryButton 
                title={`AJOUTER UN VÉHICULE`}
                onPress={() => openModal({
                  id:"AddVehicle",
                  content:<AddVehicle />,
                  closeButtonVisible:true,
                  marginTop:700
                }
                )}
                />              
              </View>
            </>
          )}
          </SurfaceView>
    
       
    
    </>)
}

const styles = StyleSheet.create({
 
    currentFilterContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      paddingHorizontal:10,
      width:"60%",
    },
    currentFilterText: {
      fontSize:fonts.caption,
      color: "#333",
    },
    currentFilterCar: {
      fontSize:fonts.body,
      fontWeight: "bold",
      color: "#333",
    },
    showWithoutVehicle: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    showWithoutVehicleText: {
      fontSize:fonts.body,
      textDecorationLine: "underline",
    },
    addVehicleContainer: {
      backgroundColor: "#ffffff",
      padding: 10,
      alignItems: "center",
      width: "100%",
    },
    noVehicleText: {
      fontSize: fonts.body,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
    },
    vehicleDescription: {
      fontSize: fonts.body,
      color: "#666",
      marginBottom: 10,
    },
    toggleButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 15,
      alignItems: "center",
    },
    toggleButtonText: {
      color: "#fff",
      fontWeight: "400",
    },
    tinyLogo: {
      width:150,
      height: 80,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.8)",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  export default AddVehicleSection