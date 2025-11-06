'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LoginForm() {
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
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClass()}
          id="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input className={inputClass()} id="password" required type="password" />
      </div>
      <button
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-xs text-slate-600">
        Don&apos;t have an account?{' '}
        <Link className="font-medium text-slate-900" href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}

function inputClass() {
  return cn('rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none');
}
