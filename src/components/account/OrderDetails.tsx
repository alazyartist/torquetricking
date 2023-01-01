import React from "react";
import { SyncVariant } from "../../types/SyncVariant";
import { trpc } from "../../utils/trpc";
interface OrderDetails {
  id: string;
  amount: number;
  cart: SyncVariant;
  createdAt: any;
  paymentIntent: string;
  printful_id: string | null;
  shipping: string;
  userId: string;
}

const OrderDetails = () => {
  const { data: userOrders } = trpc.auth.getUserOrders.useQuery();
  console.log(userOrders);
  return (
    <div>
      <div className="text-bold text-xl">OrderDetails</div>
      <div className="flex flex-col gap-2">
        {userOrders &&
          userOrders
            ?.sort((a, b) => {
              a.createdAt > b.createdAt ? -1 : 1;
            })
            .filter((order: OrderDetails) => order.printful_id !== null)
            .map((order: OrderDetails) => (
              <IndividualOrder key={order.id} order={order as OrderDetails} />
            ))}
      </div>
    </div>
  );
};

const IndividualOrder = ({ order }: OrderDetails) => {
  console.log(order);
  return (
    <div className="flex max-w-full gap-4 rounded-md bg-zinc-900 bg-opacity-20 p-2">
      <div>{new Date(order.createdAt).toLocaleDateString()}</div>
      <div className="">{order.amount}$</div>
      <div className="min-w-[30%]">{order.cart?.name}</div>
      <div>{order.printful_id}</div>
      <div>{order.paymentIntent}</div>
    </div>
  );
};
export default OrderDetails;
