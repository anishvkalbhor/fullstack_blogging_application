import { Suspense } from 'react';
import { api } from '@/trpc/server-client';
import { PostCard } from '@/components/blog/post-card';
import { CategoryFilters } from '@/components/blog/category-filters';
import { PaginationControls } from '@/components/blog/pagination-controls';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';
const POSTS_PER_PAGE = 6;

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

// Define the post interface based on your API response
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const searchQuery = params.search;
  const currentPage = Number(params.page) || 1;

  const { posts, totalCount } = await api.post.all({
    categorySlug,
    search: searchQuery,
    page: currentPage,
    limit: POSTS_PER_PAGE,
  });

  const pageCount = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main className="container mx-auto py-8 md:py-12 px-4 md:px-6 max-w-7xl">
      
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex-1">
          {searchQuery ? (
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Search Results
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Found {totalCount} result{totalCount !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                All Posts
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover {totalCount} article{totalCount !== 1 ? 's' : ''} and insights
              </p>
            </div>
          )}
        </div>
        
        {/* Create Post Button - Responsive */}
        <div className="shrink-0">
          <Button asChild size="default" className="w-full sm:w-auto">
            <Link href="/posts/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Create New Post</span>
              <span className="xs:hidden">Create</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <Suspense
        fallback={
          <div className="h-10 mb-6 md:mb-8 w-full animate-pulse bg-muted rounded-lg" />
        }
      >
        <CategoryFilters activeSlug={categorySlug} />
      </Suspense>

      {/* Posts Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-16 md:py-20 px-4">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">No posts found</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {searchQuery 
                ? "Try adjusting your search terms or browse all posts." 
                : "No posts have been created yet. Be the first to share your thoughts!"
              }
            </p>
            <div className="pt-4">
              <Button asChild>
                <Link href={searchQuery ? "/blog" : "/posts/create"}>
                  {searchQuery ? "Browse All Posts" : "Create First Post"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-12 md:mt-16 flex justify-center px-4">
          <PaginationControls
            pageCount={pageCount}
            currentPage={currentPage}
          />
        </div>
      )}
      
      {/* Page Info for Mobile */}
      {pageCount > 1 && (
        <div className="mt-4 text-center text-sm text-muted-foreground sm:hidden">
          Page {currentPage} of {pageCount}
        </div>
      )}
    </main>
  );
}