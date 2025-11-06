'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type CategoryFormProps = {
  variant?: 'create' | 'edit';
  id?: string;
};

export default function CategoryForm({ variant = 'create', id }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
      }}
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="category-name">
          Name
        </label>
        <input className={inputClass()} id="category-name" placeholder="Category name" required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="category-description">
          Description
        </label>
        <textarea className={inputClass('min-h-[120px]')} id="category-description" placeholder="Describe this category" />
      </div>
      <button
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {variant === 'create' ? (loading ? 'Creating…' : 'Create category') : loading ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}

function inputClass(extra?: string) {
  return cn('rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none', extra);
}
