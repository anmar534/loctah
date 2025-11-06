'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type OfferFormProps = {
  variant?: 'create' | 'edit';
};

export default function OfferForm({ variant = 'create' }: OfferFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 900);
      }}
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="offer-title">
          Title
        </label>
        <input className={inputClass()} id="offer-title" placeholder="Offer title" required />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="offer-description">
          Description
        </label>
        <textarea className={inputClass('min-h-[120px]')} id="offer-description" placeholder="Describe the offer" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="offer-discount">
            Discount (% )
          </label>
          <input
            className={inputClass()}
            id="offer-discount"
            max={100}
            min={0}
            placeholder="10"
            required
            type="number"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="offer-expiry">
            Expires on
          </label>
          <input className={inputClass()} id="offer-expiry" required type="date" />
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
  return cn('rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none', extra);
}
