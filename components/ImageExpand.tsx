import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { fonts } from "./Themed";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
// import { useLoading } from "@/context/LoadingContext";

interface ProductMediaFragment {
  url: string;
  alt?: string;
}

interface ImageExpandProps {
  image?: ProductMediaFragment;
}

function clamp(val:number, min:number, max:number) {
  return Math.min(Math.max(val, min), max);
}

const ImageExpand: React.FC<ImageExpandProps> = ({ image }) => {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const offsetX = useSharedValue(0); // For panning X
  const offsetY = useSharedValue(0); // For panning Y
  const panStartX = useSharedValue(0); // Start of pan in X direction
  const panStartY = useSharedValue(0); // Start of pan in Y direction
  // const {setLoading:setIsLoading} = useLoading()
  const [loading, setLoading] = useState(true);
  
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

    const boxAnimatedStyles = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { translateX: withSpring(offsetX.value) },
          { translateY: withSpring(offsetY.value) },
        ] as Array<{ scale?: number; translateX?: number; translateY?: number }>,
      };
    });

    const handleImageLoad = () => {
      setLoading(false);
    };
  
    const handleImageError = () => {
      setLoading(false); 
    };

    // useEffect(()=>{
    //   setIsLoading(loading)
    // },[loading])

  if (!image) return null;

  return (
  
        <>
          {/* Product Name */}
          {image.alt && <Text style={styles.productName}>{image.alt}</Text>}

  

          {/* Image Container */}
          <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={Gesture.Simultaneous(pinch, pan, doubleTap)}>
              <TouchableWithoutFeedback>
                <Animated.View style={[styles.box, boxAnimatedStyles]}>
                  <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: image.url }}
                       onLoad={handleImageLoad}
                       onError={handleImageError} 
                        style={styles.image} resizeMode="contain" />
                    </View>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </GestureDetector>
          </GestureHandlerRootView>
        </>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  productName: {
    position: "absolute",
    top: 20,
    fontSize:fonts.h2,
    fontWeight: "bold",
    color: "white",
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
    alignItems: 'center',
  },
  box: {
    borderRadius: 20,
    backgroundColor: '#b58df1',
  },
});

export default ImageExpand;
