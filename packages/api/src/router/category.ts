import { createTRPCRouter, publicProcedure } from '../trpc';
import { categories } from '../../../db/src/schema';

import { createCategorySchema } from '../validation';

export const categoryRouter = createTRPCRouter({
  // Create Category
  create: publicProcedure
    .input(createCategorySchema) // Zod validation
    .mutation(async ({ ctx, input }) => {
      const newCategory = await ctx.db.insert(categories).values(input).returning();
      return newCategory[0];
    }),

  // Get All Categories
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.categories.findMany();
  }),
});