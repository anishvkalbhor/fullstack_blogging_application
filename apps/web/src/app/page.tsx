import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server-client";
import { HeroSearch } from "@/components/blog/hero-search";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { Badge } from "@/components/ui/badge";

import { Type, Tag, Search, LucideIcon } from "lucide-react";

export const revalidate = 60;

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

const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    icon: Type,
    title: "Rich Text Editor",
    description:
      'Write, format, and edit your posts with an intuitive, Tiptap-based "what you see is what you get" editor.',
  },
  {
    icon: Tag,
    title: "Dynamic Categories",
    description:
      "Organize your articles with custom categories. Readers can filter and find the content they love.",
  },
  {
    icon: Search,
    title: "Instant Search",
    description:
      "A powerful, full-text search that filters all posts by title, content, or author in milliseconds.",
  },
];

export default async function LandingPage() {
  // --- DATA FETCHING ---
  const { posts: recentPosts } = (await api.post.all({
    page: 1,
    limit: 3,
  })) as { posts: PostWithCategories[] };

  const hasPosts = recentPosts && recentPosts.length > 0;

  return (
    <div className="grow">
      {/* Hero Section - Always visible */}
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

      {/* Conditionally render Recent Posts or a "No Blogs" message */}
      {hasPosts ? (
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Recent Posts</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fresh perspectives and insights from our community of writers
              </p>
            </div>

            {/* Bento Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
              {/* Main Post */}
              <Link
                href={`/posts/${recentPosts[0].slug}`}
                className="group relative lg:col-span-6 overflow-hidden rounded-3xl bg-card shadow-card hover:shadow-hover transition-all duration-500 flex flex-col h-full"
              >
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <img
                    src={
                      recentPosts[0].imageUrl ||
                      `https://placehold.co/800x500/f3e8ff/6d28d9?text=${encodeURIComponent(
                        recentPosts[0].title
                      )}`
                    }
                    alt={recentPosts[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-4 items-start justify-between">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {recentPosts[0].categories[0]?.name || "Featured"}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {recentPosts[0].title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
                      {recentPosts[0].content
                        ? recentPosts[0].content.replace(/<[^>]*>/g, "")
                        : "No content available."}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-[hsl(282,85%,65%)]" />
                      <div>
                        <p className="font-medium text-sm">
                          {recentPosts[0].authorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(recentPosts[0].createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="lg:col-span-6 grid grid-rows-2 gap-6 md:gap-8 h-full">
                {recentPosts.slice(1, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group relative overflow-hidden rounded-3xl bg-card shadow-card hover:shadow-hover transition-all duration-500 flex flex-col"
                  >
                    <div className="grid grid-cols-5 gap-4 p-5 flex-1">
                      <div className="col-span-2 aspect-square overflow-hidden rounded-2xl">
                        <img
                          src={
                            post.imageUrl ||
                            `https://placehold.co/400x400/f3e8ff/6d28d9?text=${encodeURIComponent(
                              post.title
                            )}`
                          }
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="col-span-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">
                            {post.categories[0]?.name || "General"}
                          </Badge>
                          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content
                              ? post.content.replace(/<[^>]*>/g, "")
                              : "No content available."}
                          </p>
                        </div>
                        <div className="pt-2">
                          <p className="text-xs text-muted-foreground">
                            {post.authorName} •{" "}
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center mt-14">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 shadow-elegant"
              >
                <Link href="/blog">View All Blogs</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative flex flex-col items-center justify-center py-24 md:py-36 overflow-hidden text-center bg-background">
          <div className="container relative z-10 mx-auto max-w-3xl px-6">
            <h2 className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-3xl md:text-4xl font-extrabold text-transparent mb-7 animate-fade-in">
              No Blogs Yet
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Looks like the blog is just getting started.
              <br />
              Be the first to share your story!
            </p>
            <Button asChild size="lg" className="rounded-full px-8 shadow-elegant">
              <Link href="/posts/create">Create a Blog Now!</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Features Section - Always visible */}
      <section className="py-20 md:py-32 bg-linear-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern tools and designed for creators who care about
              quality
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="
              group relative p-8 rounded-3xl bg-card border border-border shadow-card
              hover:shadow-hover
              transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              will-change-transform
            "
                >
                  <div
                    className="
                absolute inset-0 rounded-3xl 
                bg-linear-to-br from-primary/10 via-transparent to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-700 ease-out
              "
                  />
                  <div className="relative space-y-4">
                    <div
                      className="
                  w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-[hsl(282,85%,65%)]
                  flex items-center justify-center shadow-elegant
                  transform group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                "
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-500 ease-in-out">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 p-12 md:p-16 rounded-3xl bg-linear-to-br from-primary/10 to-[hsl(282,85%,65%)]/10 border border-primary/20">
            <h2 className="text-4xl md:text-5xl font-bold">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of readers exploring ideas that matter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 shadow-elegant"
              >
                <Link href="/blog">Browse Blogs</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 shadow-elegant"
              >
                <Link href="posts/create">Create your First Post</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
