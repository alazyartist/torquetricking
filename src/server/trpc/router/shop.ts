import { router, publicProcedure, protectedProcedure } from "../trpc";
import { object, z } from "zod";
import printfulApi from "../../../utils/printfulAPI";
import { SyncVariant } from "../../../types/SyncVariant";

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
