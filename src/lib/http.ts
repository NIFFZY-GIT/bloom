/**
 * Helpers for reading fetch responses on the client.
 */

/**
 * Read a fetch Response as JSON, or throw an Error with a message worth showing.
 *
 * Not every response comes from a route handler. Infrastructure in front of the app
 * answers some requests itself — nginx rejects a body larger than its
 * `client_max_body_size` with an HTML "413 Request Entity Too Large" page, and the
 * request never reaches Next.js. Calling `response.json()` on that HTML throws
 * `Unexpected token '<', "<html> <h"... is not valid JSON`, which is what admins saw
 * instead of being told their image was too big.
 *
 * @param fallbackMessage used when the server gave us nothing better to say
 */
export async function readJson<T = unknown>(
  response: Response,
  fallbackMessage = 'Request failed',
): Promise<T> {
  const raw = await response.text();

  let data: unknown = null;
  let isJson = false;
  try {
    data = raw.length ? JSON.parse(raw) : null;
    isJson = true;
  } catch {
    isJson = false;
  }

  if (!isJson) {
    // A non-JSON body means a proxy/server answered instead of our route handler.
    if (response.status === 413) {
      throw new Error(
        'The file is too large to upload. Please use a smaller file, or ask an administrator to raise the server upload limit.',
      );
    }
    throw new Error(
      response.ok
        ? fallbackMessage
        : `${fallbackMessage} (server returned ${response.status} ${response.statusText}).`.trim(),
    );
  }

  if (!response.ok) {
    throw new Error(serverMessage(data) ?? fallbackMessage);
  }

  return data as T;
}

/** Route handlers report failures as `message` in most places and `error` in a few. */
function serverMessage(data: unknown): string | null {
  const body = data as { message?: unknown; error?: unknown } | null;
  for (const candidate of [body?.message, body?.error]) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }
  return null;
}
