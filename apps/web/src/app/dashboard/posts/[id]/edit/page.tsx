import { api } from '@/trpc/server-client';
import { PostForm } from '@/components/blog/post-form';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

// This is a Server Component
export default async function EditPostPage({ params }: EditPostPageProps) {
  const postId = Number(params.id);

  if (isNaN(postId)) {
    notFound();
  }

  // Fetch categories and the specific post data in parallel
  const [categories, postData] = await Promise.all([
    api.category.all(),
    api.post.getById({ id: postId }).catch(() => null), 
  ]);

  if (!postData) {
    notFound();
  }

  
  const formInitialData = {
    ...postData,
    content: postData.content ?? undefined,
  };

  return (
    <main className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Edit Post</h1>
      
      <PostForm categories={categories} initialData={formInitialData} />
    </main>
  );
}

