import { NextResponse } from "next/server";
import { db } from "../../../../../../../packages/db/src/index";
import { categories, postToCategories } from "../../../../../../../packages/db/src/schema";
import { categorySchema } from "@/lib/validation/categories";
import { eq } from "drizzle-orm";

// ✅ Next.js 15+ makes route params a Promise
interface RouteContext {
  params: Promise<{ id: string }>;
}

/* -----------------------------------------
 ✏️ PUT — Update Category
----------------------------------------- */
export async function PUT(request: Request, context: RouteContext) {
  try {
    // ✅ Unwrap the params Promise
    const { id } = await context.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    // 🧾 Parse and validate incoming JSON
    const json = await request.json();
    const body = categorySchema.partial().parse(json); // partial = only updates provided fields

    // 🛠️ Update the category
    const updatedCategory = await db
      .update(categories)
      .set({ ...body })
      .where(eq(categories.id, categoryId))
      .returning();

    if (updatedCategory.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // ✅ Return updated category
    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: "Failed to update category" }, { status: 500 });
  }
}

/* -----------------------------------------
 🗑️ DELETE — Delete Category (with cleanup)
----------------------------------------- */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    // ✅ Unwrap the params Promise
    const { id } = await context.params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    // 🧹 Step 1: Delete all related rows in post_to_categories
    await db.delete(postToCategories).where(eq(postToCategories.categoryId, categoryId));

    // 🗑️ Step 2: Delete the category itself
    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (deletedCategory.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // ✅ Step 3: Return success response
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}

console.log("SERVER-SIDE DATABASE_URL:", process.env.DATABASE_URL);
