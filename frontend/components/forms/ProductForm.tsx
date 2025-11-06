'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { cn } from '@/lib/utils';

type ProductFormProps = {
  variant?: 'create' | 'edit';
  id?: string;
};

export default function ProductForm({ variant = 'create', id }: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1200);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" htmlFor="product-name">
          <input className={inputClass()} id="product-name" placeholder="Product name" required />
        </Field>
        <Field label="SKU" htmlFor="product-sku">
          <input className={inputClass()} id="product-sku" placeholder="SKU" />
        </Field>
      </div>
      <Field label="Description" htmlFor="product-description">
        <textarea className={inputClass('min-h-[140px]')} id="product-description" placeholder="Describe the product" />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Price" htmlFor="product-price">
          <input
            className={inputClass()}
            id="product-price"
            min={0}
            placeholder="0.00"
            required
            step="0.01"
            type="number"
          />
        </Field>
        <Field label="Currency" htmlFor="product-currency">
          <input className={inputClass()} id="product-currency" placeholder="USD" />
        </Field>
        <Field label="Stock" htmlFor="product-stock">
          <input
            className={inputClass()}
            id="product-stock"
            min={0}
            placeholder="10"
            required
            type="number"
          />
        </Field>
      </div>
      <ImageUpload label="Product images" />
      <button
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {variant === 'create' ? (loading ? 'Creating…' : 'Create product') : loading ? 'Saving…' : 'Save changes'}
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
  return cn(
    'rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none',
    extra
  );
}
