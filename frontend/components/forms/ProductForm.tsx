'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import { cn } from '@/lib/utils';
import { createProduct, updateProduct, getProduct } from '@/lib/api/products';

type ProductFormProps = {
  variant?: 'create' | 'edit';
  id?: string;
};

export default function ProductForm({ variant = 'create', id }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(variant === 'edit' && !!id);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [stock, setStock] = useState('');

  // Fetch existing product data in edit mode
  useEffect(() => {
    if (variant === 'edit' && id) {
      setFetching(true);
      getProduct(id)
        .then((product) => {
          if (product) {
            setName(product.name || product.title || '');
            setSku(product.sku || '');
            setDescription(product.description || '');
            setPrice(product.price?.toString() || '');
            setCurrency(product.currency || 'USD');
            setStock(product.stock?.toString() || '');
          }
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [variant, id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name,
        title: name,
        sku: sku || null,
        description,
        price: parseFloat(price),
        currency,
        stock: parseInt(stock, 10),
      };

      if (variant === 'edit' && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-slate-500">Loading product data...</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" htmlFor="product-name">
          <input
            className={inputClass()}
            id="product-name"
            placeholder="Product name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="SKU" htmlFor="product-sku">
          <input
            className={inputClass()}
            id="product-sku"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </Field>
      </div>
      <Field label="Description" htmlFor="product-description">
        <textarea
          className={inputClass('min-h-[140px]')}
          id="product-description"
          placeholder="Describe the product"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
        <Field label="Currency" htmlFor="product-currency">
          <input
            className={inputClass()}
            id="product-currency"
            placeholder="USD"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </Field>
        <Field label="Stock" htmlFor="product-stock">
          <input
            className={inputClass()}
            id="product-stock"
            min={0}
            placeholder="10"
            required
            step="1"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
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
    'rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
    extra
  );
}
