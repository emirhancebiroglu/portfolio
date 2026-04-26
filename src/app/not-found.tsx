import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">This page doesn&apos;t exist.</h1>
      <Link href="/" className="text-[var(--color-accent)] underline underline-offset-4">
        Here&apos;s the way home.
      </Link>
    </main>
  );
}
