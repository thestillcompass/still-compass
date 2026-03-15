export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">

        {/* HERO */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Still Compass
          </h1>

          <p className="mt-4 text-lg text-white/70">
            Detect cognitive drift before your performance declines.
          </p>

          <p className="mt-4 text-sm text-white/50">
            A 10-second daily check-in that tracks energy, emotional signal,
            and cognitive load to understand when your alignment is drifting.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/login"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black"
            >
              Start Daily Check-In
            </a>

            <a
              href="/how-it-works"
              className="rounded-xl border border-white/20 px-6 py-3 text-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-24 grid gap-8 sm:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm tracking-wide text-white/60">
              DAILY CHECK-IN
            </h3>

            <p className="mt-3 text-sm text-white/80">
              Record three signals in under 10 seconds:
              emotional signal, vital energy, and cognitive load.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm tracking-wide text-white/60">
              SIGNAL ANALYSIS
            </h3>

            <p className="mt-3 text-sm text-white/80">
              Still Compass analyzes patterns across your recent check-ins.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm tracking-wide text-white/60">
              ALIGNMENT INSIGHTS
            </h3>

            <p className="mt-3 text-sm text-white/80">
              Detect drift risk, understand your signals, and adjust before
              performance declines.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}