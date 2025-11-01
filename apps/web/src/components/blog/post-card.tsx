'use client';

import Link from 'next/link';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type PostWithCategories = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  createdAt: string;
  authorName: string;
  imageUrl: string | null;
  categories: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  }[];
};

interface PostCardProps {
  post: PostWithCategories;
  className?: string;
}

function readingTime(text?: string | null) {
  if (!text) return '1 min read';
  const cleanText = text.replace(/<[^>]*>/g, '');
  const words = cleanText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function initials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function PostCard({ post, className }: PostCardProps) {
  const date = new Date(post.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const snippet = post.content
    ? stripHtmlTags(post.content).slice(0, 150).trim() + '…'
    : 'No content available.';

  const imageUrl =
    post.imageUrl ||
    `https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=${encodeURIComponent(
      post.title,
    )}`;

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:shadow-lg',
        className,
      )}
    >
      {/* IMAGE SECTION */}
      <div className="relative h-56 w-full overflow-hidden md:h-64">
        <Link href={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/900x600/ddd/666?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </Link>

        {/* Category Tags */}
        <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
          {post.categories.length > 0 ? (
            post.categories.slice(0, 2).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  'bg-white/90 text-gray-800 backdrop-blur-md dark:bg-neutral-800/80 dark:text-gray-100',
                  'border border-gray-200 dark:border-neutral-700',
                  'hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40 dark:hover:text-purple-300 transition-colors duration-300',
                )}
              >
                {cat.name}
              </Badge>
            ))
          ) : (
            <Badge
              variant="secondary"
              className="rounded-full bg-white/80 text-gray-700 dark:bg-neutral-800/80 dark:text-gray-200 px-2.5 py-0.5 text-xs font-medium"
            >
              Uncategorized
            </Badge>
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-1 flex-col justify-between p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md shrink-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(59,130,246,0.9))',
            }}
          >
            {initials(post.authorName || 'A')}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {post.authorName}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <time dateTime={date.toISOString()}>{formattedDate}</time>
              <span>•</span>
              <span>{readingTime(post.content)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          id={`post-${post.id}-title`}
          className="text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-purple-600"
        >
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Snippet */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
          {snippet}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:brightness-110 hover:shadow-md"
          >
            Read more
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <div className="hidden items-center gap-1 text-xs text-gray-500 dark:text-gray-400 md:flex">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
