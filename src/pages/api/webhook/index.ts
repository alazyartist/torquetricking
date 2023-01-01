import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { buffer } from "micro";
import { createContext } from "../../../server/trpc/context";

import { appRouter } from "../../../server/trpc/router/_app";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: any
) {
  console.log("webhook");
  const sig = req.headers["stripe-signature"];
  const reqBuffer = await buffer(req);
  let event;
  const caller = appRouter.createCaller({ prisma });
  try {
    event = await stripe.webhooks.constructEvent(
      reqBuffer,
      sig,
      endpointSecret
    );
    // Handle the event
    const paymentIntent = await stripe.paymentIntents.retrieve(
      event.data.object.id
    );
    switch (event.type) {
      // case "checkout.session.completed":
      // 	const session = event.data.object;
      // 	// console.log(session.charges.data);
      // 	const checkoutSessionDetails = await stripe.checkout.sessions.retrieve(
      // 		session.id,
      // 		{
      // 			expand: ["line_items"],
      // 		}
      // 	);
      // 	checkoutSessionDetails.line_items.data.map(async (itemDetails) => {
      // 		console.log(itemDetails);
      // 		if (itemDetails.description === "SessionReviewTest") {
      // 			console.log("I AM GOING TO ADD A SESSION CREDIT");
      // 		} else {
      // 			console.log("You Need To Pay for That");
      // 		}
      // 	});
      case "payment_intent.created":
        // console.log(event.data);

        const orderDetailsCreated = await caller.shop.getOrderDetails({
          user_id: paymentIntent.metadata.user_id as string,
          paymentIntent: paymentIntent.id,
        });
        console.log("orderDetails", orderDetailsCreated);
      case "charge.succeeded":
        const charge = event.data.object;
        console.log(charge);
        break;
      case "payment_intent.succeeded":
        // Then define and call a function to handle the event payment_intent.succeeded
        // console.log(line_items);
        console.log(paymentIntent.metadata);
        const orderDetails = await caller.shop.getOrderDetails({
          user_id: paymentIntent.metadata.user_id as string,
          paymentIntent: paymentIntent.id,
        });
        console.log("orderDetails", orderDetails);
      // caller.shop.buyNow({recipient:,items[]})
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // console.log(paymentIntent);
    // console.log(event);
    // console.log(event?.data);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).send();
}
