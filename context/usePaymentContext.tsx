import { ApolloError } from "@apollo/client";
import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { useCheckoutCompleteMutation, useCheckoutPaymentCreateMutation } from "../saleor/api.generated";
import { handleErrors } from "./checkout";
import { useCartContext } from "./useCartContext";
import { useOrderContext } from "./useOrderContext";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@/lib/providers/authProvider";

interface ConfirmationData {
    id: string
    client_secret: string

}

interface PaymentContextModel {
    error: ApolloError | undefined
    confirmationData: ConfirmationData | undefined
    loading: boolean | undefined
    chosenGateway: string
    setChosenGateway: (gateway: string) => void
    startCheckout: () => Promise<void>
    cancelPayment: () => Promise<void>
    convertCartToOrder: () => Promise<{ orderId: string }>
}

const PaymentContext = createContext<PaymentContextModel>({
    error: undefined,
    loading: undefined,
    confirmationData: undefined,
    chosenGateway: "",
    setChosenGateway: () => { },
    startCheckout: () => Promise.resolve(),
    cancelPayment: () => Promise.resolve(),
    convertCartToOrder: () => Promise.resolve({ orderId: "" })
});

export const usePaymentContext = () => useContext(PaymentContext);

export const PaymentProvider: FC<PropsWithChildren> = ({ children }) => {
    const { cart } = useCartContext();
    const {authenticated} = useAuth()
    const { setRecentOrderId: setOrderId } = useOrderContext();

    const [completeCheckout, completeCheckoutStatus] = useCheckoutCompleteMutation();
    const [createPayment, createPaymentStatus] = useCheckoutPaymentCreateMutation();

    const [confirmationData, setConfirmationData] = useState<ConfirmationData | undefined>(undefined)

    const [chosenGateway, setChosenGateway] = useState<string>("");
    const loading = createPaymentStatus.loading;
    
    const cancelPayment = async () => {
        setConfirmationData(undefined)
    }


    const startCheckout = async () => {
        createPaymentStatus.reset();
        setChosenGateway("")

        try {

            const createPaymentResult = await createPayment({
                variables: {
                    checkoutId: cart?.id as string,
                    paymentInput: {
                        amount: cart?.totalPrice.gross.amount,
                        gateway: chosenGateway
                    }
                }
            })
            handleErrors(createPaymentResult)
            const checkoutCompleteResult = await completeCheckout({
                variables: {
                    checkoutId: cart?.id as string
                }
            });
            handleErrors(checkoutCompleteResult);
            setConfirmationData(checkoutCompleteResult.data?.checkoutComplete?.confirmationData ? JSON.parse(checkoutCompleteResult.data?.checkoutComplete?.confirmationData) : undefined)
        } catch (e) {
            console.error(e)
        }
    };

    const convertCartToOrder = async () => {
        setConfirmationData(undefined)
        createPaymentStatus.reset();
        const checkoutCompleteResult = await completeCheckout({
            variables: {
                checkoutId: cart?.id as string
            }
        })
        handleErrors(checkoutCompleteResult)
        const orderId = checkoutCompleteResult.data?.checkoutComplete?.order?.id
        if(!authenticated){
        setOrderId(orderId as string)
        }
        return { orderId: orderId as string }
    }

    const error = completeCheckoutStatus.error || createPaymentStatus.error;

    return (
        <PaymentContext.Provider value={{
            loading,
            error,
            confirmationData: confirmationData,
            chosenGateway,
            setChosenGateway,  // Provide setChosenGateway in context
            startCheckout,
            cancelPayment,
            convertCartToOrder,
        }}>
            {children}
        </PaymentContext.Provider>
    );
};
