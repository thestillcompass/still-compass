import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-white/70 hover:text-white">
          ← Back
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          How it works
        </h1>

        <p className="mt-4 text-white/70 leading-relaxed">
          The Still Compass turns daily signals into a Compass Score, detects
          drift early, and recommends one precise micro-adjustment.
        </p>

        <ol className="mt-10 space-y-6 text-white/80">
          <li>
            <div className="text-white/60 text-xs tracking-wide">01</div>
            <div className="mt-1 font-medium">Log your daily signals</div>
            <div className="mt-1 text-white/70">
              Emotional Signal, Vital Energy, Cognitive Load — plus one quick
              context tag.
            </div>
          </li>
          <li>
            <div className="text-white/60 text-xs tracking-wide">02</div>
            <div className="mt-1 font-medium">See your Compass Score</div>
            <div className="mt-1 text-white/70">
              A simple indicator of alignment stability (not happiness).
            </div>
          </li>
          <li>
            <div className="text-white/60 text-xs tracking-wide">03</div>
            <div className="mt-1 font-medium">Detect drift</div>
            <div className="mt-1 text-white/70">
              Drift Status shows when your system is trending off course.
            </div>
          </li>
          <li>
            <div className="text-white/60 text-xs tracking-wide">04</div>
            <div className="mt-1 font-medium">Apply one adjustment</div>
            <div className="mt-1 text-white/70">
              One precise micro-action per day. No noise.
            </div>
          </li>
        </ol>

        <div className="mt-12">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            Start check-in →
          </Link>
        </div>
      </div>
    </main>
  );
}