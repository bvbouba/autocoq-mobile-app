import { getConfig } from "@/config";
import { Money } from "@/saleor/api.generated";


export const convertMoneyToString = (money:Money| undefined| null) =>  {
    if(!money) return ""
    return (money.amount).toLocaleString(getConfig().locale, {
    style: "currency",
    currency: money.currency
})}