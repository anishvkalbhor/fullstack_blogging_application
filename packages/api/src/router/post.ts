import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
// 1. FIX: Use the 'db/schema' package alias
import { posts, postToCategories, categories } from '../../../db/src/schema';
import { createPostSchema } from '../validation';
import { eq, and, desc, inArray } from 'drizzle-orm';

export const postRouter = createTRPCRouter({
  // --- CREATE POST ---
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      // 2. FIX: Destructuring was backward.
      // The schema property is 'categoryIds', not 'categories'.
      const { categoryIds, ...postInput } = input;

      return ctx.db.transaction(async (tx) => {
        const newPost = await tx.insert(posts).values(postInput).returning();
        const postId = newPost[0].id;
        if (categoryIds && categoryIds.length > 0) {
          const relations = categoryIds.map((id) => ({
            postId: postId,
            categoryId: id,
          }));
          await tx.insert(postToCategories).values(relations);
        }
        return newPost[0];
      });
    }),

  // --- 1. MODIFIED `post.all` (FOR PUBLIC HOMEPAGE) ---
  all: publicProcedure
    .input(z.object({ categorySlug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { categorySlug } = input;

      // 3. FIX: Build 'where' conditions first, then 'orderBy' at the end.
      // You cannot call .where() after .orderBy().

      // Start with our base condition
      const conditions = [eq(posts.published, true)];

      // Conditionally add the category filter
      if (categorySlug) {
        const selectedCategory = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, categorySlug),
          with: {
            postToCategories: {
              columns: {
                postId: true,
              },
            },
          },
        });

        if (!selectedCategory || selectedCategory.postToCategories.length === 0) {
          return []; // No category found or category has no posts
        }

        const postIds = selectedCategory.postToCategories.map((p) => p.postId);
        // Add the category condition to our array
        conditions.push(inArray(posts.id, postIds));
      }

      // Build the final query
      const query = ctx.db
        .select()
        .from(posts)
        .where(and(...conditions)) // Apply all conditions
        .orderBy(desc(posts.createdAt)); // Apply orderBy last

      const allPosts = await query;
      if (allPosts.length === 0) return [];

      const allRelations = await ctx.db.query.postToCategories.findMany({
        where: inArray(
          postToCategories.postId,
          allPosts.map((p) => p.id),
        ),
        with: {
          category: true,
        },
      });

      const postsWithCategories = allPosts.map((post) => {
        const postCategories = allRelations
          .filter((r) => r.postId === post.id)
          .map((r) => r.category);
        return {
          ...post,
          categories: postCategories,
        };
      });

      return postsWithCategories.filter((p) => p);
    }),

  // --- 2. NEW `allForDashboard` PROCEDURE ---
  allForDashboard: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
    });
  }),

  // --- GET POST BY SLUG ---
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    }),

  // --- DELETE POST ---
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        await tx
          .delete(postToCategories)
          .where(eq(postToCategories.postId, input.id));
        const deletedPost = await tx
          .delete(posts)
          .where(eq(posts.id, input.id))
          .returning();
        return deletedPost[0];
      });
    }),

  // --- 3. NEW `updatePublishedStatus` MUTATION ---
  updatePublishedStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedPost = await ctx.db
        .update(posts)
        .set({ published: input.published, updatedAt: new Date() })
        .where(eq(posts.id, input.id))
        .returning();

      return updatedPost[0];
    }),
});