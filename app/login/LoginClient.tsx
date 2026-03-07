"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [nextPath, setNextPath] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/dashboard";
    setNextPath(next);
  }, []);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        window.location.href = nextPath;
      }
    }

    checkUser();
  }, [nextPath]);

  async function signInWithGoogle() {
    setBusy(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (error) {
      setStatus(error.message);
      setBusy(false);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (error) {
      setStatus(error.message);
      setBusy(false);
      return;
    }

    setStatus("Magic link sent. Check your inbox.");
    setBusy(false);
  }

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
            Continue with Google or receive a magic link.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={signInWithGoogle}
              disabled={busy}
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
            >
              Continue with Google
            </button>

            <form onSubmit={sendMagicLink} className="space-y-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 disabled:opacity-60"
              >
                Send Magic Link
              </button>
            </form>

            {status && (
              <p className="pt-2 text-sm text-white/70" aria-live="polite">
                {status}
              </p>
            )}
          </div>

          <p className="mt-8 text-xs text-white/50">
            Built for clarity, not noise.
          </p>
        </div>
      </div>
    </main>
  );
}