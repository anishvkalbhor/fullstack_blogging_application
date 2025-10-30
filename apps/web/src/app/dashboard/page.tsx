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
  DropdownMenuItem, // 1. Import DropdownMenuItem
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeletePostButton } from '@/components/blog/delete-post-button';
import { MoreHorizontal } from 'lucide-react';
import { PublishSwitch } from '@/components/blog/publish-switch';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const posts = await api.post.allForDashboard();

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
                        {/* 2. ADD THIS "EDIT" LINK */}
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/posts/${post.id}/edit`}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {/* The Delete button is a client component */}
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
    </main>
  );
}