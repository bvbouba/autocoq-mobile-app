import { OrderFragment } from "@/saleor/api.generated";

export function removeDuplicates(orders: OrderFragment[]): OrderFragment[] {
    const uniqueOrdersMap = new Map<string, OrderFragment>();
  
    orders.forEach(order => {
      if (!uniqueOrdersMap.has(order.id)) {
        uniqueOrdersMap.set(order.id, order);
      }
    });
  
    return Array.from(uniqueOrdersMap.values());
  }
  