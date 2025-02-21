import {  useLocalSearchParams, usePathname } from "expo-router";

import { useEffect, useState } from "react";
import OrderDetails from "@/components/orders/OrderDetails";
import { useCheckout } from "@/context/CheckoutProvider";
import { useNavigationContext } from "@/context/NavigationContext";


const OrderDetailsPage = () => {
    const pathname = usePathname();
    const { orderSuccess } = useLocalSearchParams();
    const { resetCheckoutToken} = useCheckout();
    const {setNavigationSlug} = useNavigationContext()


    const [orderId, setOrderId] = useState<string>();
    
    if (orderSuccess) {
        resetCheckoutToken();
        setNavigationSlug("orderSuccess")
    }


    useEffect(() => {
        if (pathname.includes("/orders/")) {
            setOrderId(pathname.split("/").pop());
        }
    }, [pathname]);

    
    return <OrderDetails orderId={orderId} />;
};

export default OrderDetailsPage;
