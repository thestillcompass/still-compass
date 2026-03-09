"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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
  entry_date: string;
};

function detectPatternInsight(entries: Entry[]) {
  if (entries.length < 3) {
    return "Not enough data yet to identify a meaningful pattern.";
  }

  const recent = [...entries].slice(0, 3).reverse();

  const emotional = recent.map((e) => e.emotional_signal);
  const energy = recent.map((e) => e.vital_energy);
  const load = recent.map((e) => e.cognitive_load);

  const isIncreasing = (arr: number[]) => arr[0] < arr[1] && arr[1] <= arr[2];
  const isDecreasing = (arr: number[]) => arr[0] > arr[1] && arr[1] >= arr[2];

  if (isIncreasing(load)) {
    return "Cognitive load has increased across your recent alignments.";
  }

  if (isDecreasing(energy)) {
    return "Vital energy has been declining across recent entries.";
  }

  if (isDecreasing(emotional)) {
    return "Emotional signal has softened across your recent alignments.";
  }

  return "Your signals are relatively stable. No strong drift pattern detected yet.";
}

function detectWeeklyInsight(entries: Entry[]) {
  if (entries.length < 5) {
    return "Complete more daily alignments to unlock a stronger weekly insight.";
  }

  const recent = [...entries].slice(0, 7).reverse();

  const scores = recent.map((entry) =>
    computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    })
  );

  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const scoreDelta = lastScore - firstScore;

  const emotionalValues = recent.map((e) => e.emotional_signal);
  const energyValues = recent.map((e) => e.vital_energy);
  const loadValues = recent.map((e) => e.cognitive_load);

  const range = (arr: number[]) => Math.max(...arr) - Math.min(...arr);

  const emotionalRange = range(emotionalValues);
  const energyRange = range(energyValues);
  const loadRange = range(loadValues);

  const maxRange = Math.max(emotionalRange, energyRange, loadRange);

  if (scoreDelta <= -1) {
    return "This week, your alignment has trended downward. A lighter cognitive load may help restore clarity.";
  }

  if (scoreDelta >= 1) {
    return "This week, your alignment has improved steadily. Your current rhythm appears to be working.";
  }

  if (maxRange === loadRange && loadRange >= 2) {
    return "This week, cognitive load has been your most unstable signal.";
  }

  if (maxRange === energyRange && energyRange >= 2) {
    return "This week, vital energy has shown the most variation.";
  }

  if (maxRange === emotionalRange && emotionalRange >= 2) {
    return "This week, emotional signal has been your most variable input.";
  }

  return "This week, your signals were relatively stable. No major pattern shift detected.";
}

function detectSignalDriver(entry: Entry | null) {
  if (!entry) {
    return "No dominant signal driver detected yet.";
  }

  const emotionalDrag = 10 - entry.emotional_signal;
  const energyDrag = 10 - entry.vital_energy;
  const loadDrag = entry.cognitive_load;

  const maxValue = Math.max(emotionalDrag, energyDrag, loadDrag);

  if (maxValue === loadDrag && loadDrag >= 6) {
    return "Cognitive Load is the strongest source of drag right now.";
  }

  if (maxValue === energyDrag && energyDrag >= 4) {
    return "Vital Energy is the primary limiter of alignment right now.";
  }

  if (maxValue === emotionalDrag && emotionalDrag >= 4) {
    return "Emotional Signal appears to be the main driver of your current drift.";
  }

  return "No dominant signal driver detected yet.";
}

function detectContextInsight(entries: Entry[]) {
  if (entries.length < 4) {
    return "Not enough context data yet to identify a dominant pattern.";
  }

  const recent = [...entries].slice(0, 7);

  const grouped: Record<string, number[]> = {};

  for (const entry of recent) {
    const score = computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    });

    if (!grouped[entry.context]) {
      grouped[entry.context] = [];
    }

    grouped[entry.context].push(score);
  }

  const contexts = Object.entries(grouped)
    .map(([context, scores]) => ({
      context,
      average: scores.reduce((sum, value) => sum + value, 0) / scores.length,
    }));

  if (contexts.length < 2) {
    return "Not enough context variation yet to identify a dominant pattern.";
  }

  contexts.sort((a, b) => a.average - b.average);

  const lowest = contexts[0];
  const highest = contexts[contexts.length - 1];

  if (highest.average - lowest.average < 0.6) {
    return "No strong context effect is visible yet across your recent alignments.";
  }

  return `Your lowest recent alignment tends to occur in ${lowest.context} contexts. ${highest.context} contexts are showing stronger alignment.`;
}

