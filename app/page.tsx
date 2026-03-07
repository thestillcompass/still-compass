"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error || !data.user) {
        setUserName(null);
        setUserEmail(null);
        setLoadingUser(false);
        return;
      }

      const name =
        (data.user.user_metadata?.full_name as string | undefined) ||
        (data.user.user_metadata?.name as string | undefined) ||
        null;

      setUserName(name);
      setUserEmail(data.user.email ?? null);
      setLoadingUser(false);
    }

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen text-white">
      <div className="min-h-screen bg-grid bg-gradient-to-b from-black via-zinc-950 to-black">
        <header className="mx-auto flex max-w-6xl items-start justify-between px-6 py-6">
          <div className="flex flex-col">
            <div className="text-sm font-semibold tracking-tight text-white/90">
              The Still Compass
            </div>

            <div className="mt-1 text-xs text-white/50">
              Built for clarity, not noise.
            </div>
          </div>

          <nav className="flex items-center gap-5">
            <Link
              href="#how"
              className="text-sm text-white/70 transition hover:text-white"
            >
              How it works
            </Link>

            {loadingUser ? null : userEmail ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login?next=/dashboard"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
              >
                Sign in
              </Link>
            )}
          </nav>
        </header>

        <section className="mx-auto max-w-6xl px-6 pb-10 relative">
          <div className="hero-glow" />

          <div className="mx-auto flex min-h-[58vh] max-w-3xl flex-col items-center justify-center text-center">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur">
              Pattern intelligence for high-performing overthinkers
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-6xl">
              Detect drift.
              <span className="block text-white/80">Regain clarity.</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
              Still Compass transforms your daily signals into a{" "}
              <span className="text-white/90">Compass Score</span>, detects drift
              early, and surfaces one precise adjustment to restore alignment.
            </p>

            {!loadingUser && userEmail ? (
              <p className="mt-5 text-sm text-white/60">
                {userName ? (
                  <>
                    Welcome back,{" "}
                    <span className="text-white/85">{userName}</span>.
                  </>
                ) : (
                  <>
                    You&apos;re signed in as{" "}
                    <span className="text-white/85">{userEmail}</span>.
                  </>
                )}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              {loadingUser ? (
                <div className="text-sm text-white/60">Loading…</div>
              ) : userEmail ? (
                <>
                  <Link
                    href="/check-in"
                    className="group inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
                  >
                    Continue daily alignment
                    <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 sm:w-auto"
                  >
                    Go to dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login?next=/check-in"
                    className="group inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
                  >
                    Start daily alignment
                    <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/login?next=/dashboard"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 sm:w-auto"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          <div id="how" className="mx-auto mt-2 max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs tracking-wide text-white/60">
                  DAILY ALIGNMENT
                </div>
                <p className="mt-3 text-sm text-white/75">
                  Log three signals in under a minute: Emotional Signal, Vital
                  Energy, and Cognitive Load.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs tracking-wide text-white/60">
                  COMPASS SCORE
                </div>
                <p className="mt-3 text-sm text-white/75">
                  Transform those signals into a daily alignment reading and
                  detect early drift before it compounds.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs tracking-wide text-white/60">
                  PRECISE ADJUSTMENT
                </div>
                <p className="mt-3 text-sm text-white/75">
                  Receive one focused adjustment designed to reduce drag and
                  restore clarity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}