import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Close button icon
import { colors } from "./Themed";

interface ProductMediaFragment {
  url: string;
  alt?: string;
}

interface ImageExpandProps {
  image?: ProductMediaFragment;
  onRemoveExpand: () => void;
}

const ImageExpand: React.FC<ImageExpandProps> = ({ image, onRemoveExpand }) => {
  if (!image) return null;

  return (
    <Modal visible={!!image} transparent={true} animationType="fade">
      {/* Detect outside taps */}
      <TouchableWithoutFeedback onPress={onRemoveExpand}>
        <View style={styles.overlay}>
          {/* Product Name */}
          {image.alt && <Text style={styles.productName}>{image.alt}</Text>}

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onRemoveExpand}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={28} color={colors.primary} />
          </TouchableOpacity>

          {/* Image Container */}
          <TouchableWithoutFeedback>
            <View style={styles.imageWrapper}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: image.url }} 
                style={styles.image} resizeMode="contain" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  productName: {
    position: "absolute",
    top: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 10, // Ensures the button is clickable
  },
  imageWrapper: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageExpand;
