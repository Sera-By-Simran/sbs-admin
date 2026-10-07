/**
 * SÉRA Commerce Admin — Backend API Client
 * Sends authenticated requests to the backend API with the staff user's Supabase JWT.
 */

export interface ApiClientOptions {
  token?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';
  }

  async fetch<T>(path: string, options: RequestInit & ApiClientOptions = {}): Promise<T> {
    const { token, headers, ...rest } = options;
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const reqHeaders = new Headers();
    reqHeaders.set('Content-Type', 'application/json');

    if (headers) {
      Object.entries(headers).forEach(([k, v]) => {
        reqHeaders.set(k, v);
      });
    }

    if (token) {
      reqHeaders.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(url, {
      ...rest,
      headers: reqHeaders,
    });

    const data = await res.json();
    if (!res.ok || data.ok === false) {
      throw new Error(data.message || `API request failed with status ${res.status}`);
    }

    return data.data as T;
  }
}

export const apiClient = new ApiClient();
