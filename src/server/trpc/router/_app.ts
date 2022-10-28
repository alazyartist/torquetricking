// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { shopRouter } from "./shop";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  shop: shopRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
