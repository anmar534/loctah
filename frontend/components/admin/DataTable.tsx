import type { ReactNode } from 'react';

export type DataTableColumn<T> = {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  title: string;
  data?: T[];
  columns?: DataTableColumn<T>[];
};

const defaultHeaders = ['Name', 'Status', 'Updated'];
const defaultRows = Array.from({ length: 5 }).map((_, index) => ({
  name: `Item ${index + 1}`,
  status: index % 2 === 0 ? 'Active' : 'Pending',
  updated: 'Today',
}));

export default function DataTable<T extends Record<string, any>>({ 
  title, 
  data, 
  columns 
}: DataTableProps<T>) {
  const headers = columns ? columns.map(col => col.label) : defaultHeaders;
  const rows = data ?? (defaultRows as any as T[]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <span className="text-xs text-slate-500">{rows.length} entries</span>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header) => (
                <th className="px-5 py-3 font-medium uppercase tracking-wide text-slate-500" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, index) => (
              <tr key={index}>
                {columns ? (
                  columns.map((col) => (
                    <td className="px-5 py-3 text-slate-700" key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))
                ) : (
                  <>
                    <td className="px-5 py-3 text-slate-700">{row.name}</td>
                    <td className="px-5 py-3 text-slate-600">{row.status}</td>
                    <td className="px-5 py-3 text-slate-500">{row.updated}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
