import { Suspense } from 'react';
import { api } from '@/trpc/server-client';
import { PostCard } from '@/components/blog/post-card';
import { CategoryFilters } from '@/components/blog/category-filters';
import { PaginationControls } from '@/components/blog/pagination-controls'; // 1. Import

export const dynamic = 'force-dynamic';
const POSTS_PER_PAGE = 6; // Changed from 9 to 6

interface BlogPageProps {
  searchParams: {
    category?: string;
    search?: string;
    page?: string; // 2. Page is a string
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params?.category;
  const searchQuery = params?.search;
  const currentPage = Number(params?.page) || 1; // 3. Get current page

  // 4. Fetch paginated data with limit of 6
  const { posts, totalCount } = await api.post.all({
    categorySlug,
    search: searchQuery,
    page: currentPage,
    limit: POSTS_PER_PAGE, // Now this will be 6
  });

  // 5. Calculate total pages (now based on 6 posts per page)
  const pageCount = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      {searchQuery ? (
        <h1 className="text-4xl font-bold mb-8">
          Results for: "{searchQuery}"
        </h1>
      ) : (
        <h1 className="text-4xl font-bold mb-8">All Posts</h1>
      )}

      <Suspense
        fallback={
          <div className="h-10 mb-8 w-full animate-pulse bg-muted rounded-lg" />
        }
      >
        <CategoryFilters activeSlug={categorySlug} />
      </Suspense>

      {/* Grid layout - perfectly suits 6 cards */}
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

      {/* Pagination - will show when more than 6 posts exist */}
      {pageCount > 1 && (
        <div className="mt-12 flex justify-center">
          <PaginationControls
            pageCount={pageCount}
            currentPage={currentPage}
          />
        </div>
      )}
    </main>
  );
}