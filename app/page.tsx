// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* subtle gradient + vignette */}
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_80%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />
        <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_35%,black,transparent)] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6">
          {/* Top bar */}
          <header className="flex items-center justify-between py-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur" />
              <span className="text-sm font-medium tracking-wide text-white/90">
                The Still Compass
              </span>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
              <Link
                href="/how-it-works"
                className="transition hover:text-white"
              >
                How it works
              </Link>
              <Link href="/login" className="transition hover:text-white">
                Sign in
              </Link>
            </nav>
          </header>

          {/* Hero */}
          <section className="flex flex-1 items-center">
            <div className="w-full">
              <div className="mx-auto max-w-3xl text-center">
                <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white/70 backdrop-blur">
                  Pattern intelligence for high-performing overthinkers
                </p>

                <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                  Detect drift.
                  <span className="block text-white/90">Regain clarity.</span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                  The Still Compass turns your daily signals into a Compass Score,
                  highlights drift early, and recommends one precise micro-adjustment
                  to bring you back into alignment.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
  href="/login?next=/check-in"
  className="group inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
>
  Start check-in
  <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
    →
  </span>
</Link>

                  <Link
                    href="/how-it-works"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 sm:w-auto"
                  >
                    How it works
                  </Link>
                </div>

                {/* Subtle credibility row */}
                <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur">
                    <div className="text-xs font-medium tracking-wide text-white/60">
                      Compass Score
                    </div>
                    <div className="mt-1 text-sm text-white/85">
                      A simple signal of alignment stability.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur">
                    <div className="text-xs font-medium tracking-wide text-white/60">
                      Drift Status
                    </div>
                    <div className="mt-1 text-sm text-white/85">
                      Early warning before overwhelm compounds.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur">
                    <div className="text-xs font-medium tracking-wide text-white/60">
                      One adjustment
                    </div>
                    <div className="mt-1 text-sm text-white/85">
                      Daily micro-action, not a list of advice.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-10">
            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
              <span>Built for clarity, not noise.</span>
              <span className="text-white/40">
                © {new Date().getFullYear()} The Still Compass
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}