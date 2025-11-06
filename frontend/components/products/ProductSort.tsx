'use client';

import { useState } from 'react';

const options = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to high' },
  { value: 'price_high', label: 'Price: High to low' },
];

export default function ProductSort() {
  const [value, setValue] = useState(options[0]?.value ?? 'popular');

  return (
    <label className="flex w-full max-w-xs items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
      <span className="font-medium">Sort</span>
      <select
        className="flex-1 border-none bg-transparent text-sm text-slate-700 outline-none"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
