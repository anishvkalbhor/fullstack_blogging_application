import { createTRPCRouter, publicProcedure } from '../trpc';
import { categories, postToCategories } from '../../../db/src/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

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
    return ctx.db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
  }),

  // Update Category
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: createCategorySchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCategory = await ctx.db
        .update(categories)
        .set(input.data)
        .where(eq(categories.id, input.id))
        .returning();
      return updatedCategory[0];
    }),

  // Delete Category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        // Dissociate posts from the category
        await tx
          .delete(postToCategories)
          .where(eq(postToCategories.categoryId, input.id));
        // Delete the category
        const deletedCategory = await tx
          .delete(categories)
          .where(eq(categories.id, input.id))
          .returning();
        return deletedCategory[0];
      });
    }),
});