'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/shared/SearchBar';
import { useDebounce } from '@/lib/hooks/useDebounce';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced) return;
    // Replace with API search integration.
  }, [debounced]);

  return (
    <SearchBar
      placeholder="Search products"
      onSearch={setQuery}
      className="w-full max-w-md"
    />
  );
}
