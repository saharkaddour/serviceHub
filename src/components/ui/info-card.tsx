import type { ReactNode } from "react";

export function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-warm-border bg-surface">
      {children}
    </div>
  );
}

type RowProps = {
  title: string;
  subtitle?: string;
  action?: string;
  onClick?: () => void;
};

export function InfoRow({ title, subtitle, action, onClick }: RowProps) {
  const content = (
    <div className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {subtitle ? <p className="text-xs text-text-secondary">{subtitle}</p> : null}
      </div>
      {action ? <span className="shrink-0 text-sm font-semibold text-accent">{action}</span> : null}
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full border-b border-warm-border last:border-b-0">
        {content}
      </button>
    );
  }
  return <div className="border-b border-warm-border last:border-b-0">{content}</div>;
}
