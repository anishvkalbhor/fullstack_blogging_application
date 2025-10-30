import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  description: text("description"),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
});

// 2. Blog Posts Table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Post-Category Relationsips (Many-to-Many Join Table)
export const postToCategories = pgTable(
  "post_to_categories",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
  })
);

// Relations
// Define how the tables relate to each other for Drizzle's query builder

//A Category can have many posts through postToCategories
export const categoriesRelations = relations(categories, ({ many }) => ({
  postToCategories: many(postToCategories),
}));

// A Post can have many categories through postToCategories
export const postsRelations = relations(posts, ({ many }) => ({
  postToCategories: many(postToCategories),
}));

// Define relations for the join table
export const postToCategoriesRelations = relations(
  postToCategories,
  ({ one }) => ({
    // Each entry in the join table belongs to one category
    category: one(categories, {
      fields: [postToCategories.categoryId],
      references: [categories.id],
    }),
    // Each entry in the join table belongs to one post
    post: one(posts, {
      fields: [postToCategories.postId],
      references: [posts.id],
    }),
  })
);
