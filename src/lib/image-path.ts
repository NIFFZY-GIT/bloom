/**
 * Guards against storing image references that cannot survive the request that
 * created them.
 *
 * `URL.createObjectURL()` previews (`blob:https://host/<uuid>`) are scoped to the
 * browser document that made them. Persisting one produces a row that renders as a
 * broken image for everyone, forever — the admin who saved it sees it fine until
 * they reload. `data:` URIs are rejected for the same reason they don't belong in a
 * path column: they are payloads, not references.
 */
const REJECTED_SCHEMES = ['blob:', 'data:', 'javascript:', 'file:', 'about:'];

export function isStorableImagePath(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  return !REJECTED_SCHEMES.some(scheme => lower.startsWith(scheme));
}

/** Returns the path if it is safe to persist, otherwise null. */
export function toStorableImagePath(value: unknown): string | null {
  return isStorableImagePath(value) ? value.trim() : null;
}
