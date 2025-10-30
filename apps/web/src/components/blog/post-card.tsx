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
  // Strip HTML tags before counting words
  const cleanText = text.replace(/<[^>]*>/g, '');
  const words = cleanText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function stripHtmlTags(html: string): string {
  // Remove HTML tags and decode HTML entities
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
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

  // Strip HTML tags from content for clean snippet
  const snippet = post.content
    ? stripHtmlTags(post.content).slice(0, 160).trim() + '…'
    : 'No content available.';

  const imageUrl =
    post.imageUrl ||
    `https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=${encodeURIComponent(
      post.title,
    )}`;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md',
        className,
      )}
      aria-labelledby={`post-${post.id}-title`}
    >
      {/* IMAGE + TAGS */}
      <div className="relative h-56 w-full overflow-hidden md:h-64">
        <Link href={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src =
                'https://placehold.co/900x600/ddd/666?text=No+Image';
            }}
          />
          {/* subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-90" />
        </Link>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-20">
          {post.categories.length > 0 ? (
            post.categories.slice(0, 3).map((cat) => (
              <a
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="group"
                aria-label={`Filter by ${cat.name}`}
              >
                <Badge
                  variant="outline"
                  className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm transition-colors duration-200 group-hover:bg-white/30 dark:bg-purple-900/40 dark:text-purple-100"
                >
                  {cat.name}
                </Badge>
              </a>
            ))
          ) : (
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
              Uncategorized
            </Badge>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col justify-between p-5">
        {/* meta row: avatar, author, date, reading time */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* avatar (initials fallback) */}
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{
                background:
                  'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(59,130,246,0.9))',
              }}
              aria-hidden
            >
              {initials(post.authorName || 'A')}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{post.authorName}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={date.toISOString()}>{formattedDate}</time>
                <span aria-hidden>•</span>
                <span>{readingTime(post.content)}</span>
              </div>
            </div>
          </div>

          {/* small icon for readability */}
          <div className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground md:flex">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>

        {/* title & excerpt */}
        <div className="mt-4">
          <h3
            id={`post-${post.id}-title`}
            className="line-clamp-2 text-lg font-semibold leading-tight transition-colors duration-200 group-hover:text-purple-600"
          >
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{snippet}</p>
        </div>

        {/* footer: Read more */}
        <div className="mt-5 flex items-center justify-between">
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 px-3 py-2 text-sm font-medium text-white shadow transition-all duration-200 hover:brightness-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label={`Read more about ${post.title}`}
          >
            Read more
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}