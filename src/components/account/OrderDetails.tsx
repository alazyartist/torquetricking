import React, { useState } from "react";
import { SyncVariant } from "../../types/SyncVariant";
import { trpc } from "../../utils/trpc";
interface OrderDetails {
  id: string;
  amount: number;
  cart: SyncVariant[];
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
    <div className="h-full w-full">
      <div className="mt-2 font-inter text-3xl font-black text-zinc-300">
        Order Details
      </div>
      <div className="flex flex-col gap-2">
        {userOrders &&
          userOrders
            ?.sort((a: OrderDetails, b: OrderDetails) => {
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

const IndividualOrder = ({ order }: any) => {
  console.log(order);
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div className="rounded-md bg-zinc-900 bg-opacity-20">
        <div
          onClick={() => setShowMore(!showMore)}
          className="flex place-content-center place-items-center gap-4 p-2"
        >
          <div className="">
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="">{order.amount}$</div>
          <div className="min-w-[30%]">
            {order.cart?.name || order.cart.length}
          </div>
          <div className="overflow-y-scroll p-1">
            {order.printful_id}
            <br />
            {order.paymentIntent}
          </div>
        </div>
        {showMore &&
          order.cart?.map((item: SyncVariant) => (
            <div className="flex w-full place-content-start place-items-center gap-2 p-2">
              <div>
                <img
                  className="rounded-md"
                  width={100}
                  height={100}
                  //   @ts-ignore
                  src={item.files[item.files.length - 1].preview_url}
                />
              </div>
              <div>{item.name}</div>
            </div>
          ))}
      </div>
    </>
  );
};
export default OrderDetails;
