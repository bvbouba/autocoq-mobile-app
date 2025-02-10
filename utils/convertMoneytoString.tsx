import { getConfig } from "@/config";
import { Money } from "@/saleor/api.generated";


export const convertMoneyToString = (money:Money| undefined| null) =>  {
    if(!money?.amount) return ""
    if(!money?.currency) return ""
    return (money.amount).toLocaleString(getConfig().locale, {
    style: "currency",
    currency: money.currency
})}