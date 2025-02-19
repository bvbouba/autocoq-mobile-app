import {  useLocalSearchParams, usePathname } from "expo-router";

import { useEffect, useState } from "react";
import OrderDetails from "@/components/orders/OrderDetails";
import { useCheckout } from "@/context/CheckoutProvider";
import { usePath } from "@/context/path";


const OrderDetailsPage = () => {
    const pathname = usePathname();
    const { orderSuccess } = useLocalSearchParams();
    const { resetCheckoutToken} = useCheckout();
    const {setPathSlug} = usePath()


    const [orderId, setOrderId] = useState<string>();
    
    if (orderSuccess) {
        resetCheckoutToken();
        setPathSlug("orderSuccess")
    }


    useEffect(() => {
        if (pathname.includes("/orders/")) {
            setOrderId(pathname.split("/").pop());
        }
    }, [pathname]);

    
    return <OrderDetails orderId={orderId} />;
};

export default OrderDetailsPage;
