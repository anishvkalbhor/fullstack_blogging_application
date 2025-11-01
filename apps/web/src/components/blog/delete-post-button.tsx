'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query'; // 1. Import useQueryClient
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { trpc } from '@/trpc/client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface DeletePostButtonProps {
  postId: number;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 2. Get the query client instance instead of tRPC utils
  const queryClient = useQueryClient();

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      toast.success('Post deleted successfully.');
      // 3. Invalidate the query using the standard TanStack Query method
      // The query key for a tRPC query is an array with the path.
      queryClient.invalidateQueries({ queryKey: [['post', 'all']] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error deleting post', {
        description: error.message,
      });
      setIsOpen(false);
    },
  });

  const handleDelete = () => {
    deletePost.mutate({ id: postId });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {/* This component is designed to be placed inside a DropdownMenu */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // Prevents dropdown from closing
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            post and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deletePost.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}