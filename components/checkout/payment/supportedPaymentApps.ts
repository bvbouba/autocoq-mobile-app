import CodPayment, { codGatewayId } from "./cod";
import DummyPayment, { dummyGatewayId } from "./dummy";

interface PaymentMethodToComponent {
	[key: string]: React.ComponentType;
  }


export const paymentMethodToComponent:PaymentMethodToComponent = {
	[dummyGatewayId]: DummyPayment,
	[codGatewayId]:CodPayment
};
