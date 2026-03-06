"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { computeCompassScore } from "@/lib/compass";

const CONTEXT_OPTIONS = ["Work", "Sleep", "People", "Health", "Progress", "Uncertainty"] as const;

export default function CheckInPage() {
  const [emotionalSignal, setEmotionalSignal] = useState(6);
  const [vitalEnergy, setVitalEnergy] = useState(6);
  const [cognitiveLoad, setCognitiveLoad] = useState(5);
  const [context, setContext] = useState<(typeof CONTEXT_OPTIONS)[number]>("Work");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [alreadyCheckedToday, setAlreadyCheckedToday] = useState(false);
  const [phase, setPhase] = useState<"idle" | "saving" | "calculating">("idle");

  useEffect(() => {
  async function checkTodayEntry() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("entries")
      .select("id")
      .eq("user_id", userData.user.id)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .limit(1);

    if (data && data.length > 0) {
      setAlreadyCheckedToday(true);
    }
  }

  checkTodayEntry();
}, []);

  const compassScore = computeCompassScore({
    emotional_signal: emotionalSignal,
    vital_energy: vitalEnergy,
    cognitive_load: cognitiveLoad,
  });

  async function submit() {
    setBusy(true);
    setPhase("saving");
    setStatus(null);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      setBusy(false);
      setStatus("You must be signed in to check in.");
      return;
    }

    const { error } = await supabase.from("entries").insert({
      user_id: userData.user.id,
      emotional_signal: emotionalSignal,
      vital_energy: vitalEnergy,
      cognitive_load: cognitiveLoad,
      context,
      note: note.trim() ? note.trim() : null,
    });

    setBusy(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setPhase("calculating");

    setTimeout(() => {
    window.location.href = "/dashboard";
    }, 1200);

    // Go to dashboard after successful check-in
    window.location.href = "/dashboard";
  }
if (alreadyCheckedToday) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-xl font-semibold">
          Daily alignment already logged.
        </h1>

        <p className="mt-2 text-white/60">
          Come back tomorrow to record a new signal.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
            ← Dashboard
          </Link>
          <div className="text-xs text-white/50">Daily Check-in</div>
        </div>

        <h1 className="mt-10 text-3xl font-semibold tracking-tight">Check in</h1>
        <p className="mt-3 text-white/70">
          Log your signals. We’ll compute your <span className="text-white/90">Compass Score</span>.
        </p>

        <div className="mt-10 space-y-6">
          <MetricSlider
            label="Emotional Signal"
            value={emotionalSignal}
            onChange={setEmotionalSignal}
          />
          <MetricSlider
            label="Vital Energy"
            value={vitalEnergy}
            onChange={setVitalEnergy}
          />
          <MetricSlider
            label="Cognitive Load"
            value={cognitiveLoad}
            onChange={setCognitiveLoad}
          />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/70">Context</div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CONTEXT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setContext(opt)}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm border transition",
                    opt === context
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 bg-black/20 text-white/75 hover:bg-white/5",
                  ].join(" ")}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-white/70">Optional note</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="One sentence. What mattered today?"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
              rows={3}
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
            <div>
              <div className="text-xs tracking-wide text-white/60">COMPASS SCORE</div>
              <div className="mt-1 text-3xl font-semibold">{compassScore}</div>
              <div className="mt-1 text-xs text-white/50">Higher = more aligned stability</div>
            </div>

            <button
              onClick={submit}
              disabled={busy}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
            >
              {phase === "saving"
  ? "Saving alignment…"
  : phase === "calculating"
  ? "Calculating signal…"
  : "Save check-in"}
            </button>
          </div>

          {status && <p className="text-sm text-white/70">{status}</p>}
        </div>
      </div>
    </main>
  );
}

function MetricSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/80">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
      <input
        className="mt-4 w-full accent-white"
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}