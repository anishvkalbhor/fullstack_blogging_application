import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts } from '../../../db/src/schema';
import { createPostSchema } from "../validation";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const postRouter = createTRPCRouter({
    create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input}) => {
        const newPost = await ctx.db.insert(posts).values(input).returning();
        return newPost[0];
    }),

    all: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.posts.findMany();
    }),

    getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
        const post = await ctx.db.query.posts.findFirst({
            where: eq(posts.slug, input.slug),
        });

        if(!post) {
            throw new Error('Post not found');
        }
        return post;
    }),
});