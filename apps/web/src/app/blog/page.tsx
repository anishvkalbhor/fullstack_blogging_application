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
    <main className="container mx-auto max-w-6xl py-12">
      <h1 className="text-5xl font-bold mb-8">The Blog</h1>

      <CategoryFilters activeSlug={categorySlug} />

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg">
          No posts found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <PaginationControls
          pageCount={pageCount}
          currentPage={currentPage}
        />
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