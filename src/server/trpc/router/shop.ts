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
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        user_id: z.string().optional(),
        product: z.any().optional(),
        amount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
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
        console.log(paymentIntent);
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
  buyNow: publicProcedure
    .input(
      z
        .object({
          variant: z.any(),
          recipient: z.any(),
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
    .mutation(async (input) => {
      // console.log(input.input?.variant);
      let v = input.input?.variant;
      let r = input.input?.recipient;
      try {
        const data = await printfulApi.post(
          "/orders",
          { items: [v], recipient: r },
          { withCredentials: true }
        );
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }),
});
