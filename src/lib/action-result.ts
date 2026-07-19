/**
 * Result contract for admin server actions.
 *
 * Server actions used to return `void` and log failures with `console.error`, so a
 * failed delete looked identical to a successful one from the admin's side — the
 * spinner stopped, the row stayed, and the reason was only ever visible in server
 * logs. Returning a result lets the client render what actually went wrong.
 */
export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

export function actionOk(message?: string): ActionResult {
  return { ok: true, message };
}

export function actionError(message: string): ActionResult {
  return { ok: false, message };
}

/**
 * Turn a thrown error into a reportable message. Postgres errors carry useful
 * `detail`/`constraint` text that a bare `error.message` drops.
 */
export function describeError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    const detail = (error as { detail?: unknown }).detail;
    return typeof detail === 'string' && detail.trim()
      ? `${error.message} (${detail})`
      : error.message;
  }
  return fallback;
}
