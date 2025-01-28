import { ApolloError } from "@apollo/client";
import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { useCheckoutCompleteMutation, useCheckoutPaymentCreateMutation } from "../saleor/api.generated";
import { handleErrors } from "./checkout";
import { useCartContext } from "./useCartContext";
import { useOrderContext } from "./useOrderContext";
import { useRouter } from "expo-router";
import { Alert } from "react-native";


interface PaymentContextModel {
    error: ApolloError | undefined
    loading: boolean | undefined
    chosenGateway: string  
    setChosenGateway: (gateway: string) => void  
    onCheckoutComplete: () => Promise<void>
}

const PaymentContext = createContext<PaymentContextModel>({
    error: undefined,
    loading: undefined,
    chosenGateway: "",  
    setChosenGateway: () => {},  
    onCheckoutComplete: async () => {}
});

export const usePaymentContext = () => useContext(PaymentContext);

export const PaymentProvider: FC<PropsWithChildren> = ({ children }) => {
    const { cart } = useCartContext();

    const [completeCheckout, completeCheckoutStatus] = useCheckoutCompleteMutation();
    const [, createPaymentStatus] = useCheckoutPaymentCreateMutation();

    const [chosenGateway, setChosenGateway] = useState<string>(""); 
    const loading = createPaymentStatus.loading;
    const router = useRouter()
 

    const onCheckoutComplete = async () => {
        createPaymentStatus.reset();
        setChosenGateway("")

        const checkoutCompleteResult = await completeCheckout({
            variables: {
                checkoutId: cart?.id as string
            }
        });
        handleErrors(checkoutCompleteResult);
        Alert.alert('Success', 'Your order is confirmed!');
        const orderId = checkoutCompleteResult.data?.checkoutComplete?.order?.id;
        router.push("orderDetails/" + orderId + "?orderSuccess=true")
    };

    const error = completeCheckoutStatus.error || createPaymentStatus.error;

    return (
        <PaymentContext.Provider value={{
            loading,
            error,
            chosenGateway,
            setChosenGateway,  // Provide setChosenGateway in context
            onCheckoutComplete,
        }}>
            {children}
        </PaymentContext.Provider>
    );
};
