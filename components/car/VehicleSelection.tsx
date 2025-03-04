import { StyleSheet, TouchableOpacity } from "react-native";
import { carType } from "@/context/useCarFilterContext";
import { Text, View, colors, fonts } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useModal } from "@/context/useModal";
import AddByCarInformation from "./AddByCarInformation";


const AddVehicle = () => {
  const {openModal} = useModal()
  
  return (

         
                    <View style={styles.filterContainer}>
          

                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome name="car" size={20} color={colors.secondary} style={styles.carIcon} />
                        <View>
                          <Text style={styles.filterText}>Ajouter véhicule</Text>
                          <Text style={styles.instructionText}> Veuillez sélectionner une option ci-dessous </Text>
                        </View>
                      </View>

                      <TouchableOpacity style={styles.option} onPress={() => openModal({
                        id:"AddByCarInformation",
                        content: <AddByCarInformation />,
                        closeButtonVisible:false,
                        height:"130%",
                        marginTop:0,
                        disableScroll:true
                      })}>
                          <Text style={styles.optionText}>
                            Make & Model
                          </Text>
                          <Text style={styles.optionSubText}> 
                            Search by Year, Make, Model and Engine
                          </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.option} onPress={() => console.log("VIN")} >
                    
                          <Text style={styles.optionText}>
                            Type VIN Manually
                          </Text>
                          <Text style={styles.optionSubText}> 
                            Input Your Vehicle Information Number
                          </Text>
                      
                      </TouchableOpacity>

                      

                     
                    </View>
                  
  );
};

const styles = StyleSheet.create({

  modalContainer: { backgroundColor: 'white', padding: 20, height: "100%"},

  option: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding:10,
    margin: 5,
  },
  optionText:{
    color:colors.textPrimary, 
    fontSize:fonts.h2, 
    fontWeight:"bold" 
  },
  optionSubText:{
    fontSize: fonts.body,
    color: "gray",
    marginBottom: 20,
    flexWrap: "wrap",
    maxWidth: "100%",

  },
  selectionModal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    position: "absolute",
    zIndex: 10, // Bring the dropdown above other modal content
  },
  
  button: {
    marginTop: 20,
  },
  carIcon: {
    padding: 5,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: 10,
  },

  filterContainer: {
    marginBottom: 20,
    width: "100%",
    padding:20
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterText: {
    fontSize: fonts.h1,
    fontWeight: "bold",
    marginBottom:5
  },
  closeButton: {
    top: 0,
    right: 0,
  },
  instructionText: {
    fontSize: fonts.caption,
    color: "gray",
    marginBottom: 10,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  buttonGroup: {
    width: "100%"
  },

});

export default AddVehicle;
