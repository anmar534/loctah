'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createOffer, updateOffer } from '@/lib/api/offers';
import type { Offer } from '@/types';

type OfferFormProps = {
  variant?: 'create' | 'edit';
  id?: string;
  offer?: Offer;
};

export default function OfferForm({ variant = 'create', id, offer }: OfferFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState(offer?.title || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [discount, setDiscount] = useState(offer?.discount?.toString() || '');
  const [endDate, setEndDate] = useState(offer?.endDate ? offer.endDate.split('T')[0] : '');
  const [startDate, setStartDate] = useState(offer?.startDate ? offer.startDate.split('T')[0] : '');
  const [active, setActive] = useState(offer?.active ?? true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate that edit mode has an ID
      if (variant === 'edit' && !id) {
        throw new Error('Cannot update offer: ID is missing');
      }

      // Validate and parse discount value
      const parsedDiscount = parseFloat(discount);
      if (!discount.trim() || Number.isNaN(parsedDiscount)) {
        throw new Error('Please enter a valid discount percentage');
      }
      if (parsedDiscount < 0 || parsedDiscount > 100) {
        throw new Error('Discount must be between 0 and 100');
      }

      const payload = {
        title,
        description,
        discount: parsedDiscount,
        endDate,
        // Use form value if provided, otherwise use current date for create mode
        startDate: startDate || new Date().toISOString().split('T')[0],
        active,
      };

      if (variant === 'edit') {
        // TypeScript: id is guaranteed to exist due to validation above
        await updateOffer(id!, payload);
      } else {
        await createOffer(payload);
      }

      router.push('/admin/offers');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="offer-title">
          Title
        </label>
        <input
          className={inputClass()}
          id="offer-title"
          placeholder="Offer title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="offer-description">
          Description
        </label>
        <textarea
          className={inputClass('min-h-[120px]')}
          id="offer-description"
          placeholder="Describe the offer"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="offer-discount">
            Discount (%)
          </label>
          <input
            className={inputClass()}
            id="offer-discount"
            max={100}
            min={0}
            placeholder="10"
            required
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="offer-expiry">
            Expires on
          </label>
          <input
            className={inputClass()}
            id="offer-expiry"
            required
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="offer-start-date">
            Start Date
          </label>
          <input
            className={inputClass()}
            id="offer-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="offer-active">
            Status
          </label>
          <div className="flex items-center gap-2 pt-2">
            <input
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
              id="offer-active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <label className="text-sm text-slate-700" htmlFor="offer-active">
              Active
            </label>
          </div>
        </div>
      </div>
      <button
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {variant === 'create' ? (loading ? 'Creating…' : 'Create offer') : loading ? 'Saving…' : 'Save changes'}
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
