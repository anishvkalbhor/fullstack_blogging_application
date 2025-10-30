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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeletePostButton } from '@/components/blog/delete-post-button';
import { MoreHorizontal } from 'lucide-react';
import { PublishSwitch } from '@/components/blog/publish-switch'; // 1. Import the switch

// Force this page to be dynamic so it always fetches fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 2. Call the new dashboard-specific procedure
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
                    <Link href={`/posts/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {/* 3. Use the new switch component */}
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
                        {/* We'll add "Edit" here later */}
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
