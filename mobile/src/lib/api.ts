import { buildUrl } from '../shared/routes';

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  params?: Record<string, string | number>
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      // Ignore malformed error bodies.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
