'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface PaginationControlsProps {
  pageCount: number;
  currentPage: number;
}

// Helper to generate the pagination links
const getPagesToShow = (currentPage: number, pageCount: number): (number | string)[] => {
  const SIBLING_COUNT = 1;
  const totalPagesToShow = SIBLING_COUNT * 2 + 3; // current, 2 siblings, 2 boundaries (first, last)

  // If total pages is less than what we want to show, show all
  if (pageCount <= totalPagesToShow) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1);
  const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, pageCount);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < pageCount - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + SIBLING_COUNT * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', pageCount];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + SIBLING_COUNT * 2;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => pageCount - rightItemCount + 1 + i,
    );
    return [1, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, '...', ...middleRange, '...', pageCount];
  }

  return []; // Should be unreachable
};

export function PaginationControls({
  pageCount,
  currentPage,
}: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Generate the array of page numbers to display
  const pages = useMemo(
    () => getPagesToShow(currentPage, pageCount),
    [currentPage, pageCount],
  );

  // Helper to create the URL for each page link
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            // Disable if on the first page
            className={
              currentPage === 1
                ? 'pointer-events-none text-muted-foreground'
                : ''
            }
          />
        </PaginationItem>

        {/* Page Number Links */}
        {pages.map((page, index) =>
          typeof page === 'number' ? (
            <PaginationItem key={index}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            // Disable if on the last page
            className={
              currentPage === pageCount
                ? 'pointer-events-none text-muted-foreground'
                : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}