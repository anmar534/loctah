'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INPUT_CLASS = 'rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus-visible:ring focus-visible:ring-slate-300 focus-visible:ring-offset-2';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // Example: await register({ name, email, password });
      
      // Log only non-sensitive fields for debugging
      console.log('Registering user:', { name, email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // On success, redirect to login page
      router.push('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <input
          className={INPUT_CLASS}
          id="name"
          placeholder="Alex Example"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          className={INPUT_CLASS}
          id="email"
          placeholder="you@example.com"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          className={INPUT_CLASS}
          id="password"
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-xs text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-slate-900" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
