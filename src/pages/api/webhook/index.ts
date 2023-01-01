import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { buffer } from "micro";
import { createContext } from "../../../server/trpc/context";

import { appRouter } from "../../../server/trpc/router/_app";
import { mailer } from "../../../utils/nodemailer";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("webhook");
  const sig = req.headers["stripe-signature"];
  const reqBuffer = await buffer(req);
  let event;
  const caller = appRouter.createCaller({ session: null, prisma });
  try {
    event = await stripe.webhooks.constructEvent(
      reqBuffer,
      sig as string,
      endpointSecret
    );
    // Handle the event
    const paymentIntent = await stripe.paymentIntents.retrieve(
      //@ts-ignore
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
        console.log("created", event.data);
        const orderDetailstest = await caller.shop.getOrderDetails({
          user_id: paymentIntent.metadata.user_id as string,
          paymentIntent: paymentIntent.id,
        });
        console.log("cart", orderDetailstest?.order.cart);
        const purchased = await caller.shop.buyNow({
          recipient: { ...orderDetailstest?.user.address },
          items: [orderDetailstest?.order.cart],
          shipping: orderDetailstest?.order.shipping,
          paymentIntent: paymentIntent.id,
        });
        await mailer.sendMail({
          to: orderDetailstest?.user.email,
          from: "torquetricking@gmail.com",
          subject: `Thanks for your purchase - Order ${orderDetailstest?.order.id}`,
          html: html(orderDetailstest),
        });
      // console.log("purchased", purchased);

      case "charge.succeeded":
        const charge = event.data.object;
        // console.log(charge);
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
        caller.shop.buyNow({
          recipient: { ...orderDetails?.user.address },
          items: [orderDetails?.order.cart],
          shipping: orderDetails?.order.shipping,
          paymentIntent: paymentIntent.id,
        });

        await mailer.sendMail({
          to: orderDetails?.user.email,
          from: "torquetricking@gmail.com",
          subject: `Thanks for your purchase - Order ${orderDetails?.order.id}`,
          html: html(orderDetails),
          attachments: [
            {
              filename: "product.png",
              cid: "unique@product.ee",
              path: orderDetails.order.cart.files[
                orderDetails.order.cart.files.length - 1
              ].preview_url,
            },
          ],
        });

      //TODO add nodemailer fulfilment
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // console.log(paymentIntent);
    // console.log(event);
    // console.log(event?.data);
  } catch (err: Error | any) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Return a 200 res to acknowledge receipt of the event
  res.status(200).send("");
}

function html(orderDetails) {
  console.log("htmlOrderEmail", orderDetails);
  console.log(
    "htmlOrderPreview",
    orderDetails.order.cart.files[orderDetails.order.cart.files.length - 1]
      .preview_url
  );
  const brandColor = "#06b6d4";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };
  //TODO clean up email login design
  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${
      color.mainBackground
    }; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
          color.text
        };">
       <strong>Thanks</strong> for your order.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
          <td>
          "${JSON.stringify(orderDetails)}"
          <img src="cid:unique@product.ee" width="400" height="400" />
          </td>
            <td align="center" style="border-radius: 5px;" bgcolor="${
              color.buttonBackground
            }"><a href="https://torquetricking.com/account"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${
                  color.buttonText
                }; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${
    color.buttonBorder
  }; display: inline-block; font-weight: bold;">See Account</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
          color.text
        };">
        We appreciate your order!
      </td>
    </tr>
  </table>
</body>
`;
}
