import { Suspense } from 'react';
import { api } from '@/trpc/server-client';
import { PostCard } from '@/components/blog/post-card';
import { CategoryFilters } from '@/components/blog/category-filters';

// Force this page to be dynamic to read searchParams
export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // --- THIS IS THE FIX ---
  // You must 'await' the searchParams promise to get the object
  const params = await searchParams;
  const categorySlug = params?.category;
  const searchQuery = params?.search;
  // --- END FIX ---

  // 3. Pass both filters to the API
  const posts = await api.post.all({ categorySlug, search: searchQuery });

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      {/* 4. Show a dynamic title */}
      {searchQuery ? (
        <h1 className="text-4xl font-bold mb-8">
          Results for: "{searchQuery}"
        </h1>
      ) : (
        <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      )}

      {/* Render the Category Filters */}
      <Suspense
        fallback={
          <div className="h-10 mb-8 w-full animate-pulse bg-muted rounded-lg" />
        }
      >
        <CategoryFilters activeSlug={categorySlug} />
      </Suspense>

      {/* Render the Post List */}
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
            Try adjusting your filters or creating a new post.
          </p>
        </div>
      )}
    </main>
  );
}

