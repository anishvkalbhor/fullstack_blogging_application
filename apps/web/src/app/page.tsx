import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import { api } from "@/trpc/server-client";
import { HeroSearch } from "@/components/blog/hero-search";
import { StripedPattern } from "@/components/magicui/striped-pattern";

// This page will be statically rendered
export default async function LandingPage() {
  // Fetch only the 3 most recent, PUBLISHED posts and stringify dates to match PostWithCategories
  const recentPosts = await api.post
    .all({})
    .then((posts) =>
      posts
        .slice(0, 3)
        .map((p) => ({
          ...p,
          createdAt:
            // ensure createdAt is a string (PostWithCategories expects string)
            p.createdAt instanceof Date ? p.createdAt.toISOString() : (p.createdAt as any),
          updatedAt:
            // ensure updatedAt is a string as well
            p.updatedAt instanceof Date ? p.updatedAt.toISOString() : (p.updatedAt as any),
        }))
    );

  return (
    <div className="grow">
      <section className="relative container max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 md:px-6 overflow-hidden">
        <StripedPattern
          id="hero-stripes"
          className="absolute inset-0 z-[-1] w-full h-full object-cover opacity-[0.03]"
        />

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Find Your Next Great Read
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
          A minimalist, professional blogging platform built with the latest
          full-stack technologies.
        </p>
        <HeroSearch />
      </section>

      {/* Section 2: Recent Posts (Bento Grid) */}
      <section className="bg-muted py-20 md:py-32">
        <div className="container max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Recent Posts
          </h2>
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Post (spans 2 columns) */}
              {recentPosts[0] && (
                <div className="md:col-span-2 min-h-[300px]">
                  <PostCard post={recentPosts[0]} />
                </div>
              )}
              {/* Secondary Posts */}
              {recentPosts[1] && (
                <div className="min-h-[300px]">
                  <PostCard post={recentPosts[1]} />
                </div>
              )}
              {recentPosts[2] && (
                <div className="min-h-[300px]">
                  <PostCard post={recentPosts[2]} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No posts published yet.
            </p>
          )}
        </div>
      </section>

      {/* Section 3: CTA */}
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