function detectNoteInsight(entries: Entry[]) {
  const notes = entries
    .slice(0, 10)
    .map((e) => e.note?.toLowerCase().trim())
    .filter((note): note is string => Boolean(note));

  if (notes.length < 3) {
    return "Not enough written reflections yet to identify a note pattern.";
  }

  const buckets = {
    work: ["work", "meeting", "meetings", "deadline", "client", "office", "project"],
    sleep: ["sleep", "tired", "rest", "exhausted", "fatigue", "fatigued"],
    people: ["people", "team", "friend", "family", "conversation", "social"],
    stress: ["stress", "stressed", "pressure", "anxious", "overwhelmed", "overload"],
    progress: ["progress", "momentum", "stuck", "blocked", "moving", "productive"],
    health: ["health", "exercise", "walk", "sick", "ill", "body", "workout"],
  };

  const counts: Record<string, number> = {
    work: 0,
    sleep: 0,
    people: 0,
    stress: 0,
    progress: 0,
    health: 0,
  };

  for (const note of notes) {
    for (const [bucket, keywords] of Object.entries(buckets)) {
      if (keywords.some((word) => note.includes(word))) {
        counts[bucket] += 1;
      }
    }
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topBucket, topCount] = sorted[0];

  if (!topBucket || topCount < 2) {
    return "No strong written theme is visible yet across your recent reflections.";
  }

  const messages: Record<string, string> = {
    work: "Your recent notes frequently mention work pressure or meeting load.",
    sleep: "Your recent notes suggest sleep or recovery may be a recurring theme.",
    people: "Your recent reflections repeatedly mention people or social dynamics.",
    stress: "Stress and pressure appear repeatedly in your recent notes.",
    progress: "Progress and momentum appear to be recurring themes in your reflections.",
    health: "Health and physical state appear repeatedly in your recent notes.",
  };

  return messages[topBucket] ?? "A repeated written theme is emerging in your recent reflections.";
}

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [latest, setLatest] = useState<Entry | null>(null);
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

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
  .eq("user_id", userData.user?.id)
  .order("created_at", { ascending: false })
  .limit(30);

      if (!mounted) return;

      if (!error && data) {
  const entries = data as Entry[];
  setRecentEntries(entries);

  const latestEntry = entries[0] ?? null;
  setLatest(latestEntry);

  const today = new Date().toISOString().split("T")[0];
  const checkedToday = entries.some((entry) => entry.entry_date === today);

  setHasCheckedInToday(checkedToday);
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
  const signalDriver = useMemo(() => detectSignalDriver(latest), [latest]);
  
  const adjustment = score
  ? microAdjustment(score, signalDriver)
  : null;

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

  const chartData = trendScores.map((score, index) => ({
    day: index + 1,
    score,
  }));

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
      const nextDate = next.toISOString().split("T")[0];

      if (nextDate === expected) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [recentEntries]);

  const patternInsight = useMemo(() => detectPatternInsight(recentEntries), [recentEntries]);
  const weeklyInsight = useMemo(() => detectWeeklyInsight(recentEntries), [recentEntries]);

  const contextInsight = useMemo(() => detectContextInsight(recentEntries), [recentEntries]);
  const noteInsight = useMemo(() => detectNoteInsight(recentEntries), [recentEntries]);

  const baselineScores = useMemo(() => {
    return [...recentEntries]
      .slice(0, 14)
      .map((entry) =>
        computeCompassScore({
          emotional_signal: entry.emotional_signal,
          vital_energy: entry.vital_energy,
          cognitive_load: entry.cognitive_load,
        })
      );
  }, [recentEntries]);

  const baseline =
    baselineScores.length >= 14
      ? baselineScores.reduce((sum, value) => sum + value, 0) / baselineScores.length
      : null;

  const baselineDelta =
    baseline !== null && score !== null && score !== undefined
      ? score - baseline
      : null;

  let baselineMessage =
    "Complete 14 daily alignments to establish your baseline.";

  if (baseline !== null && baselineDelta !== null) {
    if (baselineDelta >= 0.5) {
      baselineMessage = "You are currently above your usual alignment range.";
    } else if (baselineDelta <= -0.5) {
      baselineMessage = "You are currently below your usual alignment range.";
    } else {
      baselineMessage = "You are currently close to your usual alignment range.";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        
        <div className="flex items-center justify-between">
  <Link href="/" className="text-sm text-white/70 hover:text-white">
    ← Home
  </Link>

  <div className="flex items-center gap-3">
    {hasCheckedInToday ? (
      <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/70">
        ✓ Alignment logged today
      </div>
    ) : (
      <Link
        href="/check-in"
        className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
      >
        New check-in →
      </Link>
    )}

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
          <p className="mt-2 text-white/65">
  {hasCheckedInToday
    ? "Today’s alignment is logged. Review your signal and return tomorrow."
    : "Alignment check for today."}
</p>
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

        {/* Core signal */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-xs tracking-wide text-white/60">
            COMPASS SCORE
          </div>

          <div className={`mt-3 text-6xl font-semibold tracking-tight ${scoreColor}`}>
          {loading ? "…" : score !== null && score !== undefined ? score.toFixed(1) : "—"}
          </div>

          <div className="mt-3 text-sm text-white/70">
            {loading ? "Loading latest signal…" : drift?.status ?? "No signal yet."}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs tracking-wide text-white/60">DRIFT STATUS</div>
            <div className="mt-2 text-xl font-semibold">{drift?.status ?? "—"}</div>
            <div className="mt-2 text-sm text-white/70">
              {drift?.message ?? "No signal yet."}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
            <div className="text-xs tracking-wide text-white/60">INTERPRETATION</div>
            <div className="mt-2 text-sm text-white/80">
              {loading
                ? "Interpreting signal…"
                : interpretation ?? "Log a check-in to receive interpretation."}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs tracking-wide text-white/60">TODAY&apos;S ADJUSTMENT</div>
          <div className="mt-2 text-sm text-white/80">
            {adjustment ?? "Log a check-in to receive guidance."}
          </div>
        </div>

        {/* Intelligence layer */}
        <div className="mt-10">
          <div className="text-xs tracking-wide text-white/40">INTELLIGENCE</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">SIGNAL DRIVER</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Identifying dominant driver…" : signalDriver}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">CONTEXT INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Analyzing context patterns…" : contextInsight}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">PATTERN INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Detecting patterns…" : patternInsight}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">WEEKLY INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Analyzing weekly signal…" : weeklyInsight}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary layer */}
        <div className="mt-10">
          <div className="text-xs tracking-wide text-white/40">SECONDARY SIGNALS</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">PERSONAL BASELINE</div>

              {loading ? (
                <div className="mt-2 text-sm text-white/70">Calculating baseline…</div>
              ) : baseline !== null ? (
                <>
                  <div className="mt-2 text-2xl font-semibold">{baseline.toFixed(1)}</div>
                  <div className="mt-2 text-sm text-white/70">
                    Current deviation:{" "}
                    <span className="text-white">
                      {baselineDelta !== null
                        ? `${baselineDelta >= 0 ? "+" : ""}${baselineDelta.toFixed(1)}`
                        : "—"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/80">{baselineMessage}</div>
                </>
              ) : (
                <div className="mt-2 text-sm text-white/80">{baselineMessage}</div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">ALIGNMENT RHYTHM</div>
              <div className="mt-2 text-2xl font-semibold">{loading ? "…" : rhythmDays}</div>
              <div className="mt-2 text-sm text-white/70">
                {loading
                  ? "Loading rhythm…"
                  : rhythmDays === 1
                  ? "1 consecutive day"
                  : `${rhythmDays} consecutive days`}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <div className="text-xs tracking-wide text-white/60">7-DAY TREND</div>

              <div className="mt-4 h-40">
                {loading ? (
                  <div className="text-white/60">Loading trend…</div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Tooltip
                        contentStyle={{
                          background: "#000",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-white/60">Not enough data yet.</div>
                )}
              </div>

              <div className="mt-2 text-xs text-white/50">
                Most recent 7 alignment scores, oldest to newest.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <div className="text-xs tracking-wide text-white/60">NOTE INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Analyzing reflection notes…" : noteInsight}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <div className="text-xs tracking-wide text-white/60">LATEST CHECK-IN</div>

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
      </div>
    </main>
  );
}