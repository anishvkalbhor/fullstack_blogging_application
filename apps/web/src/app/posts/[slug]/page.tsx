import { api } from "@/trpc/server-client";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;

  let post;
  try {
    post = await api.post.getBySlug({ slug });
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-3xl py-12">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/">&larr; Back to all Posts</Link>
      </Button>

      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="mb-2 text-4xl font-bold">{post.title}</h1>
        <p className="text-lg text-muted-foreground">
          Published on: {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-8">
          <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
