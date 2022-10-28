import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import printfulApi from "../../../utils/printfulAPI";

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
});
