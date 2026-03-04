"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { computeCompassScore } from "@/lib/compass";
import { computeDriftStatus, microAdjustment } from "@/lib/drift";

type Entry = {
  id: string;
  emotional_signal: number;
  vital_energy: number;
  cognitive_load: number;
  context: string;
  note: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [latest, setLatest] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const name =
  (userData.user?.user_metadata?.full_name as string | undefined) ||
  (userData.user?.user_metadata?.name as string | undefined) ||
  null;
  <h1 className="text-3xl font-semibold tracking-tight">
  {name ? `Welcome, ${name}` : "Welcome"}
</h1>
      if (!mounted) return;

      setEmail(userData.user?.email ?? null);

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!mounted) return;

      if (!error) setLatest((data?.[0] as Entry) ?? null);
      setLoading(false);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const score =
    latest &&
    computeCompassScore({
      emotional_signal: latest.emotional_signal,
      vital_energy: latest.vital_energy,
      cognitive_load: latest.cognitive_load,
    });
  const drift = score ? computeDriftStatus(score) : null;
  const adjustment = score ? microAdjustment(score) : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            ← Home
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/check-in"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              New check-in →
            </Link>

            <button
              onClick={signOut}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-white/70">
            Signed in as: <span className="text-white/90">{email ?? "…"}</span>
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">
              COMPASS SCORE
            </div>
            <div className="mt-2 text-4xl font-semibold">
              {loading ? "…" : score ?? "—"}
            </div>
            <div className="mt-2 text-sm text-white/70">
              {loading
                ? "Loading latest entry…"
                : latest
                ? `Context: ${latest.context}`
                : "No entries yet."}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">
              LATEST CHECK-IN
            </div>

            {loading ? (
              <div className="mt-3 text-white/60">Loading…</div>
            ) : latest ? (
              <div className="mt-3 space-y-2 text-white/80">
                <div>
                  Emotional Signal:{" "}
                  <span className="text-white">{latest.emotional_signal}</span>
                </div>
                <div>
                  Vital Energy:{" "}
                  <span className="text-white">{latest.vital_energy}</span>
                </div>
                <div>
                  Cognitive Load:{" "}
                  <span className="text-white">{latest.cognitive_load}</span>
                </div>
                {latest.note ? (
                  <div className="pt-2 text-white/70">“{latest.note}”</div>
                ) : (
                  <div className="pt-2 text-white/50">No note.</div>
                )}
              </div>
            ) : (
              <div className="mt-3 text-white/60">Log your first check-in.</div>
            )}
          </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">
              DRIFT STATUS
            </div>

            <div className="mt-2 text-xl font-semibold">
              {drift?.status ?? "—"}
            </div>

            <div className="mt-2 text-sm text-white/70">
              {drift?.message ?? "No signal yet."}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">
              TODAY'S ADJUSTMENT
            </div>

            <div className="mt-2 text-sm text-white/80">
              {adjustment ?? "Log a check-in to receive guidance."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}