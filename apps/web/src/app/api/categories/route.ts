import { NextResponse } from 'next/server';
import { db } from '../../../../../../packages/db/src/index';
import { categories } from '../../../../../../packages/db/src/schema';
import { categorySchema } from '../../../lib/validation/categories';

export async function GET() {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.name);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = categorySchema.parse(json);

    const newCategory = await db.insert(categories).values({
      name: body.name,
      slug: body.slug,
      description: body.description,
    }).returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}