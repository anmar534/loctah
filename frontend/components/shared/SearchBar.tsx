import { useRef } from 'react';
import { cn } from '@/lib/utils';

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
};

export default function SearchBar({ placeholder = 'Search…', onSearch, className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <form
      aria-label="Search"
      className={cn('flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2', className)}
      onSubmit={(event) => {
        event.preventDefault();
        const query = inputRef.current?.value ?? '';
        onSearch?.(query);
      }}
    >
      <span aria-hidden className="text-slate-500">🔍</span>
      <input
        ref={inputRef}
        aria-label="Search"
        className="h-8 flex-1 border-none bg-transparent text-sm text-slate-700 outline-none"
        placeholder={placeholder}
        type="search"
      />
      <button className="text-sm font-medium text-slate-600" type="submit">
        Go
      </button>
    </form>
  );
}
