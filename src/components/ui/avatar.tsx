export function Avatar({ name, size = 72 }: { name: string; size?: number }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length === 0
      ? "?"
      : parts.length === 1
        ? parts[0]!.slice(0, 1).toUpperCase()
        : (parts[0]!.slice(0, 1) + parts[parts.length - 1]!.slice(0, 1)).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full bg-warm-border font-bold text-ink"
      style={{ width: size, height: size, fontSize: size / 3 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
