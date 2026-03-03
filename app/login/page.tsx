import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            ← Back
          </Link>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Access The Still Compass
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Authentication goes live tomorrow (Day 2: Supabase).
          </p>

          <div className="mt-8 space-y-3">
            <button
              disabled
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black opacity-60"
            >
              Continue with Google
            </button>
            <button
              disabled
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 opacity-60"
            >
              Send Magic Link
            </button>
          </div>

          <p className="mt-8 text-xs text-white/50">
            Built for clarity, not noise.
          </p>
        </div>
      </div>
    </main>
  );
}