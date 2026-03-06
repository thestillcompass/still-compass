"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [name, setName] = useState<string | null>(null);
  const [latest, setLatest] = useState<Entry | null>(null);
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!mounted) return;

      setEmail(userData.user?.email ?? null);

      const displayName =
        (userData.user?.user_metadata?.full_name as string | undefined) ||
        (userData.user?.user_metadata?.name as string | undefined) ||
        null;

      setName(displayName ?? null);

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (!mounted) return;

      if (!error && data) {
        const entries = data as Entry[];
        setRecentEntries(entries);
        setLatest(entries[0] ?? null);
      }

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

  let interpretation: string | null = null;

  if (score !== null && score !== undefined) {
    if (score >= 8.5) {
      interpretation =
        "Your signals indicate strong alignment today. Maintain your current rhythm.";
    } else if (score >= 7) {
      interpretation =
        "Your signals suggest mild drift today. Small adjustments may restore clarity.";
    } else {
      interpretation =
        "Your signals indicate cognitive overload or emotional drag. Reducing decision load may help restore balance.";
    }
  }

  let scoreColor = "text-white";

  if (score !== null && score !== undefined) {
    if (score >= 8.5) scoreColor = "text-green-400";
    else if (score >= 7) scoreColor = "text-amber-400";
    else scoreColor = "text-red-400";
  }

  const trendScores = [...recentEntries]
    .slice(0, 7)
    .reverse()
    .map((entry) =>
      computeCompassScore({
        emotional_signal: entry.emotional_signal,
        vital_energy: entry.vital_energy,
        cognitive_load: entry.cognitive_load,
      })
    );

  const trendText = trendScores.map((s) => s.toFixed(1)).join(" → ");

  const previousScore =
    trendScores.length >= 2 ? trendScores[trendScores.length - 2] : null;

  const scoreDrop =
    score !== null &&
    score !== undefined &&
    previousScore !== null &&
    previousScore !== undefined
      ? previousScore - score
      : null;

  const showDriftAlert = scoreDrop !== null && scoreDrop >= 1.2;

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const welcomeName = name || email || "there";

  const rhythmDays = useMemo(() => {
    if (recentEntries.length === 0) return 0;

    const uniqueDays = Array.from(
      new Set(
        recentEntries.map((entry) =>
          new Date(entry.created_at).toISOString().split("T")[0]
        )
      )
    ).sort((a, b) => (a < b ? 1 : -1));

    if (uniqueDays.length === 0) return 0;

    let streak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const current = new Date(uniqueDays[i - 1]);
      const next = new Date(uniqueDays[i]);

      current.setDate(current.getDate() - 1);

      const expected = current.toISOString().split("T")[0];

      if (next === expected) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [recentEntries]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
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

        <div className="mt-10">
          <p className="text-sm text-white/50">{todayLabel}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {welcomeName}.
          </h1>
          <p className="mt-2 text-white/65">Alignment check for today.</p>
        </div>

        {showDriftAlert && (
          <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
            <div className="text-xs tracking-wide text-red-300">
              DRIFT ALERT
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              Your Compass Score dropped significantly.
            </div>
            <div className="mt-2 text-sm text-white/75">
              Since your previous alignment, your score has fallen by{" "}
              <span className="text-white">{scoreDrop?.toFixed(1)}</span> points.
            </div>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-xs tracking-wide text-white/60">
            COMPASS SCORE
          </div>

          <div
            className={`mt-3 text-6xl font-semibold tracking-tight ${scoreColor}`}
          >
            {loading ? "…" : score ?? "—"}
          </div>

          <div className="mt-3 text-sm text-white/70">
            {loading ? "Loading latest signal…" : drift?.status ?? "No signal yet."}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              INTERPRETATION
            </div>

            <div className="mt-2 text-sm text-white/80">
              {loading
                ? "Interpreting signal…"
                : interpretation ?? "Log a check-in to receive interpretation."}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">
              TODAY&apos;S ADJUSTMENT
            </div>

            <div className="mt-2 text-sm text-white/80">
              {adjustment ?? "Log a check-in to receive guidance."}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">
              ALIGNMENT RHYTHM
            </div>

            <div className="mt-2 text-2xl font-semibold">
              {loading ? "…" : rhythmDays}
            </div>

            <div className="mt-2 text-sm text-white/70">
              {loading
                ? "Loading rhythm…"
                : rhythmDays === 1
                ? "1 consecutive day"
                : `${rhythmDays} consecutive days`}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
            <div className="text-xs tracking-wide text-white/60">
              7-DAY TREND
            </div>

            <div className="mt-3 text-sm text-white/85">
              {loading
                ? "Loading trend…"
                : trendScores.length > 0
                ? trendText
                : "Not enough data yet."}
            </div>

            <div className="mt-2 text-xs text-white/50">
              Most recent 7 alignment scores, oldest to newest.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
            <div className="text-xs tracking-wide text-white/60">
              LATEST CHECK-IN
            </div>

            {loading ? (
              <div className="mt-3 text-white/60">Loading…</div>
            ) : latest ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 text-white/80">
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
                  <div>
                    Context: <span className="text-white">{latest.context}</span>
                  </div>
                </div>

                <div>
                  {latest.note ? (
                    <div className="text-white/70">“{latest.note}”</div>
                  ) : (
                    <div className="text-white/50">No note recorded.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-white/60">Log your first check-in.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}