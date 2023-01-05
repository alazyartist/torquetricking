import React, { useState } from "react";
import { SyncVariant } from "../../types/SyncVariant";
import CheckoutPaymentEmbed from "../payments/CheckoutPaymentEmbed";
import { Recipient } from "./ShopDisplay";
interface CartProps {
  cart: SyncVariant[];
  recipient: Recipient;
  estimate: any;
  user_id: string;
  toggleCheckout: any;
  setCartOpen: any;
}
const CartCheckout: React.FC<CartProps> = ({
  cart,
  recipient,
  estimate,
  user_id,
  toggleCheckout,
  setCartOpen,
}) => {
  let subtotal = cart
    .map((item) => parseFloat(item.retail_price))
    .reduce((sum, b) => sum + b, 0);
  console.log(user_id);
  let cartTotal = estimate?.retail_costs?.total || 0;
  return (
    <div className="fixed top-0 left-0 flex h-screen w-screen flex-col overflow-y-scroll bg-zinc-900 text-zinc-300">
      {recipient && (
        <CheckoutPaymentEmbed
          setCartOpen={setCartOpen}
          cart={cart}
          setShowForm={toggleCheckout}
          user_id={user_id}
          cartTotal={cartTotal}
        />
      )}
    </div>
  );
};

export default CartCheckout;
