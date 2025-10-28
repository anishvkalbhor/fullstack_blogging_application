import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { categories } from '../../../db/src/schema';

// Zod schema for creating a category
const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
});

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