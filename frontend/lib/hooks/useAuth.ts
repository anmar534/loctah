'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types';
import * as authApi from '@/lib/api/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        
        // Check if auth token exists in localStorage or cookies
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setUser(null);
          return;
        }

        // Validate token and fetch current user
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser ?? null);
        setError(null);
      } catch (err) {
        // Token is invalid or expired, clear it
        console.error('Session restoration failed:', err);
        localStorage.removeItem('auth_token');
        setUser(null);
        setError(null); // Don't show error for expired sessions
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      
      if (!response) {
        throw new Error('Login failed: No response from server');
      }
      
      // Extract user and token from response
      const { user, token } = response;
      setUser(user ?? null);
      setError(null);
      
      // Store the real JWT token
      localStorage.setItem('auth_token', token);
    } catch (err) {
      setUser(null);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      setError(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('Logout failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout } as const;
}
