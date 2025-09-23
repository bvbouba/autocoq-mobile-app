import * as React from 'react';
import { Button, ActivityIndicator, IconButton } from 'react-native-paper';
import {  colors, fonts, PaddedView, Text } from '../components/Themed';
import { CheckoutWithZoneFragment, useCheckoutShippingMethodUpdateMutation } from '../saleor/api.generated';
import { View, StyleSheet } from 'react-native';
import { useCheckout } from '@/context/CheckoutProvider';
import DeliveryMethodComponent from '@/components/DeliveryMethod/DeliveryMethodComponent';
import { useModal } from '@/context/useModal';
import { useMessage } from '@/context/MessageContext';
import analytics from '@/lib/analytics';

const ShippingMethods = () => {
    const { closeModal } = useModal();
    const {  checkoutToken,setDelivery,delivery } = useCheckout();
    const checkout = useCheckout().checkout as CheckoutWithZoneFragment;
    const [shippingAddressUpdate] = useCheckoutShippingMethodUpdateMutation();
    const { showMessage } = useMessage();

    const shippingMethods = checkout && checkout.availableShippingMethods;
    // const firstMethod = shippingMethods && shippingMethods?.length > 0 ? shippingMethods[0].id : undefined;
    const [checked, setChecked] = React.useState("");
    const [loading, setLoading] = React.useState(false); // État pour gérer le chargement
    const updateShippingMethod = async () => {
        setLoading(true); 
        const selectedShippingMethod = shippingMethods?.find(method => method.id === checked);

        // add_shipping_info analytics event here
        if (checkout && selectedShippingMethod) {
            analytics().logEvent('add_shipping_info', {
                shipping_tier: selectedShippingMethod.name,
                value: checkout.totalPrice?.gross.amount || 0,
                currency: checkout.totalPrice?.gross.currency || 'USD',
                items: checkout.lines.map(line => ({
                    item_id: line?.variant.id,
                    item_name: line?.variant.product.name,
                    price: line?.totalPrice.gross.amount || 0,
                    quantity: line?.quantity || 1,
                })),
            });
        }

        try {
            await shippingAddressUpdate({
                variables: {
                    token: checkoutToken,
                    shippingMethodId: checked,
                },
            });
            setDelivery({
                ...delivery,
                methodId:checked
            })
            closeModal("ShippingMethod");
        } catch (error) {
            showMessage("Erreur lors de la mise à jour")
        } finally {
            setLoading(false); // Arrêter le chargement
        }
    };

    const handleSelect = (id: string) => {
        setChecked(id);
    };
    if (!shippingMethods) return;

    return (
        <PaddedView style={{
            paddingTop:50
        }}>
            <View style={{ alignItems: "flex-end" }}>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => closeModal("ShippingMethod")}
                  />
                </View>
            <View>
                <Text style={styles.title}>Modifier le mode de livraison</Text>
                <Text style={{
                    fontSize: fonts.body,
                    color: colors.textSecondary
                }}>
                    Sélectionnez une option ci-dessous
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
                    backgroundColor: colors.primary,
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
