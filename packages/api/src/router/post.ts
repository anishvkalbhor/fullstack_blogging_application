import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts, postToCategories, categories } from "../../../db/src/schema";
import { createPostSchema } from "../validation";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const newPost = await tx
          .insert(posts)
          .values({
            title: input.title,
            content: input.content,
            slug: input.slug,
          })
          .returning();

        const postId = newPost[0].id;

        await tx.insert(postToCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: postId,
            categoryId: categoryId,
          }))
        );
        return newPost[0];
      });
    }),

  all: publicProcedure
    .input(z.object({ categorySlug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { categorySlug } = input;

      const postsWithCategories = await ctx.db.query.posts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],

        with: {
          postToCategories: {
            with: {
              category: true,
            },
          },
        },

        where: (posts, { exists }) =>
          categorySlug
            ? exists(
                ctx.db
                  .select()
                  .from(postToCategories)
                  .innerJoin(
                    categories,
                    eq(postToCategories.categoryId, categories.id)
                  )
                  .where(
                    and(
                      eq(postToCategories.postId, posts.id),
                      eq(categories.slug, categorySlug)
                    )
                  )
              )
            : undefined,
      });

      return postsWithCategories.map((post) => ({
        ...post,
        categories: post.postToCategories.map((ptc) => ptc.category),
      }));
    }),

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
});
