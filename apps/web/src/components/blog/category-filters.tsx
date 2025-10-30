import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/server-client';

interface CategoryFiltersProps {
  activeSlug?: string;
}

// This is a Server Component, so we make it async
export async function CategoryFilters({ activeSlug }: CategoryFiltersProps) {
  // It fetches its own data
  const categories = await api.category.all();

  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {/* "All Posts" Link */}
      <Link href="/" passHref>
        <Badge
          variant={!activeSlug ? 'default' : 'outline'}
          className="text-lg py-1 px-3 cursor-pointer"
        >
          All Posts
        </Badge>
      </Link>
      {/* Map over the categories */}
      {categories.map((category) => (
        <Link
          href={`/?category=${category.slug}`}
          key={category.id}
          passHref
        >
          <Badge
            variant={activeSlug === category.slug ? 'default' : 'outline'}
            className="text-lg py-1 px-3 cursor-pointer"
          >
            {category.name}
          </Badge>
        </Link>
      ))}
    </nav>
  );
}