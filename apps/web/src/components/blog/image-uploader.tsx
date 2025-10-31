'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { PostFormValues } from './post-form';
import type { PutBlobResult } from '@vercel/blob';
import { Button } from '@/components/ui/button';
import { X, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils'; 

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function ImageUploader({
  initialValue,
}: {
  initialValue: string | null | undefined;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined | null>(
    initialValue,
  );

  const form = useFormContext<PostFormValues>();

  const uploadImage = trpc.post.uploadImage.useMutation({
    onSuccess: (blob: PutBlobResult) => {
      form.setValue('imageUrl', blob.url);
      setPreview(blob.url);
      toast.success('Image uploaded successfully!');
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error('Image upload failed', { description: error.message });
      setIsUploading(false);
    },
  });

  const handleFileUpload = async (files: File[]) => {
    const file = files && files[0];
    if (!file) return;

    setIsUploading(true);

    if (file.size > 4 * 1024 * 1024) {
      toast.error('File is too large', {
        description: 'Please upload an image smaller than 4MB.',
      });
      setIsUploading(false);
      return;
    }

    try {
      const base64 = await toBase64(file);
      uploadImage.mutate({
        base64: base64,
        filename: file.name,
      });
    } catch (error) {
      toast.error('Failed to read file');
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {preview ? (
        <div className="relative h-64 w-full rounded-md border overflow-hidden">
          <img
            src={preview}
            alt="Post preview"
            className="h-full w-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            type="button"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => {
              setPreview(null);
              form.setValue('imageUrl', '');
            }}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'h-64 w-full',
            isUploading && 'opacity-50 pointer-events-none',
          )}
        >
          <FileUpload
            onChange={handleFileUpload}
          />
        </div>
      )}

      {isUploading && (
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full w-full animate-pulse bg-purple-500" />
        </div>
      )}

      <input type="hidden" {...form.register('imageUrl')} />
    </div>
  );
}