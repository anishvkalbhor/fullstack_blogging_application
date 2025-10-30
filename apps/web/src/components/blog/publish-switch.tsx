'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { trpc } from '@/trpc/client';

interface PublishSwitchProps {
  postId: number;
  initialChecked: boolean;
}

export function PublishSwitch({ postId, initialChecked }: PublishSwitchProps) {
  const [isChecked, setIsChecked] = useState(initialChecked);
  const utils = trpc.useUtils();

  const updateStatus = trpc.post.updatePublishedStatus.useMutation({
    onSuccess: (updatedPost) => {
      toast.success(`Post ${updatedPost.published ? 'published' : 'unpublished'}.`);
      // Refresh the dashboard list
      utils.post.allForDashboard.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to update status', {
        description: error.message,
      });
      // Revert the switch on error
      setIsChecked(!isChecked);
    },
  });

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    updateStatus.mutate({ id: postId, published: checked });
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Switch
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={updateStatus.isPending}
      />
      <span className="text-xs text-muted-foreground">
        {isChecked ? 'Published' : 'Draft'}
      </span>
    </div>
  );
}