import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#cfded6] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-[#315451]">
          <ShieldCheck size={17} />
          GraphQL + SQLite MVP
        </div>
        <h1 className="max-w-4xl font-display text-6xl font-black leading-[0.95] text-[#102f2f] md:text-8xl">
          Child Health Record
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526d68]">
          A practical health ledger for baby profiles, consultations, vaccines and medical costs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[#0f3d3e] px-5 text-sm font-black text-white shadow-ink transition hover:-translate-y-0.5"
          >
            Create account
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-md border border-[#cad7d2] bg-white px-5 text-sm font-black text-[#173536] transition hover:bg-[#f4faf7]"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
