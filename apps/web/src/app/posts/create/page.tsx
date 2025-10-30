import { api } from '@/trpc/server-client';
import { PostForm } from '@/components/blog/post-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This is now a Server Component
export default async function CreatePostPage() {
  // 1. Fetch categories on the server
  const categories = await api.category.all();

  return (
    <main className="container mx-auto max-w-2xl py-12">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/dashboard">&larr; Back to Dashboard</Link>
      </Button>
      <h1 className="mb-8 text-4xl font-bold">Create New Post</h1>
      
      {/* 2. Render the reusable PostForm component.
        This component contains the Rich Text Editor.
      */}
      <PostForm categories={categories} />
    </main>
  );
}

