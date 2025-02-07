import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Close button icon
import { colors } from "./Themed";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ProductMediaFragment {
  url: string;
  alt?: string;
}

interface ImageExpandProps {
  image?: ProductMediaFragment;
  onRemoveExpand: () => void;
}

function clamp(val:number, min:number, max:number) {
  return Math.min(Math.max(val, min), max);
}

const ImageExpand: React.FC<ImageExpandProps> = ({ image, onRemoveExpand }) => {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const offsetX = useSharedValue(0); // For panning X
  const offsetY = useSharedValue(0); // For panning Y
  const panStartX = useSharedValue(0); // Start of pan in X direction
  const panStartY = useSharedValue(0); // Start of pan in Y direction

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.5,
        Math.min(width / 100, height / 100)
      );
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .onStart((event) => {
      // Record the initial pan position
      panStartX.value = offsetX.value;
      panStartY.value = offsetY.value;
    })
    .onUpdate((event) => {
      // Limit the pan speed and make sure the offset moves accordingly
      const x = panStartX.value + event.translationX / scale.value; // Adjust pan with scale
      const y = panStartY.value + event.translationY / scale.value; // Adjust pan with scale
      offsetX.value = x;
      offsetY.value = y;
    })
    .runOnJS(true);

  // Double-tap gesture
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const newScale = scale.value === 1 ? 2 : 1; // Toggle between scale 1 and 2
      scale.value = newScale;
    });

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: withSpring(offsetX.value) },
      { translateY: withSpring(offsetY.value) },
    ],
  }));

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
          <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={Gesture.Simultaneous(pinch, pan, doubleTap)}>
              <TouchableWithoutFeedback>
                <Animated.View style={[styles.box, boxAnimatedStyles]}>
                  <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: image.url }} 
                        style={styles.image} resizeMode="contain" />
                    </View>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </GestureDetector>
          </GestureHandlerRootView>
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
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  box: {
    borderRadius: 20,
    backgroundColor: '#b58df1',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    position: 'absolute',
    left: '50%',
    top: '50%',
    pointerEvents: 'none',
  },
});

export default ImageExpand;
