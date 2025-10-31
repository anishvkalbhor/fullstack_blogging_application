import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/server-client';
import { HeroSearch } from '@/components/blog/hero-search';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Category = {
  id: number;
  name: string;
  slug: string;
};
type PostWithCategories = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  createdAt: string;
  authorName: string;
  imageUrl: string | null;
  categories: Category[];
};

export default async function LandingPage() {
  const { posts: recentPosts } = (await api.post.all({
    page: 1,
    limit: 3,
  })) as { posts: PostWithCategories[] };

  if (!recentPosts || recentPosts.length === 0)
    return (
      <section className="bg-background py-20 md:py-28 text-center">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Posts</h2>
          <p className="text-muted-foreground">No posts published yet.</p>
        </div>
      </section>
    );

  const [mainPost, ...sidePosts] = recentPosts;

  return (
    <div className="grow">
      {/* Hero Section */}
      <section className="relative container max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 md:px-6 overflow-hidden">
        <StripedPattern
          id="hero-stripes"
          className="absolute inset-0 z-[-1] w-full h-full object-cover opacity-[0.03]"
        />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Find Your Next Great Read
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
          A minimalist, professional blogging platform built with the latest full-stack
          technologies.
        </p>
        <HeroSearch />
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Recent blog posts
            </h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Discover our latest insights, tutorials, and updates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link
              href={`/posts/${mainPost.slug}`}
              className="group relative col-span-2 overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
            >
              <img
                src={
                  mainPost.imageUrl ||
                  `https://placehold.co/800x500/f3e8ff/6d28d9?text=${encodeURIComponent(
                    mainPost.title,
                  )}`
                }
                alt={mainPost.title}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">
                    {mainPost.authorName}
                  </span>
                  <span>•</span>
                  <time>
                    {new Date(mainPost.createdAt).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <h3 className="text-2xl font-semibold leading-snug mb-2 group-hover:text-purple-600 transition-colors wrap-break-word">
                  {mainPost.title}
                </h3>
                <p className="text-sm text-muted-foreground wrap-break-word line-clamp-2">
                  {mainPost.content
                    ? mainPost.content.replace(/<[^>]*>/g, '').slice(0, 140) + '…'
                    : 'No content available.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mainPost.categories?.slice(0, 3).map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="outline"
                      className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-100"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>

            <div className="flex flex-col gap-8">
              {sidePosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="group flex gap-5 overflow-hidden rounded-2xl border border-border bg-card hover:shadow-md transition-all"
                >
                  <img
                    src={
                      post.imageUrl ||
                      `https://placehold.co/400x300/f3e8ff/6d28d9?text=${encodeURIComponent(
                        post.title,
                      )}`
                    }
                    alt={post.title}
                    className="h-36 w-40 object-cover shrink-0 rounded-l-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="flex flex-col justify-center p-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground">
                        {post.authorName}
                      </span>{' '}
                      •{' '}
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <h4 className="text-base font-semibold leading-snug mb-1 group-hover:text-purple-600 transition-colors wrap-break-word">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground wrap-break-word line-clamp-2">
                      {post.content
                        ? post.content.replace(/<[^>]*>/g, '').slice(0, 80) + '…'
                        : 'No content available.'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.categories?.slice(0, 2).map((cat) => (
                        <Badge
                          key={cat.id}
                          variant="outline"
                          className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-100"
                        >
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              View all posts
            </Link>
          </div>
        </div>
      </section>

      <section className="container max-w-5xl mx-auto text-center py-20 md:py-32 px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Explore All Our Articles
        </h2>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
          Dive into our full collection of posts on design, software, research,
          and more.
        </p>
        <Button asChild size="lg">
          <Link href="/blog">View All Posts</Link>
        </Button>
      </section>
    </div>
  );
}

