const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

/**
 * Custom error class for API requests that includes HTTP status code.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetches data from the API.
 * 
 * @template T - The expected response type
 * @returns Promise<T | undefined> - Returns undefined for 204 No Content responses
 * 
 * Note: For 204 responses (e.g., logout, delete operations), the function returns undefined.
 * Callers should handle this appropriately or use `void` as the type parameter for operations
 * that don't return data.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T | undefined> {
  const url = new URL(path, API_BASE_URL);

  // Extract params and headers from options to process them separately
  const { params, headers: optHeaders, ...rest } = options;

  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .forEach(([key, value]) => url.searchParams.set(key, String(value)));
  }

  // Get auth token from localStorage (if available)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  // Merge headers with Content-Type default and Authorization if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(optHeaders ?? {}),
  };

  const response = await fetch(url.toString(), {
    headers,
    ...rest,
  });

  if (!response.ok) {
    let errorMessage: string;
    
    // Read body as text once to avoid consuming it multiple times
    const bodyText = await response.text();
    
    try {
      // Attempt to parse as JSON to extract structured error fields
      const errorData = JSON.parse(bodyText);
      
      // Extract message from common error response formats
      if (typeof errorData === 'object' && errorData !== null) {
        errorMessage = errorData.message || errorData.error || bodyText;
      } else {
        errorMessage = String(errorData);
      }
    } catch {
      // Use raw text if JSON parsing fails
      errorMessage = bodyText || 'Unknown error';
    }
    
    throw new ApiError(
      response.status,
      response.statusText,
      errorMessage
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return (await response.json()) as T;
}
