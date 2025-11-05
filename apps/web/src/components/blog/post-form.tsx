'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
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
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/trpc/client';
import { createPostSchema } from '../../../../../packages/api/src/validation';
import { ImageUploader } from './image-uploader';
import RichTextEditor from '@/components/rich-text-editor';

export type PostFormValues = z.infer<typeof createPostSchema> & {
  title: string;
  slug: string;
  content?: string;
  authorName: string;
  imageUrl?: string;
  categoryIds: number[];
};

interface PostFormProps {
  categories: { id: number; name: string }[];
  initialData?: {
    id: number;
    title: string;
    slug: string;
    content?: string;
    authorName: string;
    imageUrl?: string;
    categoryIds: number[];
  };
}

export function PostForm({ categories, initialData }: PostFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const isEditMode = !!initialData;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(createPostSchema as any),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      authorName: initialData?.authorName ?? 'Admin',
      imageUrl: initialData?.imageUrl ?? '',
      categoryIds: initialData?.categoryIds ?? [],
    },
  });

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      toast.success('Post created!');
      utils.post.all.invalidate();
      utils.post.allForDashboard.invalidate();
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error('Error creating post', { description: error.message });
    },
  });

  const updatePost = trpc.post.update.useMutation({
    onSuccess: (updatedPost) => {
      toast.success('Post updated!');
      utils.post.all.invalidate();
      utils.post.allForDashboard.invalidate();
      utils.post.getById.invalidate({ id: initialData?.id });
      utils.post.getBySlug.invalidate({ slug: updatedPost.slug });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error('Error updating post', { description: error.message });
    },
  });

  const isPending = createPost.isPending || updatePost.isPending;

  function onSubmit(values: PostFormValues) {
    if (isPending) return;
    if (isEditMode) {
      updatePost.mutate({ id: initialData.id, data: values });
    } else {
      createPost.mutate(values);
    }
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    form.setValue('slug', slug);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    onChange={onTitleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="my-awesome-post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Image Uploader Field --- */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={() => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <ImageUploader initialValue={initialData?.imageUrl} />
                </FormControl>
                <FormDescription>
                  Upload your post's cover image (Max 4MB).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Content (Rich Text Editor) --- */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor 
                    content={field.value ?? ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Categories --- */}
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
                  {categories.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="categoryIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value ?? []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name}
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

          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditMode
                ? 'Saving...'
                : 'Creating...'
              : isEditMode
              ? 'Save Changes'
              : 'Create Post'}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}