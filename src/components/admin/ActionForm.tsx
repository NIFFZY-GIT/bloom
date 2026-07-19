'use client';

import { useActionState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import type { ActionResult } from '@/lib/action-result';

type ActionFormProps = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * A `<form>` bound to a server action that reports why the action failed.
 *
 * The admin status dropdowns previously posted to actions returning `void`: on
 * failure the select simply snapped back to its old value with no explanation.
 */
export default function ActionForm({ action, children, className, style }: ActionFormProps) {
  const [state, formAction] = useActionState(action, null);

  return (
    <div>
      <form action={formAction} className={className} style={style}>
        {children}
      </form>
      {state && !state.ok ? (
        <p
          role="alert"
          style={{ fontSize: '0.75rem', color: '#dc2626', margin: '0.35rem 0 0' }}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
