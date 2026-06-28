'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({
  label,
  pendingLabel,
  tone = 'primary'
}: {
  label: string;
  pendingLabel?: string;
  tone?: 'primary' | 'secondary';
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        tone === 'secondary'
          ? 'gh-button-secondary disabled:cursor-not-allowed disabled:opacity-60'
          : 'gh-button-primary disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      {pending ? pendingLabel || label : label}
    </button>
  );
}
