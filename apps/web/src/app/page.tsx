import { Suspense } from 'react';
import { api } from '@/trpc/server-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CategoryFilters } from '@/components/blog/category-filters';
import { PostCard } from '@/components/blog/post-card';

export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: {
    category?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const categorySlug = params?.category;

  const posts = await api.post.all({ categorySlug });

  return (
    <main className="container mx-auto py-12">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Recent Blog Posts</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/categories">Manage Categories</Link>
          </Button>
          <Button asChild>
            <Link href="/posts/create">Create Post</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div className="h-10 mb-8 w-full animate-pulse bg-muted rounded-lg" />}>
        <CategoryFilters activeSlug={categorySlug} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          // @ts-expect-error Server Component type mismatch
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center col-span-full py-12">
          <h2 className="text-2xl font-semibold">No posts found</h2>
          <p className="text-muted-foreground">
            Try adjusting your filters or create a new post.
          </p>
        </div>
      )}
    </main>
  );
}
