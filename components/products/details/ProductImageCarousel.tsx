import { FC, useEffect, useState } from "react"
import { Modal, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native"
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel'
import Carousel from "react-native-reanimated-carousel"
import { View, colors } from "@/components/Themed"
import ProductImage from "./ProductImage"
import { MaterialIcons } from "@expo/vector-icons"
import ImageExpand from "@/components/ImageExpand"
import { useModal } from "@/context/useModal"

interface ImageProps {
    url: string;
    alt: string;
}

interface Props {
    forceIndex?: number,
    images: ImageProps[]
}

const ProductImageCarousel: FC<Props> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width: windowWidth } = useWindowDimensions();
    const [expandedImage, setExpandedImage] = useState<ImageProps | null|undefined>(null);
    const {openModal} = useModal()
    useEffect(() => {
        setCurrentIndex(0);
    }, [images]);

    return (
        <>
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <Carousel
                    style={{ width: "100%"}}
                    loop={false}
                    width={windowWidth}
                    height={200}
                    snapEnabled
                    onSnapToItem={(index) => setCurrentIndex(index)}
                    data={images}
                    defaultIndex={0}
                    renderItem={({ index, item }) => (
                        <ProductImage
                            index={index}
                            url={item.url}
                            alt={item.alt}
                            style={styles.image}
                        />
                    )}
                />
                 {/* Expand Button - Center Right */}
                 <TouchableOpacity 
                        style={styles.expandButton} 
                        onPress={() => {
                            setExpandedImage(images[currentIndex])
                           if(expandedImage){ 
                          openModal({
                            id:"ImageExpand",
                           content: <ImageExpand image={expandedImage}  />
                          })
                        }
                        }
                    }
                    >
                        <MaterialIcons name="zoom-out-map" size={15} color="white" />
                    </TouchableOpacity>
            </View>
            
            

            <View style={styles.dotsContainer}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <AnimatedDotsCarousel
                    length={images.length}
                    currentIndex={currentIndex}
                    maxIndicators={4}
                    interpolateOpacityAndColor={true}
                    activeIndicatorConfig={{
                        color: colors.primary,
                        margin: 3,
                        opacity: 1,
                        size: 6,
                        
                    }}
                    inactiveIndicatorConfig={{
                        color: 'black',
                        margin: 3,
                        opacity: 0.2,
                        size: 6,
                    }}
                    decreasingDots={[
                        {
                            config: { color: 'black', margin: 3, opacity: 0.1, size: 6 },
                            quantity: 1,
                        },
                        {
                            config: { color: 'black', margin: 3, opacity: 0.1, size: 6 },
                            quantity: 1,
                        },
                    ]}
                />
                </View>
            </View>
        </View>
  
     
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 250,
    },
    carouselContainer: {
        width: "100%",
        height: 200,
    },
    collectionImageBanner: {
        width: "100%",
    },
    caroselItem: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    expandButton: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -12 }],
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 25,
        padding: 8,
    },
    dotsContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute", 
        bottom: 10, 
    },
    image:{
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
      },
});


export default ProductImageCarousel