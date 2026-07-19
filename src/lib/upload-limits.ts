/**
 * The single source of truth for upload size limits.
 *
 * These were previously hard-coded per call site and had drifted: PlaceForm rejected
 * at 10MB while telling the user the limit was 15MB, and PackageForm capped at 4MB
 * while the API allowed 15MB. Import from here instead of writing a new literal.
 *
 * NOTE: nginx's `client_max_body_size` in front of the app is the real ceiling. It
 * must stay comfortably above MAX_UPLOAD_BYTES — a request over nginx's limit is
 * rejected with an HTML 413 before it ever reaches Next.js.
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Human-readable form of the limit, for user-facing messages. */
export const MAX_UPLOAD_LABEL = '10MB';

export function tooLargeMessage(subject = 'File'): string {
  return `${subject} is too large. Maximum size is ${MAX_UPLOAD_LABEL}.`;
}
