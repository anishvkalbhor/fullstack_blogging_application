'use client';

import { useState } from 'react';

interface PostImageProps {
  src: string;
  alt: string;
  className: string;
}

export function PostImage({ src, alt, className }: PostImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // A placeholder that uses the post's title
  const placeholder = `https://placehold.co/1200x600/f3e8ff/6d28d9?text=${encodeURIComponent(
    alt,
  )}`;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        // Fall back to placeholder if the image URL is broken
        setImgSrc(placeholder);
      }}
    />
  );
}
