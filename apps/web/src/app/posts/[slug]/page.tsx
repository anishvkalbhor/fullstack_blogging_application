import { api } from '@/trpc/server-client';
import { notFound } from 'next/navigation';
// 1. REMOVE ReactMarkdown imports
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { CalendarDays, User } from 'lucide-react';
import { PostImage } from '@/components/blog/post-image';
import { ReadingProgress } from '@/components/blog/reading-progress';
// 2. We will import a new library
import parse from 'html-react-parser';
import RichTextEditor from '@/components/rich-text-editor';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// --- SEO Metadata ---
export async function generateMetadata(
  { params: paramsPromise }: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await paramsPromise;
  const { slug } = params;

  try {
    const post = await api.post.getBySlug({ slug });
    return {
      title: post.title,
      description: post.content?.substring(0, 150) ?? 'A post from the blog.',
      openGraph: post.imageUrl ? { images: [post.imageUrl] } : null,
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

// --- Main Post Page ---
export default async function PostPage({ params: paramsPromise }: PostPageProps) {
  const params = await paramsPromise;
  const { slug } = params;

  let post;
  try {
    post = await api.post.getBySlug({ slug });
  } catch {
    notFound();
  }
  if (!post) notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <ReadingProgress />

      {/* HERO SECTION */}
      <section className="relative isolate">
        <PostImage
          src={post.imageUrl ?? ''}
          alt={post.title}
          className="h-[60vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center text-white px-4">
          <h1 className="max-w-3xl text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-400" />
              {post.authorName}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-purple-400" />
              {formattedDate}
            </div>
          </div>

          {!post.published && (
            <span className="mt-4 rounded-full bg-yellow-200/80 px-3 py-1 text-xs font-medium text-yellow-900 shadow-sm backdrop-blur-sm">
              Draft
            </span>
          )}
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <Button asChild variant="outline">
            <Link href="/blog" className="flex items-center gap-2">
              ← Back to all posts
            </Link>
          </Button>
        </div>

        <RichTextEditor content={post.content || ""} editable={false} />
      </article>

      {/* GRADIENT DIVIDER + CTA */}
      <div className="mx-auto mt-20 max-w-3xl border-t border-border pt-12 text-center px-5 pb-16">
        <p className="text-muted-foreground mb-6">
          Enjoyed this post? Explore more from our blog.
        </p>
        <Button asChild>
          <Link href="/blog">Browse More Articles</Link>
        </Button>
      </div>
    </main>
  );
}