import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";
import { buffer } from "micro";
import { createContext } from "../../../server/trpc/context";

import { appRouter } from "../../../server/trpc/router/_app";
import { mailer } from "../../../utils/nodemailer";
import { SyncVariant } from "../../../types/SyncVariant.js";
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
      case "payment_intent.created":

      //Code Below useful for testing. it is a copy of payment.intent.succeeded
      // console.log("created", event.data);
      // const orderDetailstest = await caller.shop.getOrderDetails({
      //   user_id: paymentIntent.metadata.user_id as string,
      //   paymentIntent: paymentIntent.id,
      // });
      // console.log("cart", orderDetailstest?.order.cart);
      // // const purchased = await caller.shop.buyNow({
      // //   recipient: { ...orderDetailstest?.user.address },
      // //   items: [orderDetailstest?.order.cart],
      // //   shipping: orderDetailstest?.order.shipping,
      // //   paymentIntent: paymentIntent.id,
      // // });
      // await mailer.sendMail({
      //   to: orderDetailstest?.user.email,
      //   from: "torquetricking@gmail.com",
      //   subject: `Thanks for your purchase - Order ${orderDetailstest?.order.id}`,
      //   html: html(orderDetailstest),
      // });
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
        // console.log("orderDetails", orderDetails);
        caller.shop.buyNow({
          recipient: { ...orderDetails?.user.address },
          items: orderDetails?.order.cart,
          shipping: orderDetails?.order.shipping,
          paymentIntent: paymentIntent.id,
        });

        await mailer.sendMail({
          to: orderDetails?.user.email,
          from: "torquetricking@gmail.com",
          subject: `Thanks for your purchase - Order ${orderDetails?.order.id}`,
          html: html(orderDetails),
        });

        //TODO add nodemailer fulfilment
        // ... handle other event types
        break;
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

function html(orderDetails: any) {
  console.log("htmlOrderEmail", orderDetails);
  let { user, order } = orderDetails;
  console.log(
    "htmlOrderPreview",
    orderDetails.order.cart.map(
      (item: any) => item.files[item.files.length - 1].preview_url
    )
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
  <body style="background: ${
    color.background
  }; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
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
    <td>
    <h1>
    Thanks ${user.address.name},
    </h1>
    
    <div style="display:flex gap:4px">
      <div>
      You ordered:<br/>
      ${order.cart.map(
        (item: SyncVariant) =>
          `<div>
        <p>${item.name}${"  "}${item.retail_price}</p>
        </div>`
      )}
        ${order.amount}$</br>
        ${order.shipping} Shipping</br>
      <p>Your Order will be shipped to</p>
      <p>${user.address.name}<br/>
            ${user.address.address1}<br/>
            ${user.address.address2 ? user.address.address2 + "<br/>" : ""}
          ${user.address.city},${user.address.state_code},${
    user.address.country_code
  }</p>
      </div>
    </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
     ${order.cart.map(
       (item: any) => `<tr>
        <td>
        <img src="${
          item.files[item.files.length - 1].preview_url
        }" alt="Product image" />
        </td>
        </tr>`
     )}
          <tr>
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
        We appreciate your support! This purchase helps fund the <a href="https://trickedex.app" target="_blank">Trickedex</a>
      </td>
    </tr>
    <tr>
    <p style="padding: 2px 2px; color:#555">
    The following values will be needed for any returns.<br/>
    pid:${order.printful_id}<br/>
    sid:${order.paymentIntent}</br>
    </p>
    </tr>
  </table>
</body>
`;
}
