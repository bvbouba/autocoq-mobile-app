import {  usePathname } from "expo-router";

import { useEffect, useState } from "react";
import OrderDetails from "@/components/orders/OrderDetails";


const OrderDetailsPage = () => {
    const pathname = usePathname();
    const [orderId, setOrderId] = useState<string>();

    useEffect(() => {
        if (pathname.includes("order")) {
            setOrderId(pathname.split("/").pop());
        }
    }, [pathname]);

    if (!orderId) return null;

    return <OrderDetails orderId={orderId} />;
};

export default OrderDetailsPage;
