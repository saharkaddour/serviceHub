import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold text-ink">You’re offline</h1>
      <p className="mt-2 text-sm text-text-secondary">
        ServiceHub will show saved profile and address data when you have visited those pages
        before.
      </p>
      <Link href="/" className="mt-4 inline-block font-semibold text-accent">
        Back to ServiceHub
      </Link>
    </main>
  );
}
