import { useState } from 'react';

const filters = [
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price' },
  { id: 'brand', label: 'Brand' },
];

export default function ProductFilters() {
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

  const toggleFilter = (id: string) => {
    setActiveFilters((state) => ({ ...state, [id]: !state[id] }));
  };

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
      <ul className="flex flex-col gap-3 text-sm text-slate-600">
        {filters.map((filter) => (
          <li key={filter.id}>
            <button
              aria-pressed={!!activeFilters[filter.id]}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2"
              onClick={() => toggleFilter(filter.id)}
              type="button"
            >
              {filter.label}
              <span>{activeFilters[filter.id] ? 'On' : 'Off'}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
