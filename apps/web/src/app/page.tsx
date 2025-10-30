import Link from 'next/link';
import { api } from '@/trpc/server-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function Home() {
  // 1. Fetch data directly from your tRPC API
  const posts = await api.post.all();

  return (
    <main className="container mx-auto max-w-4xl py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">All Blog Posts</h1>
        {/* We will make this link work soon */}
        <Button asChild>
          <Link href="/posts/create">Create Post</Link>
        </Button>
      </div>

      {/* 2. Render the list of posts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  Published on: {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3">
                  {post.content ?? 'No content...'}
                </p>
                <Button asChild variant="outline">
                  {/* This link will go to the individual post page */}
                  <Link href={`/posts/${post.slug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}