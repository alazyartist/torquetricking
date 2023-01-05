import { router, publicProcedure, protectedProcedure } from "../trpc";
import { object, z } from "zod";
import printfulApi from "../../../utils/printfulAPI";
import { SyncVariant } from "../../../types/SyncVariant";
import { env } from "../../../env/server.mjs";
import Stripe from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export const shopRouter = router({
  getItems: publicProcedure.query(async () => {
    const data = await printfulApi.get("/sync/products");
    return data.data.result;
  }),
  getItemsById: publicProcedure
    .input(z.number().nullish())
    .query(async ({ input }) => {
      const data = await printfulApi.get(`/sync/products/${input}`);
      return data.data.result;
    }),
  getAllUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getSecretKey: publicProcedure.query(async () => {
    return env.STRIPE_PUBLIC_KEY;
  }),
  estimateCart: publicProcedure
    .input(z.object({ recipient: z.any(), items: z.array(z.any()) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const estimate = await printfulApi.post("/orders/estimate-costs", {
          recipient: input.recipient,
          items: input.items,
        });
        console.log(estimate);
        return estimate.data.result;
      } catch (err) {
        console.log(err);
      }
    }),
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        cart: z.array(z.any()),
        amount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const checkoutSession = await stripe.paymentIntents.create({
          currency: "usd",
          amount: Math.ceil(input.amount * 100),
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            user_id: input.user_id,
            amount: Math.ceil(input.amount),
            products: JSON.stringify(input.cart?.map((item) => item.id)),
          },
        });

        const checkoutOrderDetails = await ctx.prisma.user.update({
          where: { id: input.user_id },
          data: {
            orders: {
              create: {
                paymentIntent: checkoutSession.id,
                amount: input.amount,
                cart: input.cart,
                shipping: "STANDARD",
              },
            },
          },
          include: { orders: true },
        });

        console.log(checkoutOrderDetails);
        return { clientSecret: checkoutSession.client_secret };
      } catch (err) {
        console.log(err);
      }
    }),
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        product: z.any(),
        amount: z.number(),
        shipping: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("recreatingPaymentIntent");
      console.log();

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          currency: "usd",
          amount: input.amount * 100,
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            user_id: input.user_id,
            amount: input.amount,
            product: JSON.stringify(input.product.id),
          },
        });
        const orderDetails = await ctx.prisma.user.update({
          where: { id: input.user_id },
          data: {
            orders: {
              create: {
                paymentIntent: paymentIntent.id,
                amount: input.amount,
                cart: [input.product],
                shipping: input.shipping,
              },
            },
          },
          include: { orders: true },
        });
        console.log(orderDetails);
        return { clientSecret: paymentIntent.client_secret };
      } catch (err) {
        console.log(err);
      }
    }),
  getStateCode: publicProcedure.query(async () => {
    try {
      const data = await printfulApi.get("/states");
      return data.data;
    } catch (err) {
      console.log(err);
    }
  }),
  getCountryCode: publicProcedure.query(async () => {
    try {
      const data = await printfulApi.get("/countries");
      return data.data;
    } catch (err) {
      console.log(err);
    }
  }),
  calculateShipping: publicProcedure
    .input(z.object({ recipient: z.any(), items: z.array(z.any()) }))
    .mutation(async ({ input }) => {
      try {
        console.log(input.recipient);
        const data = await printfulApi.post("/shipping/rates", {
          recipient: input?.recipient,
          items: input?.items,
        });
        console.log(data);
        return data.data;
      } catch (err) {
        console.log(err);
      }
    }),
  getOrderDetails: publicProcedure
    .input(z.object({ user_id: z.string(), paymentIntent: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        console.log(input);
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.user_id },
          include: { address: true },
        });
        const order = await ctx.prisma.orders.findUnique({
          where: { paymentIntent: input.paymentIntent },
        });
        console.log(user, order);
        return { user, order };
      } catch (err) {
        console.log(err);
      }
    }),
  buyNow: publicProcedure
    .input(
      z
        .object({
          items: z.any(),
          recipient: z.any(),
          paymentIntent: z.string(),
          shipping: z.string(),
          // {
          //   name: z.string(),
          //   address1: z.string(),
          //   city: z.string(),
          //   state_name: z.string(),
          //   country_name: z.string(),
          //   zip: z.string(),
          //   email: z.string(),
          // },
        })
        .nullish()
    )
    .mutation(async ({ input, ctx }) => {
      // console.log(input.input?.variant);
      const items = input?.items;
      const r = input?.recipient;
      try {
        const data = await printfulApi.post(
          "/orders",
          { items: items, recipient: r },
          { withCredentials: true }
        );
        console.log("purchased(buyNow)", data.data.result);
        const updateOrder = await ctx.prisma.orders.update({
          where: { paymentIntent: input?.paymentIntent },
          data: { printful_id: data.data.result.id.toString() },
        });
        console.log(updateOrder);
      } catch (err) {
        console.log(err);
      }
    }),
});
