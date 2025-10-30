import { z} from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    content: z.string().optional(),
    slug: z.string().min(3, "Slug must be at least 3 characters long").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export const createCategorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters long"),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z.string().optional(),
});