import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

import { useAsyncStorage } from "@/lib/hooks/useLocalStorage";
import {
  CheckoutError,
  CheckoutFragment,
  CheckoutWithZoneFragment,
  DeliveryMethodFragment,
  useCheckoutAddProductLineMutation,
  useCheckoutByTokenQuery,
  useCheckoutLineUpdateMutation,
  useCreateCheckoutMutation,
  useRemoveProductFromCheckoutMutation,
} from "@/saleor/api.generated";
import { useAuth } from "@/lib/providers/authProvider";
import { getZoneName } from "./zone";

interface DeliveryState {
  zone: string | undefined;
  methodId: string | undefined;
}

const CHECKOUT_TOKEN = "@SaleorApp:checkoutToken";

export interface CheckoutConsumerProps {
  checkoutToken: string;
  setCheckoutToken: (token: string) => void;
  resetCheckoutToken: () => void;
  checkout: CheckoutWithZoneFragment | CheckoutFragment | undefined | null;
  error: string | undefined;
  loading: boolean;
  delivery: DeliveryState;
  setDelivery: React.Dispatch<React.SetStateAction<DeliveryState>>;
  onAddToCart: (selectedVariantID: string) => Promise<void>;
  onQuantityUpdate: (variantId: string, quantity: number) => Promise<void>;
  onCheckoutLineDelete: (lineId: string) => Promise<void>;
  chosenGateway: string
    setChosenGateway: (gateway: string) => void;
}

// ✅ Create context with default value `undefined`
const CheckoutContext = createContext<CheckoutConsumerProps | undefined>(undefined);

// ✅ Custom hook for using context
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};

const defaultDeliveryState: DeliveryState = {
  zone: "undefined",
  methodId: undefined,
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutToken, setCheckoutToken] = useAsyncStorage(CHECKOUT_TOKEN, "");
  const [delivery, setDelivery] = useState<DeliveryState>(defaultDeliveryState);
  const [checkout, setCheckout] = useState<CheckoutWithZoneFragment | CheckoutFragment | undefined>(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLineUpdateMutation, { loading: loadingLineUpdate }] = useCheckoutLineUpdateMutation();
  const [removeProductFromCheckout] = useRemoveProductFromCheckoutMutation();
  const [chosenGateway, setChosenGateway] = useState<string>("");

  

  const [createCheckout] = useCreateCheckoutMutation();
  const [addProductToCheckout] = useCheckoutAddProductLineMutation();
  const { user } = useAuth();

  const { data, loading: checkoutByTokenLoading, error: checkoutError } = useCheckoutByTokenQuery({
    skip: !checkoutToken,
    variables: {
      checkoutToken,
      zoneName: checkout?.shippingAddress?.city
    }
  });


  useEffect(() => {
    const fetchZone = async () => {
        const zoneName = await getZoneName();
        setDelivery((prev) => ({ ...prev, zone: zoneName }));
    };
    fetchZone();
}, []);

  useEffect(() => {
    if (data?.checkout) {
      setCheckout(data.checkout);
    }
    setLoading(checkoutByTokenLoading)
    setError(checkoutError?.message || "")
  }, [data]);


  const resetCheckoutToken = () => {
    setCheckoutToken("");
    setCheckout(undefined); // Reset checkout state
  };

  // ✅ Function to add product and update checkout state
  const onAddToCart = async (selectedVariantID: string) => {
    setLoading(true);
    const errors: CheckoutError[] = [];

    if (!selectedVariantID) {
      return;
    }

    if (checkout) {
      // ✅ Update existing checkout
      const { data: addToCartData } = await addProductToCheckout({
        variables: {
          checkoutToken,
          variantId: selectedVariantID,
        },
      });

      if (addToCartData?.checkoutLinesAdd?.checkout) {
        setCheckout(addToCartData.checkoutLinesAdd.checkout);
      }

      addToCartData?.checkoutLinesAdd?.errors.forEach((e) => e && errors.push(e));
    } else {
      // ✅ Create new checkout
      const { data: createCheckoutData } = await createCheckout({
        variables: {
          email: user?.email,
          channel: "ci",
          lines: [{ quantity: 1, variantId: selectedVariantID }],
        },
      });

      if (createCheckoutData?.checkoutCreate?.checkout) {
        setCheckout(createCheckoutData.checkoutCreate.checkout);
        setCheckoutToken(createCheckoutData.checkoutCreate.checkout.token);
      }

      createCheckoutData?.checkoutCreate?.errors.forEach((e) => e && errors.push(e));
    }

    setLoading(false);
    setError(errors.map((e) => e.message || "").join("\n"));
  };



  const onQuantityUpdate = async (variantId: string, quantity: number) => {
    if (!variantId || !checkoutToken) {
      return;
    }
    setLoading(true);
    const { data: updateCheckoutLineData } = await checkoutLineUpdateMutation({
      variables: {
        token: checkoutToken,
        lines: [
          {
            quantity,
            variantId,
          },
        ],
      },
    });

    if (updateCheckoutLineData?.checkoutLinesUpdate?.checkout) {
      setCheckout(updateCheckoutLineData?.checkoutLinesUpdate?.checkout);
    }

    const mutationErrors = updateCheckoutLineData?.checkoutLinesUpdate?.errors;
    setLoading(false);
    if (mutationErrors && mutationErrors.length > 0) {
      setError(mutationErrors.map((e) => e.message || "").join("\n"));
    }
  };

  const onCheckoutLineDelete = async (lineId: string) => {
    if (!lineId || !checkoutToken) return
    setLoading(true);

    try {
      const { data: deleteCheckoutLineData } = await removeProductFromCheckout({
        variables: {
          checkoutToken,
          lineId,
        },
      })
      if (deleteCheckoutLineData?.checkoutLineDelete?.checkout) {
        setCheckout(deleteCheckoutLineData?.checkoutLineDelete?.checkout);
      }

      const mutationErrors = deleteCheckoutLineData?.checkoutLineDelete?.errors;
      if (mutationErrors && mutationErrors.length > 0) {
        setError(mutationErrors.map((e) => e.message || "").join("\n"));
      }

    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    } finally {
      setLoading(false);
    }


  }

  const providerValues: CheckoutConsumerProps = {
    checkoutToken,
    setCheckoutToken,
    resetCheckoutToken,
    checkout,
    error,
    loading,
    setDelivery,
    delivery,
    onAddToCart,
    onQuantityUpdate,
    onCheckoutLineDelete,
    chosenGateway,
    setChosenGateway,  
  };

  return <CheckoutContext.Provider value={providerValues}>{children}</CheckoutContext.Provider>;
}
