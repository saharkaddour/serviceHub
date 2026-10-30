"use client";

import Link from "next/link";

type Item = { href?: string; label: string; soon?: boolean };

const customer: Item[] = [
  { label: "Home", soon: true },
  { label: "My Bookings", soon: true },
  { label: "Explore", soon: true },
  { href: "/profile", label: "Profile" },
];

const provider: Item[] = [
  { href: "/provider/home", label: "Home" },
  { label: "Requests", soon: true },
  { label: "Explore", soon: true },
  { label: "Profile", soon: true },
];

export function BottomNav({
  variant,
  current,
}: {
  variant: "customer" | "provider";
  current: string;
}) {
  const items = variant === "customer" ? customer : provider;
  return (
    <nav className="border-t border-warm-border bg-surface lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = item.href === current;
          const className = `flex h-14 items-center justify-center px-1 text-center text-[11px] font-medium ${
            active ? "text-accent" : "text-text-secondary"
          }`;
          if (item.href) {
            return (
              <li key={item.label}>
                <Link href={item.href} className={className}>
                  {item.label}
                </Link>
              </li>
            );
          }
          return (
            <li key={item.label}>
              <span className={`${className} cursor-default`}>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav({
  variant,
  current,
}: {
  variant: "customer" | "provider";
  current: string;
}) {
  const items = variant === "customer" ? customer : provider;
  return (
    <nav className="hidden w-52 shrink-0 border-r border-warm-border bg-surface p-4 lg:block">
      <p className="mb-4 text-sm font-bold text-ink">ServiceHub</p>
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.href === current;
          const className = `block rounded-[10px] px-3 py-2 text-sm ${
            active ? "bg-cream font-semibold text-accent" : "text-text-secondary"
          }`;
          if (item.href) {
            return (
              <li key={item.label}>
                <Link href={item.href} className={className}>
                  {item.label}
                </Link>
              </li>
            );
          }
          return (
            <li key={item.label}>
              <span className={className}>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
