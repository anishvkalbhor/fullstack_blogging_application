'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner'; // Using sonner

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
// 1. 'useToast' import is REMOVED
import { trpc } from '@/trpc/client';
import { createPostSchema } from '../../../../../../packages/api/src/validation';

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const router = useRouter();

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      toast.success('Post created!', {
        description: 'Your new post has been successfully created.',
      });
      trpc.useUtils().post.all.invalidate();
      router.push('/');
    },
    onError: (error) => {
      toast.error('Error creating post', {
        description: error.message,
      });
    },
  });

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
    },
  });

  function onSubmit(values: CreatePostForm) {
    // 2. Use 'isPending' to check mutation state
    if (createPost.isPending) return;
    createPost.mutate(values);
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
    <main className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Create New Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormDescription>
                  This is the URL-friendly version of your title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your post content here..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can use Markdown for formatting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 3. Changed 'isLoading' to 'isPending' */}
          <Button type="submit" disabled={createPost.isPending}>
            {createPost.isPending ? 'Creating...' : 'Create Post'}
          </Button>
        </form>
      </Form>
    </main>
  );
}