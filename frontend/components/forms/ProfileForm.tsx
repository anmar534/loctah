'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { updateProfile } from '@/lib/api/auth';

export default function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timerId = setTimeout(() => {
        setSuccess(false);
      }, 3000);

      // Cleanup: clear timer on unmount or when success changes
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [success]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Extract form data using FormData API
      const formData = new FormData(event.currentTarget);
      
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;

      // Validate required fields
      if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
        setError('First name, last name, and email are required.');
        setLoading(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      // Construct the full name
      const name = `${firstName.trim()} ${lastName.trim()}`;

      // Submit profile update with only allowed fields
      await updateProfile({
        name,
        phone: phone?.trim() || null,
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
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
      
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800" role="status">
          Profile updated successfully!
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="First name" htmlFor="profile-first-name">
          <input
            className={inputClass()}
            id="profile-first-name"
            name="firstName"
            placeholder="First name"
            required
          />
        </Field>
        <Field label="Last name" htmlFor="profile-last-name">
          <input
            className={inputClass()}
            id="profile-last-name"
            name="lastName"
            placeholder="Last name"
            required
          />
        </Field>
      </div>
      <Field label="Email" htmlFor="profile-email">
        <input
          className={inputClass()}
          id="profile-email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </Field>
      <Field label="Phone" htmlFor="profile-phone">
        <input
          className={inputClass()}
          id="profile-phone"
          name="phone"
          placeholder="+971 50 123 4567"
        />
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
  return cn(
    'rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
    extra
  );
}
