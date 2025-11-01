import { api } from '@/trpc/server-client';
import { cn } from '@/lib/utils';

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
    <nav
      className="
        flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide
        py-2 mb-10
        md:justify-center md:flex-wrap
      "
    >
      {[{ id: 0, name: 'All Posts', slug: '' }, ...categories].map((category) => {
        const isActive =
          activeSlug === category.slug || (!activeSlug && category.slug === '');
        return (
          <a
            key={category.id}
            href={category.slug ? `/blog?category=${category.slug}` : '/blog'}
            className={cn(
              'relative group inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium border shrink-0 transition-all duration-300 ease-in-out',
              'hover:shadow-md snap-start',
              isActive
                ? 'bg-gradient-to-r from-primary/80 to-primary text-white border-transparent'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
            )}
          >
            <span className="relative z-10">{category.name}</span>
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
