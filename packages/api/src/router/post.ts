import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts } from '../../../db/src/schema';

const createPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    content: z.string().optional(),
    slug: z.string().min(3, "Slug must be at least 3 characters long").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

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
});