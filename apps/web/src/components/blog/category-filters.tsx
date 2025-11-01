import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/server-client';

interface Category {
  id: number; 
  name: string;
  slug: string;
}

interface CategoryFiltersProps {
  activeSlug?: string;
}

export async function CategoryFilters({ activeSlug }: CategoryFiltersProps) {
  const categories = await api.category.all();

  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      <a href="/blog">
        <Badge
          variant={!activeSlug ? 'default' : 'outline'}
          className="text-lg py-1 px-3 cursor-pointer"
        >
          All Posts
        </Badge>
      </a>
      {categories.map((category: Category) => (
        <a
          href={`/blog?category=${category.slug}`}
          key={category.id}
        >
          <Badge
            variant={activeSlug === category.slug ? 'default' : 'outline'}
            className="text-lg py-1 px-3 cursor-pointer"
          >
            {category.name}
          </Badge>
        </a>
      ))}
    </nav>
  );
}

