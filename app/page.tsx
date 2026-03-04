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
      {/* Background */}
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Top nav */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="text-sm font-semibold tracking-tight text-white/90">
            The Still Compass
          </div>

          <nav className="flex items-center gap-4">
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

        {/* Hero */}
        <section className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Detect drift.
              <span className="block text-white/80">Regain clarity.</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
              Pattern intelligence for high-performing overthinkers.
            </p>

            {/* Logged-in message */}
            {!loadingUser && userEmail ? (
              <p className="mt-6 text-sm text-white/60">
                {userName ? (
                  <>
                    Welcome back,{" "}
                    <span className="text-white/85">{userName}</span>.
                  </>
                ) : (
                  <>
                    You’re signed in as{" "}
                    <span className="text-white/85">{userEmail}</span>.
                  </>
                )}
              </p>
            ) : null}

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {loadingUser ? (
                <div className="text-sm text-white/60">Loading…</div>
              ) : userEmail ? (
                <>
                  <Link
                    href="/check-in"
                    className="group inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
                  >
                    Start today’s check-in
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
                    Start check-in
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

            {/* Subtle footer line */}
            <p className="mt-12 text-xs text-white/50">
              Built for clarity, not noise.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="mx-auto max-w-6xl px-6 pb-16 pt-6"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">
                1. CHECK IN
              </div>
              <p className="mt-3 text-sm text-white/75">
                Log three signals in under 30 seconds: Emotional Signal, Vital
                Energy, Cognitive Load.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">
                2. DETECT DRIFT
              </div>
              <p className="mt-3 text-sm text-white/75">
                Still Compass converts your signals into a Compass Score and a
                Drift Status.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">
                3. MICRO-ADJUST
              </div>
              <p className="mt-3 text-sm text-white/75">
                One daily correction — designed to reduce cognitive drag and
                restore alignment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}