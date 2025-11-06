'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import ImageUpload from './ImageUpload';

type StoreFormProps = {
  variant?: 'create' | 'edit';
};

export default function StoreForm({ variant = 'create' }: StoreFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1100);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Store name" htmlFor="store-name">
          <input className={inputClass()} id="store-name" placeholder="Store name" required />
        </Field>
        <Field label="Phone number" htmlFor="store-phone">
          <input className={inputClass()} id="store-phone" placeholder="+971 50 123 4567" required />
        </Field>
      </div>
      <Field label="Address" htmlFor="store-address">
        <textarea className={inputClass('min-h-[120px]')} id="store-address" placeholder="Address" />
      </Field>
      <Field label="Website" htmlFor="store-website">
        <input className={inputClass()} id="store-website" placeholder="https://store.com" type="url" />
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
