import React, { useState } from "react";
import { ProductVariantFragment, useGetAvailableShippingMethodsQuery } from "@/saleor/api.generated";
import { useCheckout } from "@/context/CheckoutProvider";
import ZoneSelector from "../ZoneSelector";
import DeliveryMethodComponent from "./DeliveryMethodComponent";
import { Skeleton } from "moti/skeleton";


interface Props {
  variant?: ProductVariantFragment | null;
  setCheckedId: React.Dispatch<React.SetStateAction<string | undefined>>
}



const DeliveryMethod = ({ variant,setCheckedId }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const {delivery:{zone},checkout} = useCheckout()
  const subtotalPrice = checkout?.subtotalPrice.gross

  const {data,loading} = useGetAvailableShippingMethodsQuery({
    skip:!zone,
    variables:{
      id:variant?.id || "",
      zoneName:zone,
       orderPrice: (subtotalPrice
    ? { currency: subtotalPrice.currency, amount: subtotalPrice.amount }
    : undefined)
    }
  })
  const availableShippingMethods = data?.productVariant?.availableShippingMethods


  const handleSelect= (id:string)=> {
   const method = availableShippingMethods?.find(m=>m.id === id)
   setSelectedOption(method?.id)
   setCheckedId(method?.id)
  }


  if (loading) return <Skeleton height={40} width="100%" radius={2} colorMode="light" />

  if (!availableShippingMethods?.length) return <ZoneSelector />;

  return (
    <DeliveryMethodComponent 
    selectedOption={selectedOption || ""}
    handleSelect={handleSelect}
    availableShippingMethods={availableShippingMethods}
    />
  );
};


export default DeliveryMethod;
