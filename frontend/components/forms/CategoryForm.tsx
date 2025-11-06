'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createCategory, updateCategory, getCategory } from '@/lib/api/categories';

type CategoryFormProps = {
  variant?: 'create' | 'edit';
  id?: string;
};

export default function CategoryForm({ variant = 'create', id }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(variant === 'edit' && !!id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch existing category data in edit mode
  useEffect(() => {
    if (variant === 'edit' && id) {
      let cancelled = false;
      
      setFetching(true);
      getCategory(id)
        .then((category) => {
          if (cancelled) return;
          
          if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
          }
        })
        .catch((err) => {
          if (cancelled) return;
          
          setError(err instanceof Error ? err.message : 'Failed to load category');
        })
        .finally(() => {
          if (cancelled) return;
          
          setFetching(false);
        });

      // Cleanup function to prevent state updates after unmount
      return () => {
        cancelled = true;
      };
    }
  }, [variant, id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Trim inputs
      const trimmedName = name.trim();
      const trimmedDescription = description.trim();

      // Validate trimmed name is non-empty
      if (!trimmedName) {
        setError('Category name is required and cannot be only whitespace');
        setLoading(false);
        return;
      }

      const payload = {
        name: trimmedName,
        description: trimmedDescription || null,
      };

      if (variant === 'edit' && id) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }

      // Await navigation to avoid race conditions
      await router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-slate-500">Loading category data...</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="category-name">
          Name
        </label>
        <input
          className={inputClass()}
          id="category-name"
          placeholder="Category name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="category-description">
          Description
        </label>
        <textarea
          className={inputClass('min-h-[120px]')}
          id="category-description"
          placeholder="Describe this category"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
  return cn(
    'rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
    extra
  );
}
