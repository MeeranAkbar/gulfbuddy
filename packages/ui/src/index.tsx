import { ReactNode } from 'react';

export function Surface({ children }: { children: ReactNode }) {
  return <div className="rounded-shell border border-white/70 bg-white/85 p-6 shadow-lift">{children}</div>;
}
