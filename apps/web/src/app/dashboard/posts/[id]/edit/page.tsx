import { api } from '@/trpc/server-client';
import { PostForm } from '@/components/blog/post-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EditPostPageProps {
  params: Promise<{
    id: string; 
  }>;
}

// This is a Server Component
export default async function EditPostPage({ params: paramsPromise }: EditPostPageProps) {
  // 1. Await the params
  const params = await paramsPromise;
  const postId = Number(params.id);

  if (isNaN(postId)) {
    notFound();
  }

  // 2. Fetch categories and the specific post data in parallel
  const [categories, postData] = await Promise.all([
    api.category.all(),
    api.post.getById({ id: postId }).catch(() => null), // Handle not found
  ]);

  if (!postData) {
    notFound();
  }

  // 3. Transform data to match form expectations (null -> undefined)
  const formInitialData = {
    ...postData,
    content: postData.content ?? undefined,
    imageUrl: postData.imageUrl ?? undefined,
    // Ensure categoryIds is an array
    categoryIds: postData.categoryIds ?? [], 
  };

  return (
    <main className="container mx-auto max-w-2xl py-12">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/dashboard">&larr; Back to Dashboard</Link>
      </Button>
      <h1 className="mb-8 text-4xl font-bold">Edit Post</h1>
      
      {/* 4. Render the form, passing in the initial data */}
      <PostForm categories={categories} initialData={formInitialData} />
    </main>
  );
}