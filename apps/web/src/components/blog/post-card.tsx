import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type PostWithCategories = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  createdAt: string;
  categories: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  }[];
};

interface PostCardProps {
  post: PostWithCategories;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const snippet = post.content
    ? post.content.substring(0, 100) + '...'
    : 'No content...';

  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.length > 0 ? (
              post.categories.map((category) => (
                <Link
                  href={`/?category=${category.slug}`}
                  key={category.id}
                  passHref
                >
                  <Badge variant="outline" className="cursor-pointer">
                    {category.name}
                  </Badge>
                </Link>
              ))
            ) : (
              <Badge variant="secondary">Uncategorized</Badge>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{snippet}</p>
        </CardContent>
      </div>
      <CardFooter>
        <Button asChild>
          <Link href={`/posts/${post.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}