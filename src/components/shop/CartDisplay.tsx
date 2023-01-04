import React from "react";
import { SyncVariant } from "../../types/SyncVariant";
import { useCart } from "./CartStore";

const CartDisplay: React.FC<{ cart: Array<SyncVariant> }> = ({ cart }) => {
  const removeFromCart = useCart((s) => s.removeFromCart);
  return (
    <div className="absolute top-0 z-[99] flex h-screen w-screen flex-col place-items-center gap-2 bg-zinc-900 p-4 font-inter">
      {cart.map((item, i) => (
        <div className="w-full rounded-md bg-zinc-300 bg-opacity-30 p-2">
          <div>{item.name}</div>
          <div className="flex place-content-center place-items-center gap-4">
            <img
              src={item.files[item.files.length - 1]?.preview_url}
              alt={"product_image"}
              className={"h-24 rounded-xl"}
            />
            <div className="flex flex-col place-items-center gap-2">
              <div className="text-3xl">{item.retail_price}</div>
              <div
                onClick={() => removeFromCart(i)}
                className="text-xxl rounded-md bg-red-500 p-2 text-zinc-300"
              >
                Remove Item
              </div>
            </div>
          </div>
        </div>
      ))}
      {cart.length ? (
        <div className="rounded-md bg-zinc-300 p-2">Checkout</div>
      ) : (
        <div className="text-xl text-zinc-700">Your Cart is Empty</div>
      )}
    </div>
  );
};

export default CartDisplay;
