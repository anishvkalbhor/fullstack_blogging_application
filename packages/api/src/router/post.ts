import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { posts, postToCategories, categories } from '../../../../packages/db/src/schema';
import { createPostSchema, updatePostSchema } from '../validation';
import { eq, and, desc, inArray, or, sql, type SQL, count } from 'drizzle-orm';
import { type PgColumn } from 'drizzle-orm/pg-core';
import { ilike } from 'drizzle-orm';
import { put } from '@vercel/blob';

function coalesce<T extends PgColumn | SQL>(
  column: T,
  defaultValue: string | number | SQL,
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

  uploadImage: publicProcedure
  .input(
    z.object({
      base64: z.string(),
      filename: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      throw new Error('Blob storage token is not configured');
    }

    const buffer = Buffer.from(input.base64.split(',')[1], 'base64');

    const blob = await put(input.filename, buffer, {
      access: 'public',
      addRandomSuffix: true,
      token: blobToken,
    });
    return blob;
  }),

  all: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        search: z.string().optional(),
        page: z.number().min(1).max(50).optional().default(1),
        limit: z.number().min(1).max(50).optional().default(9),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, search, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(posts.published, true)];

      if (search) {
        const query = `%${search}%`;
        conditions.push(
          // @ts-ignore – column might be nullable but it’s fine for this query
          or(
            ilike(posts.title, query),
            ilike(coalesce(posts.content, sql`''`), query),
            ilike(coalesce(posts.authorName, sql`''`), query),
          ),
        );
      }

      if (categorySlug) {
        const categorySubquery = ctx.db
          .select({ postId: postToCategories.postId })
          .from(categories)
          .leftJoin(
            postToCategories,
            eq(categories.id, postToCategories.categoryId),
          )
          .where(eq(categories.slug, categorySlug));

        conditions.push(inArray(posts.id, categorySubquery));
      }

      // --- Run queries in parallel ---
      const totalQuery = ctx.db
        .select({ count: count() })
        .from(posts)
        .where(and(...conditions));

      const dataQuery = ctx.db
        .select()
        .from(posts)
        .where(and(...conditions))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      const [[{ count: totalCount }], allPosts] = await Promise.all([
        totalQuery,
        dataQuery,
      ]);

      if (allPosts.length === 0) {
        return { posts: [], totalCount: 0 };
      }

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
          // Convert dates to strings
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        };
      });

      // 6. FIX: Return the correct object structure
      return { posts: postsWithCategories, totalCount };
    }),

  // --- 2. MODIFIED `allForDashboard` PROCEDURE ---
  allForDashboard: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).optional().default(1),
        limit: z.number().min(1).max(50).optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      // Run queries in parallel
      const totalQuery = ctx.db.select({ count: count() }).from(posts);
      const dataQuery = ctx.db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      const [[{ count: totalCount }], allPosts] = await Promise.all([
        totalQuery,
        dataQuery,
      ]);

      return { posts: allPosts, totalCount };
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

  // --- GET POST BY ID (for editing) ---
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new Error('Post not found');
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

  // --- UPDATE POST ---
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: updatePostSchema, 
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const categoryIds = (data as { categoryIds?: number[] | undefined }).categoryIds;
      const postInput = (({ categoryIds, ...rest }: any) => rest)(data);

      return ctx.db.transaction(async (tx) => {
        // 1. Update the post itself
        const updatedPost = await tx
          .update(posts)
          .set({ ...postInput, updatedAt: new Date() })
          .where(eq(posts.id, id))
          .returning();

        // 2. Delete all existing category relationships
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

  // --- UPDATE PUBLISHED STATUS ---
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