'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProfileForm() {
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
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="First name" htmlFor="profile-first-name">
          <input className={inputClass()} id="profile-first-name" placeholder="First name" required />
        </Field>
        <Field label="Last name" htmlFor="profile-last-name">
          <input className={inputClass()} id="profile-last-name" placeholder="Last name" required />
        </Field>
      </div>
      <Field label="Email" htmlFor="profile-email">
        <input className={inputClass()} id="profile-email" placeholder="you@example.com" required type="email" />
      </Field>
      <Field label="Phone" htmlFor="profile-phone">
        <input className={inputClass()} id="profile-phone" placeholder="+971 50 123 4567" />
      </Field>
      <button
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? 'Saving…' : 'Save changes'}
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
