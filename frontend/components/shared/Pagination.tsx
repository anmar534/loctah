import { cn } from '@/lib/utils';

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
};

const SIBLING_COUNT = 2;
const ELLIPSIS = 'ellipsis' as const;

type PaginationItem = number | typeof ELLIPSIS;

const range = (start: number, end: number) =>
  start > end ? [] : Array.from({ length: end - start + 1 }, (_, index) => start + index);

function getPaginationItems(page: number, pageCount: number): PaginationItem[] {
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const totalNumbers = SIBLING_COUNT * 2 + 5;

  if (pageCount <= totalNumbers) {
    return range(1, pageCount);
  }

  const firstPage = 1;
  const lastPage = pageCount;
  const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, firstPage + 1);
  const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, lastPage - 1);

  const showLeftEllipsis = leftSiblingIndex > firstPage + 1;
  const showRightEllipsis = rightSiblingIndex < lastPage - 1;

  const pages: PaginationItem[] = [firstPage];

  if (showLeftEllipsis) {
    pages.push(ELLIPSIS);
  } else {
    pages.push(...range(2, leftSiblingIndex - 1));
  }

  pages.push(...range(leftSiblingIndex, rightSiblingIndex));

  if (showRightEllipsis) {
    pages.push(ELLIPSIS);
  } else {
    pages.push(...range(rightSiblingIndex + 1, lastPage - 1));
  }

  pages.push(lastPage);

  const deduped: PaginationItem[] = [];
  for (const item of pages) {
    if (deduped.length === 0 || deduped[deduped.length - 1] !== item) {
      deduped.push(item);
    }
  }

  return deduped;
}

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (process.env.NODE_ENV === 'development') {
    if (page < 1 || page > pageCount) {
      console.warn(`Invalid page prop: ${page}. Should be between 1 and ${pageCount}.`);
    }
  }

  if (pageCount <= 1) return null;

  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const paginationItems = getPaginationItems(currentPage, pageCount);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      {paginationItems.map((item, index) => {
        if (item === ELLIPSIS) {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-slate-500"
            >
              …
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <button
            key={item}
            type="button"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition',
              isActive
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            )}
            aria-label={`Go to page ${item}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={isActive ? undefined : () => onPageChange?.(item)}
            disabled={isActive}
          >
            {item}
          </button>
        );
      })}
    </nav>
  );
}
