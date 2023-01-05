import React, { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { trpc } from "../../utils/trpc";
import { SyncVariant } from "../../types/SyncVariant";
interface CheckoutOptions {
  setShowForm: any;
  cartTotal: string;
  user_id: string;
  cart: SyncVariant[];
  setCartOpen: any;
}

const CheckoutPaymentEmbed: React.FC<CheckoutOptions> = ({
  setShowForm,
  cartTotal,
  user_id,
  cart,
  setCartOpen,
}) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { data: stprom } = trpc.shop.getSecretKey.useQuery();
  useEffect(() => {
    if (stprom) {
      setStripePromise(loadStripe(stprom));
    }
  }, [stprom]);
  const { mutateAsync: createCheckoutSession, data } =
    trpc.shop.createCheckoutSession.useMutation();
  useEffect(() => {
    console.log(cartTotal, user_id);
    createCheckoutSession({
      user_id: user_id,
      amount: cartTotal,
      cart: cart,
    });
  }, [cartTotal]);
  useEffect(() => {
    if (data) {
      setClientSecret(data?.clientSecret);
    }
  }, [data, clientSecret, stripePromise]);
  const appearance = { theme: "night" };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex place-content-center place-items-center gap-4 p-2 text-center font-inter text-4xl">
        {cartTotal}$
      </div>
      <div className="">
        {stripePromise && clientSecret && (
          <Elements
            stripe={stripePromise}
            //@ts-ignore
            options={{ clientSecret, appearance }}
          >
            <CheckoutForm setCartOpen={setCartOpen} setShowForm={setShowForm} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default CheckoutPaymentEmbed;
