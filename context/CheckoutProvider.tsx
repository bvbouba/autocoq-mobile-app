import { ApolloError } from "@apollo/client";
import React, { createContext, useContext, ReactNode, useState } from "react";

import { useAsyncStorage } from "@/lib/hooks/useLocalStorage";
import { CheckoutWithZoneFragment, DeliveryMethodFragment, useCheckoutByTokenQuery } from "@/saleor/api.generated";
interface DeliveryState {
  zone: string | undefined;
  method: DeliveryMethodFragment | undefined;
}

const CHECKOUT_TOKEN = "@SaleorApp:checkoutToken";

export interface CheckoutConsumerProps {
  checkoutToken: string;
  setCheckoutToken: (token: string) => void;
  resetCheckoutToken: () => void;
  checkout: CheckoutWithZoneFragment | undefined | null;
  checkoutError: ApolloError | undefined;
  loading: boolean;
  delivery: DeliveryState;
  setDelivery: React.Dispatch<React.SetStateAction<DeliveryState>>; 
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
  zone: undefined,
  method: undefined
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutToken, setCheckoutToken] = useAsyncStorage(CHECKOUT_TOKEN, "");
  const [delivery, setDelivery] = useState<DeliveryState>(defaultDeliveryState);

  const { data, loading, error: checkoutError } = useCheckoutByTokenQuery({
    skip: !checkoutToken || typeof window === "undefined",
  });

  const resetCheckoutToken = () => setCheckoutToken("");

  const providerValues: CheckoutConsumerProps = {
    checkoutToken,
    setCheckoutToken,
    resetCheckoutToken,
    checkout: data?.checkout,
    loading,
    checkoutError,
    setDelivery,
    delivery
  };

  return <CheckoutContext.Provider value={providerValues}>{children}</CheckoutContext.Provider>;
}
