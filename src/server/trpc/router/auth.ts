import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  getUserDetails: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.address.findUnique({
      where: { email: ctx.session.user.email },
      include: { user: true },
    });
  }),
  setUserDetails: protectedProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      console.log(ctx.session.user.email);
      return ctx.prisma.address.upsert({
        where: { email: ctx.session.user.email },
        update: { ...input },
        create: {
          email: ctx.session.user.email,
          ...input,
        },
      });
    }),
});
