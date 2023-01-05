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
      where: { email: ctx.session.user.email as string },
      include: { user: true },
    });
  }),
  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.orders.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  setUserDetails: protectedProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      console.log(ctx.session.user.email);
      return ctx.prisma.address.upsert({
        where: { email: ctx.session.user.email as string },
        update: {
          name: input.name,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          state_code: input.state_code,
          country_code: input.country_code,
          state_name: input.state_name,
          country_name: input.country_name,
          zip: input.zip,
        },
        create: {
          email: ctx.session.user.email as string,
          name: input.name,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          state_code: input.state_code,
          country_code: input.country_code,
          state_name: input.state_name,
          country_name: input.country_name,
          zip: input.zip,
        },
      });
    }),
  createGuestUser: publicProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      let user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (user) {
        console.log(user);
        user;
      } else {
        user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            name: input.name,
          },
        });
      }

      console.log(user);
      const updateAddress = await ctx.prisma.address.upsert({
        where: { email: input.email },
        update: {
          name: input.name,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          state_code: input.state_code,
          country_code: input.country_code,
          state_name: input.state_name,
          country_name: input.country_name,
          zip: input.zip,
        },
        create: {
          email: input.email,
          name: input.name,
          address1: input.address1,
          address2: input.address2,
          city: input.city,
          state_code: input.state_code,
          country_code: input.country_code,
          state_name: input.state_name,
          country_name: input.country_name,
          zip: input.zip,
        },
      });

      return { user, address: updateAddress };
      console.log(updateAddress);
    }),
});
