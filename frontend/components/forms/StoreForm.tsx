'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createStore, updateStore } from '@/lib/api/stores';
import ImageUpload from './ImageUpload';

type StoreFormProps = {
  variant?: 'create' | 'edit';
  storeId?: string;
  initialData?: {
    name?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
};

export default function StoreForm({ variant = 'create', storeId, initialData }: StoreFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validate edit mode requirements
      if (variant === 'edit' && !storeId) {
        throw new Error('Store ID is required for edit mode');
      }

      const formData = new FormData(event.currentTarget);
      
      // Extract and validate form data
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const address = formData.get('address') as string;
      const website = formData.get('website') as string;

      // Basic validation
      if (!name || name.trim().length < 2) {
        throw new Error('Store name must be at least 2 characters long');
      }

      if (!phone || phone.trim().length < 7) {
        throw new Error('Please provide a valid phone number');
      }

      // Prepare payload
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim() || undefined,
        website: website.trim() || undefined,
      };

      // Make API call based on variant
      if (variant === 'edit') {
        // storeId is guaranteed to exist due to validation above
        await updateStore(storeId!, payload);
        setSuccess(true);
        // Navigate to the store page to show success state
        await router.push(`/admin/stores/${storeId}`);
      } else {
        const newStore = await createStore(payload);
        
        // Validate response before navigation
        if (!newStore || !newStore.id) {
          throw new Error('Store created but ID is missing from response');
        }
        
        setSuccess(true);
        // Navigate to the new store's page
        await router.push(`/admin/stores/${newStore.id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save store';
      setError(message);
      setLoading(false);
    }
    // Note: setLoading(false) is not needed after successful navigation
    // as the component will unmount during navigation
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Store {variant === 'create' ? 'created' : 'updated'} successfully!
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Store name" htmlFor="store-name">
          <input 
            className={inputClass()} 
            id="store-name" 
            name="name" 
            placeholder="Store name" 
            required 
            defaultValue={initialData?.name || ''}
          />
        </Field>
        <Field label="Phone number" htmlFor="store-phone">
          <input 
            className={inputClass()} 
            id="store-phone" 
            name="phone" 
            placeholder="+971 50 123 4567" 
            required 
            defaultValue={initialData?.phone || ''}
          />
        </Field>
      </div>
      <Field label="Address" htmlFor="store-address">
        <textarea 
          className={inputClass('min-h-[120px]')} 
          id="store-address" 
          name="address" 
          placeholder="Address" 
          defaultValue={initialData?.address || ''}
        />
      </Field>
      <Field label="Website" htmlFor="store-website">
        <input 
          className={inputClass()} 
          id="store-website" 
          name="website" 
          placeholder="https://store.com" 
          type="url" 
          defaultValue={initialData?.website || ''}
        />
      </Field>
      <ImageUpload label="Store logo" />
      <button
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {variant === 'create' ? (loading ? 'Creating…' : 'Create store') : loading ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600" htmlFor={htmlFor}>
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function inputClass(extra?: string) {
  return cn('rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none', extra);
}
