'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/trpc/client';
import { createPostSchema } from '../../../../../packages/api/src/validation'; // Make sure this is exported from api/validation

// Define the form type from our shared Zod schema
type PostFormValues = z.infer<typeof createPostSchema>;

// Define the component's props
interface PostFormProps {
  // We pass initialData to populate the form for editing
  initialData?: PostFormValues & { id: number; slug: string };
  // We pass the list of categories to display as checkboxes
  categories: { id: number; name: string }[];
}

export function PostForm({ initialData, categories }: PostFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  // Determine if we are in 'edit' or 'create' mode
  const isEditMode = !!initialData;

  // 1. tRPC Mutations
  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      toast.success('Post created!');
      // Invalidate all queries to refresh data
      utils.post.all.invalidate();
      utils.post.allForDashboard.invalidate();
      router.push('/dashboard'); // Redirect to dashboard after creation
    },
    onError: (error) => {
      toast.error('Error creating post', { description: error.message });
    },
  });

  const updatePost = trpc.post.update.useMutation({
    onSuccess: (updatedPost) => {
      toast.success('Post updated!');
      // Invalidate all queries to refresh data
      utils.post.all.invalidate();
      utils.post.allForDashboard.invalidate();
      // Invalidate the specific post queries
      utils.post.getById.invalidate({ id: initialData?.id });
      utils.post.getBySlug.invalidate({ slug: updatedPost.slug });
      router.push('/dashboard'); // Redirect to dashboard after update
    },
    onError: (error) => {
      toast.error('Error updating post', { description: error.message });
    },
  });

  // 2. Form Setup (react-hook-form)
  const form = useForm<PostFormValues>({
    resolver: zodResolver(createPostSchema),
    // Use initialData if provided (for edit), otherwise use defaults
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      categoryIds: initialData?.categoryIds ?? [],
    },
  });

  // 3. Submit Handler
  function onSubmit(values: PostFormValues) {
    if (isEditMode) {
      // If editing, call update mutation
      updatePost.mutate({ ...values, id: initialData.id });
    } else {
      // If creating, call create mutation
      createPost.mutate(values);
    }
  }

  // Auto-generate slug from title
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove invalid characters
    form.setValue('slug', slug);
  };

  const isSubmitting = createPost.isPending || updatePost.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome Post"
                  {...field}
                  onChange={onTitleChange} // Use custom change handler
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug Field */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="my-awesome-post" {...field} />
              </FormControl>
              <FormDescription>
                This is the URL-friendly version of your title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content here in Markdown..."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories Field */}
        <FormField
          control={form.control}
          name="categoryIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Categories</FormLabel>
                <FormDescription>
                  Select one or more categories for your post.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      category.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (id) => id !== category.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? 'Saving...'
              : 'Creating...'
            : isEditMode
            ? 'Save Changes'
            : 'Create Post'}
        </Button>
      </form>
    </Form>
  );
}

