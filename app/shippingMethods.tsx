import * as React from 'react';
import { Button, ActivityIndicator } from 'react-native-paper';
import { borderRadius, colors, fonts, PaddedView, Text } from '../components/Themed';
import { useCheckoutShippingMethodUpdateMutation } from '../saleor/api.generated';
import { View, StyleSheet } from 'react-native';
import { useCheckout } from '@/context/CheckoutProvider';
import DeliveryMethodComponent from '@/components/DeliveryMethod/DeliveryMethodComponent';
import { useModal } from '@/context/useModal';

const ShippingMethods = () => {
    const { closeModal } = useModal();
    const { checkout, checkoutToken } = useCheckout();
    const [shippingAddressUpdate] = useCheckoutShippingMethodUpdateMutation();

    const shippingMethods = checkout && checkout.shippingMethods;
    const firstMethod = shippingMethods && shippingMethods?.length > 0 ? shippingMethods[0].id : undefined;

    const [checked, setChecked] = React.useState(firstMethod || "");
    const [loading, setLoading] = React.useState(false); // État pour gérer le chargement

    const updateShippingMethod = async () => {
        setLoading(true); // Démarrer le chargement
        try {
            const res = await shippingAddressUpdate({
                variables: {
                    token: checkoutToken,
                    shippingMethodId: checked,
                },
            });
            closeModal();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du mode de livraison :", error);
        } finally {
            setLoading(false); // Arrêter le chargement
        }
    };

    const handleSelect = (id: string) => {
        setChecked(id);
    };

    if (!shippingMethods) return;

    return (
        <PaddedView>
            <View>
                <Text style={styles.title}>Modifier le mode de livraison</Text>
                <Text style={{
                    fontSize: fonts.body,
                    color: colors.textSecondary
                }}>
                    Veuillez sélectionner une option ci-dessous
                </Text>
            </View>
            <View style={{
                marginVertical: 15,
            }}>
                <DeliveryMethodComponent
                    availableShippingMethods={shippingMethods}
                    handleSelect={handleSelect}
                    selectedOption={checked}
                />
            </View>

            <Button
                onPress={() => updateShippingMethod()}
                mode="contained"
                disabled={loading}
                style={{
                    backgroundColor: colors.secondary,
                    borderRadius: 3,
                    padding: 5
                }}
            >
                {loading ? <ActivityIndicator color="white" /> : "APPLIQUER"}
            </Button>
        </PaddedView>
    );
};

export default ShippingMethods;

const styles = StyleSheet.create({
    title: {
        fontSize: fonts.h2,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 5,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    labelContainer: {
        marginLeft: 8,
    },
    methodName: {
        fontWeight: "bold",
    },
    methodPrice: {
        color: "gray",
    },
});
