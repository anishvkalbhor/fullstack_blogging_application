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
import { PaginationControls } from '@/components/blog/pagination-controls';

// 1. Import Card components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';
const POSTS_PER_PAGE = 10;

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  const { posts, totalCount } = await api.post.allForDashboard({
    page: currentPage,
    limit: POSTS_PER_PAGE,
  });

  const pageCount = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main className="container px-12 py-12">
      {/* 2. Use a Card for the main panel */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-4xl font-bold">Dashboard</CardTitle>
            <CardDescription>
              Manage your posts, view drafts, and publish.
            </CardDescription>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link href="/posts/create">Create New Post</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {/* --- 3. DESKTOP VIEW: TABLE --- */}
          {/* 'hidden md:block' -> hides on mobile, shows on desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-center">Status</TableHead>
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

          {/* --- 4. MOBILE VIEW: CARD LIST --- */}
          {/* 'md:hidden' -> shows on mobile, hides on desktop */}
          <div className="md:hidden space-y-4">
            {posts.length === 0 ? (
              <p className="text-center h-24">No posts found.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-md border p-4 flex flex-col gap-4"
                >
                  {/* Top: Title + Actions */}
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="font-medium hover:underline break-all line-clamp-2"
                    >
                      {post.title}
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="-mt-2 -mr-2 shrink-0"
                        >
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
                  </div>
                  {/* Bottom: Status + Date */}
                  <div className="flex items-end justify-between">
                    <PublishSwitch
                      postId={post.id}
                      initialChecked={post.published}
                    />
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>

        {/* 5. Pagination in the Footer */}
        {pageCount > 1 && (
          <CardFooter>
            <PaginationControls
              pageCount={pageCount}
              currentPage={currentPage}
            />
          </CardFooter>
        )}
      </Card>
    </main>
  );
}