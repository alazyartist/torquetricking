import React, { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { trpc } from "../../utils/trpc";
const PaymentEmbed: React.FC<any> = ({
  setShowForm,
  creditAmount,
  userDetails,
  product,
  shippingOption,
}) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { data: stprom } = trpc.shop.getSecretKey.useQuery();
  useEffect(() => {
    if (stprom) {
      setStripePromise(loadStripe(stprom));
    }
  }, [stprom]);
  const { mutateAsync: paymentIntent, data } =
    trpc.shop.createPaymentIntent.useMutation();
  useEffect(() => {
    console.log(creditAmount, userDetails);
    paymentIntent({
      user_id: userDetails,
      amount: parseFloat(creditAmount),
      product: product,
      shipping: shippingOption.id,
    });
  }, [creditAmount]);
  useEffect(() => {
    if (data) {
      setClientSecret(data?.clientSecret);
    }
  }, [data, clientSecret, stripePromise]);
  const appearance = { theme: "night" };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex place-content-center place-items-center gap-4 text-center font-inter text-4xl">
        {creditAmount}$
      </div>
      <div className="">
        {stripePromise && clientSecret && (
          <Elements
            stripe={stripePromise}
            //@ts-ignore
            options={{ clientSecret, appearance }}
          >
            <CheckoutForm setShowForm={setShowForm} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default PaymentEmbed;
