import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts, postToCategories, categories } from "../../../db/src/schema";
import { createPostSchema } from "../validation";
import { eq, and, desc, inArray, or, sql, type SQL } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { ilike } from "drizzle-orm";

function coalesce<T extends PgColumn | SQL>(
  column: T,
  defaultValue: string | number | SQL
): SQL {
  return sql`coalesce(${column}, ${defaultValue})`;
}

export const postRouter = createTRPCRouter({
  // --- CREATE POST ---
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
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
    .input(
      z.object({
        categorySlug: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, search } = input;

      // Initialize conditions array with the published condition
      const conditions = [eq(posts.published, true)];

      if (search) {
        const query = `%${search}%`;
        conditions.push(
          // @ts-ignore – column might be nullable but it’s fine for this query
          or(
            ilike(posts.title, query),
            ilike(sql`${posts.content}`, query),
            ilike(sql`${posts.authorName}`, query)
          )
        );
      }

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

        if (
          !selectedCategory ||
          selectedCategory.postToCategories.length === 0
        ) {
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
          allPosts.map((p) => p.id)
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
        throw new Error("Post not found");
      }

      return post;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new Error("Post not found");
      }

      const relations = await ctx.db.query.postToCategories.findMany({
        where: eq(postToCategories.postId, input.id),
        columns: {
          categoryId: true,
        },
      });

      return {
        ...post,
        categoryIds: relations.map((r) => r.categoryId),
      };
    }),

  update: publicProcedure
    .input(
      createPostSchema.extend({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...postInput } = input;

      return ctx.db.transaction(async (tx) => {
        // 1. Update the post itself
        const updatedPost = await tx
          .update(posts)
          .set({ ...postInput, updatedAt: new Date() })
          .where(eq(posts.id, id))
          .returning();

        // 2. Delete all existing category relationships for this post
        await tx
          .delete(postToCategories)
          .where(eq(postToCategories.postId, id));

        // 3. Insert the new category relationships
        if (categoryIds && categoryIds.length > 0) {
          const newRelations = categoryIds.map((catId) => ({
            postId: id,
            categoryId: catId,
          }));
          await tx.insert(postToCategories).values(newRelations);
        }
        return updatedPost[0];
      });
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
      })
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
