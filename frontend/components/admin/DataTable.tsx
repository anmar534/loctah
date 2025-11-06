import type { ReactNode } from 'react';

// Column that maps to an actual property in T
export type DataTablePropertyColumn<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
};

// Column that doesn't map to a property (e.g., "actions")
export type DataTableCustomColumn<T> = {
  key: string;
  label: string;
  render: (item: T) => ReactNode; // Required for custom columns
};

export type DataTableColumn<T> = DataTablePropertyColumn<T> | DataTableCustomColumn<T>;

type DefaultRow = {
  name: string;
  status: string;
  updated: string;
};

type DataTableProps<T> = {
  title: string;
  data?: T[];
  columns?: DataTableColumn<T>[];
};

const defaultHeaders = ['Name', 'Status', 'Updated'];
const defaultRows: DefaultRow[] = Array.from({ length: 5 }).map((_, index) => ({
  name: `Item ${index + 1}`,
  status: index % 2 === 0 ? 'Active' : 'Pending',
  updated: 'Today',
}));

export default function DataTable<T extends Record<string, unknown>>({ 
  title, 
  data, 
  columns 
}: DataTableProps<T>) {
  // Fail fast: if custom data is provided, columns are required
  if (data && !columns) {
    throw new Error('DataTable: columns prop is required when data prop is provided');
  }

  // Guard: if columns is expected but missing, return early with error state
  if (!data && columns) {
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </header>
        <div className="p-5 text-center text-sm text-slate-500">
          No data provided
        </div>
      </section>
    );
  }

  // Use custom data/columns or fall back to built-in defaults
  const isUsingDefaults = !data && !columns;

  // Render default table
  if (isUsingDefaults) {
    return (
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <span className="text-xs text-slate-500">{defaultRows.length} entries</span>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {defaultHeaders.map((header, index) => (
                  <th className="px-5 py-3 font-medium uppercase tracking-wide text-slate-500" key={index}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {defaultRows.map((row, index) => (
                <tr key={index}>
                  <td className="px-5 py-3 text-slate-700">{row.name}</td>
                  <td className="px-5 py-3 text-slate-600">{row.status}</td>
                  <td className="px-5 py-3 text-slate-500">{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // Render custom table (data and columns are guaranteed to exist here)
  if (!data || !columns) {
    return null; // This should never happen due to guards above
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <span className="text-xs text-slate-500">{data.length} entries</span>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th className="px-5 py-3 font-medium uppercase tracking-wide text-slate-500" key={String(col.key)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => {
                  // If render is provided, use it
                  if (col.render) {
                    return (
                      <td className="px-5 py-3 text-slate-700" key={String(col.key)}>
                        {col.render(row)}
                      </td>
                    );
                  }
                  
                  // Otherwise, safely access the property
                  const key = col.key as keyof T;
                  const value = row[key];
                  const displayValue = value !== undefined && value !== null
                    ? String(value)
                    : '-';
                  
                  return (
                    <td className="px-5 py-3 text-slate-700" key={String(col.key)}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
