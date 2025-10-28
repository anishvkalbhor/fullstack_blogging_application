import { createTRPCRouter } from './trpc';
import { postRouter } from './router/post';
import { categoryRouter } from './router/category';

export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;