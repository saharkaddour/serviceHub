"use client";

export function SuccessBanner({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] bg-ink px-4 py-3 text-surface">
      <p className="flex-1 text-sm">{message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss" className="text-surface">
        ×
      </button>
    </div>
  );
}
