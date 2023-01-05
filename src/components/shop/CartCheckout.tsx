import React from "react";
import { SyncVariant } from "../../types/SyncVariant";
import { Recipient } from "./ShopDisplay";
interface CartProps {
  cart: SyncVariant[];
  recipient: Recipient;
}
const CartCheckout: React.FC<CartProps> = ({ cart, recipient }) => {
  let subtotal = cart
    .map((item) => parseFloat(item.retail_price))
    .reduce((sum, b) => sum + b, 0);
  return (
    <div className="absolute top-0 left-0 flex h-screen w-screen flex-col bg-zinc-900 text-zinc-300">
      <div className="p-2">CartCheckout</div>
      {recipient &&
        Object.keys(recipient).map((e) => {
          return (
            <>
              <div>{e}</div>
              <div>{recipient[e]}</div>
            </>
          );
        })}
      <div>
        {cart.map((item) => (
          <div>{item.retail_price}</div>
        ))}
        {subtotal}
      </div>
      {/* {JSON.stringify({ recipient, cart })} */}
    </div>
  );
};

export default CartCheckout;
