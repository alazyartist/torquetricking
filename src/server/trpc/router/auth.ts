import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  getUserDetails: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.adress.findUnique({
      where: { email: ctx.session.user.email },
    });
  }),
  setUserDetails: protectedProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      return;
    }),
});
