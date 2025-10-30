import Link from 'next/link';
import { api } from '@/trpc/server-client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeletePostButton } from '@/components/blog/delete-post-button';
import { MoreHorizontal } from 'lucide-react';
import { PublishSwitch } from '@/components/blog/publish-switch';
import { PaginationControls } from '@/components/blog/pagination-controls'; // 1. Import

export const dynamic = 'force-dynamic';
const POSTS_PER_PAGE = 10; // Define a limit

interface DashboardPageProps {
  searchParams: {
    page?: string; // 2. Page is a string
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1; // 3. Get current page

  // 4. Fetch paginated data
  const { posts, totalCount } = await api.post.allForDashboard({
    page: currentPage,
    limit: POSTS_PER_PAGE,
  });

  // 5. Calculate total pages
  const pageCount = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/posts/create">Create New Post</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <PublishSwitch
                      postId={post.id}
                      initialChecked={post.published}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/posts/${post.id}/edit`}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DeletePostButton postId={post.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 6. Render Pagination */}
      {pageCount > 1 && (
        <PaginationControls
          pageCount={pageCount}
          currentPage={currentPage}
        />
      )}
    </main>
  );
}