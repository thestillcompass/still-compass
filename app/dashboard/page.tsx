"use client";

import dynamic from "next/dynamic";
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

import AlignmentStateCard from "@/components/dashboard/alignment-state-card";

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

function detectPersonalDriftTrigger(entries: Entry[]) {
  if (entries.length < 6) {
    return "Not enough alignment history yet to identify personal drift triggers.";
  }

  const recent = [...entries].slice(0, 10);

  let highLoadDrift = 0;
  let lowEnergyDrift = 0;
  let emotionalDrift = 0;
  let workDrift = 0;

  for (const entry of recent) {
    const score = computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    });

    if (entry.cognitive_load >= 7 && score < 7) {
      highLoadDrift++;
    }

    if (entry.vital_energy <= 5 && score < 7) {
      lowEnergyDrift++;
    }

    if (entry.emotional_signal <= 5 && score < 7) {
      emotionalDrift++;
    }

    if (entry.context === "Work" && score < 7) {
      workDrift++;
    }
  }

  if (highLoadDrift >= 3) {
    return "Your alignment tends to weaken when cognitive load remains elevated.";
  }

  if (lowEnergyDrift >= 3) {
    return "Lower vital energy repeatedly appears before alignment drift.";
  }

  if (emotionalDrift >= 3) {
    return "Lower emotional signal often precedes alignment decline.";
  }

  if (workDrift >= 3) {
    return "Work contexts appear frequently before alignment weakens.";
  }

  return "No clear personal drift trigger has emerged yet.";
}

function detectRecoverySignal(entries: Entry[]) {
  if (entries.length < 6) {
    return "Not enough alignment history yet to identify recovery signals.";
  }

  const recent = [...entries].slice(0, 10);

  let lowLoadRecovery = 0;
  let highEnergyRecovery = 0;
  let emotionalRecovery = 0;
  let homeRecovery = 0;

  for (const entry of recent) {
    const score = computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    });

    if (entry.cognitive_load <= 4 && score >= 8) {
      lowLoadRecovery++;
    }

    if (entry.vital_energy >= 7 && score >= 8) {
      highEnergyRecovery++;
    }

    if (entry.emotional_signal >= 7 && score >= 8) {
      emotionalRecovery++;
    }

    if (entry.context === "Home" && score >= 8) {
      homeRecovery++;
    }
  }

  if (lowLoadRecovery >= 3) {
    return "Your alignment tends to recover when cognitive load stays low.";
  }

  if (highEnergyRecovery >= 3) {
    return "Higher vital energy repeatedly appears during stronger alignment days.";
  }

  if (emotionalRecovery >= 3) {
    return "Stronger emotional signal tends to accompany your recovery periods.";
  }

  if (homeRecovery >= 3) {
    return "Home contexts appear repeatedly during stronger alignment states.";
  }

  return "No clear recovery signal has emerged yet.";
}

function detectContextRecoveryPattern(entries: Entry[]) {
  if (entries.length < 6) {
    return {
      title: "Not enough data yet",
      description: "More alignment history is needed to detect your recovery pattern.",
    };
  }

  const recent = [...entries].slice(0, 10);

  let lowLoadRecovery = 0;
  let highEnergyRecovery = 0;
  let emotionalRecovery = 0;
  let homeRecovery = 0;
  let soloRecovery = 0;

  for (const entry of recent) {
    const score = computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    });

    if (score >= 8) {
      if (entry.cognitive_load <= 4) lowLoadRecovery++;
      if (entry.vital_energy >= 7) highEnergyRecovery++;
      if (entry.emotional_signal >= 7) emotionalRecovery++;
      if (entry.context === "Home") homeRecovery++;
      if (entry.context === "Solo") soloRecovery++;
    }
  }

  if (
    lowLoadRecovery === 0 &&
    highEnergyRecovery === 0 &&
    emotionalRecovery === 0 &&
    homeRecovery === 0 &&
    soloRecovery === 0
  ) {
    return {
      title: "Recovery pattern still forming",
      description: "A clearer recovery pathway will appear after more strong-alignment days.",
    };
  }

  const options = [
    {
      key: "lowLoadRecovery",
      count: lowLoadRecovery,
      title: "Structure + Simplicity",
      description:
        "Recovery tends to happen when mental load is reduced and the day feels more manageable.",
    },
    {
      key: "highEnergyRecovery",
      count: highEnergyRecovery,
      title: "Action + Momentum",
      description:
        "Recovery tends to happen when your energy returns and forward movement becomes easier.",
    },
    {
      key: "emotionalRecovery",
      count: emotionalRecovery,
      title: "Emotional Reset",
      description:
        "Recovery tends to happen when your emotional signal becomes stronger and steadier.",
    },
    {
      key: "homeRecovery",
      count: homeRecovery,
      title: "Home + Reset Space",
      description:
        "Recovery tends to happen more often in home contexts where pressure appears lower.",
    },
    {
      key: "soloRecovery",
      count: soloRecovery,
      title: "Solitude + Reflection",
      description:
        "Recovery tends to happen when you have space to slow down and recalibrate internally.",
    },
  ];

  options.sort((a, b) => b.count - a.count);

  return {
    title: options[0].title,
    description: options[0].description,
  };
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

function detectInsightMemory(entries: Entry[]) {
  if (entries.length < 5) {
    return "Not enough recent data yet to identify a repeating pattern.";
  }

  const recent = [...entries].slice(0, 7);

  let highLoadCount = 0;
  let lowEnergyCount = 0;
  let lowAlignmentCount = 0;
  let workLowAlignmentCount = 0;

  for (const entry of recent) {
    const score = computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    });

    if (entry.cognitive_load >= 7) {
      highLoadCount++;
    }

    if (entry.vital_energy <= 5) {
      lowEnergyCount++;
    }

    if (score < 7) {
      lowAlignmentCount++;
    }

    if (entry.context === "Work" && score < 7) {
      workLowAlignmentCount++;
    }
  }

  if (workLowAlignmentCount >= 3) {
    return "Work-related drift has appeared repeatedly in your recent alignments.";
  }

  if (highLoadCount >= 4) {
    return "High cognitive load has shown up repeatedly across your recent check-ins.";
  }

  if (lowEnergyCount >= 4) {
    return "Low vital energy has been a recurring pattern in your recent alignments.";
  }

  if (lowAlignmentCount >= 4) {
    return "Lower-alignment days are repeating recently. Recovery rhythm may need attention.";
  }

  return "No strong repeating pattern is visible yet across your recent alignments.";
}

function detectDriftPrediction(entries: Entry[]) {
  if (entries.length < 4) {
    return "Not enough recent data yet to estimate near-term drift risk.";
  }

  const recent = [...entries].slice(0, 5).reverse();

  const scores = recent.map((entry) =>
    computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    })
  );

  const loads = recent.map((entry) => entry.cognitive_load);
  const energy = recent.map((entry) => entry.vital_energy);

  const lastScore = scores[scores.length - 1];
  const firstScore = scores[0];
  const scoreDelta = lastScore - firstScore;

  const avgLoad =
    loads.reduce((sum, value) => sum + value, 0) / loads.length;

  const avgEnergy =
    energy.reduce((sum, value) => sum + value, 0) / energy.length;

  const risingLoad =
    loads.length >= 3 &&
    loads[loads.length - 3] <= loads[loads.length - 2] &&
    loads[loads.length - 2] <= loads[loads.length - 1];

  const fallingEnergy =
    energy.length >= 3 &&
    energy[energy.length - 3] >= energy[energy.length - 2] &&
    energy[energy.length - 2] >= energy[energy.length - 1];

  const lowAlignmentDays = scores.filter((score) => score < 7).length;

  if (risingLoad && avgLoad >= 6.5) {
    return "Drift risk is rising if cognitive load remains elevated over the next day.";
  }

  if (fallingEnergy && avgEnergy <= 6) {
    return "Drift risk is increasing as vital energy trends downward.";
  }

  if (scoreDelta <= -1 && lowAlignmentDays >= 3) {
    return "Recent signals suggest alignment may weaken further without recovery space.";
  }

  if (avgLoad >= 7 && avgEnergy <= 5.5) {
    return "Your current signal mix suggests a high probability of near-term drift.";
  }

  return "No strong near-term drift risk is visible yet from your recent signals.";
}
function computeDriftProbability(entries: Entry[]) {
  if (entries.length < 4) return 0;

  const recent = [...entries].slice(0, 5).reverse();

  const scores = recent.map((entry) =>
    computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    })
  );

  const loads = recent.map((e) => e.cognitive_load);
  const energy = recent.map((e) => e.vital_energy);

  let risk = 0;

  const scoreDrop = scores[0] - scores[scores.length - 1];
  if (scoreDrop >= 1) risk += 25;

  const avgLoad =
    loads.reduce((sum, v) => sum + v, 0) / loads.length;

  if (avgLoad >= 7) risk += 25;

  const avgEnergy =
    energy.reduce((sum, v) => sum + v, 0) / energy.length;

  if (avgEnergy <= 5.5) risk += 25;

  const lowAlignmentDays = scores.filter((s) => s < 7).length;
  if (lowAlignmentDays >= 3) risk += 25;

  return Math.min(risk, 100);
}

function computeAlignmentStability(entries: Entry[]) {
  if (entries.length < 5) return null;

  const recent = [...entries].slice(0, 7);

  const scores = recent.map((entry) =>
    computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    })
  );

  const average =
    scores.reduce((sum, value) => sum + value, 0) / scores.length;

  const variance =
    scores.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
    scores.length;

  const stdDev = Math.sqrt(variance);

  const stability = Math.max(0, Math.min(100, Math.round(100 - stdDev * 20)));

  return stability;
}

function generateDailyGuidance(
  latest: Entry | null,
  driftProbability: number,
  alignmentStability: number | null
) {
  if (!latest) {
    return "Log your alignment today to receive guidance.";
  }

  const load = latest.cognitive_load;
  const energy = latest.vital_energy;
  const emotional = latest.emotional_signal;

  // Cognitive load guidance
  if (load >= 7) {
    return "Cognitive load is high. Reduce decision complexity and avoid stacking meetings today.";
  }

  // Energy recovery guidance
  if (energy <= 5) {
    return "Vital energy is low. Protect recovery time and reduce non-essential commitments.";
  }

  // Emotional signal guidance
  if (emotional <= 5) {
    return "Emotional signal is soft today. Slow down and avoid high-pressure interactions.";
  }

  // Drift probability guidance
  if (driftProbability >= 60) {
    return "Your signals suggest rising drift risk. Simplify your schedule and protect focus blocks.";
  }

  // Stability guidance
  if (alignmentStability !== null && alignmentStability < 60) {
    return "Your signals are volatile. Maintain a lighter schedule to stabilize alignment.";
  }

  return "Your signals are stable today. Maintain your current rhythm.";
}

function generateDriftTimeline(entries: Entry[]) {
  if (entries.length < 4) {
    return [];
  }

  const recent = [...entries].slice(0, 5).reverse();

  return recent.map((entry, index) => {
    const score = computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    });

    const dayLabel =
      index === recent.length - 1
        ? "Today"
        : new Date(entry.created_at).toLocaleDateString("en-US", {
            weekday: "short",
          });

    let message = "Signals stable.";

    if (entry.cognitive_load >= 7) {
      message = "Cognitive load increased.";
    } else if (entry.vital_energy <= 5) {
      message = "Energy dipped.";
    } else if (entry.emotional_signal <= 5) {
      message = "Emotional signal softened.";
    } else if (score < 7) {
      message = "Drift signals emerging.";
    } else if (score >= 8) {
      message = "Alignment remained steady.";
    }

    return {
      day: dayLabel,
      message,
    };
  });
}

function detectWeeklyReview(entries: Entry[]) {
  if (entries.length < 5) {
    return "Complete more daily alignments to unlock your weekly review.";
  }

  const recent = [...entries].slice(0, 7);

  const scores = recent.map((entry) =>
    computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    })
  );

  const avgScore =
    scores.reduce((sum, value) => sum + value, 0) / scores.length;

  const emotionalAvg =
    recent.reduce((sum, e) => sum + e.emotional_signal, 0) / recent.length;

  const energyAvg =
    recent.reduce((sum, e) => sum + e.vital_energy, 0) / recent.length;

  const loadAvg =
    recent.reduce((sum, e) => sum + e.cognitive_load, 0) / recent.length;

  const drag = Math.max(10 - emotionalAvg, 10 - energyAvg, loadAvg);

  if (drag === loadAvg && loadAvg >= 6) {
    return "This week, cognitive load appears to have been the dominant drag on alignment.";
  }

  if (drag === 10 - energyAvg && energyAvg <= 6) {
    return "Lower vital energy appears to have influenced your alignment this week.";
  }

  if (drag === 10 - emotionalAvg && emotionalAvg <= 6) {
    return "Emotional signal softness appears to have influenced your alignment this week.";
  }

  if (avgScore >= 8) {
    return "Your alignment remained strong throughout the week.";
  }

  if (avgScore >= 7) {
    return "Your signals suggest mild drift this week, but overall stability remains.";
  }

  return "Your alignment weakened this week. Recovery rhythm may need attention.";
}

function detectStreakInsight(streak: number) {
  if (streak === 0) {
    return "Start your alignment rhythm today.";
  }

  if (streak === 1) {
    return "Your alignment rhythm has begun.";
  }

  if (streak <= 3) {
    return "Your streak is building momentum.";
  }

  if (streak <= 7) {
    return "Consistency is emerging. This rhythm strengthens signal accuracy.";
  }

  if (streak <= 14) {
    return "Your alignment rhythm is stabilizing.";
  }

  return "Your alignment rhythm is now strongly established.";
}

function generateAlignmentReport(entries: Entry[]) {
  if (entries.length < 5) {
    return {
      score: null,
      trend: "Not enough data yet",
      primaryDrag: "Not enough data yet",
      strongestContext: "Not enough data yet",
      riskContext: "Not enough data yet",
    };
  }

  const recent = [...entries].slice(0, 7);

  const scores = recent.map((entry) =>
    computeCompassScore({
      emotional_signal: entry.emotional_signal,
      vital_energy: entry.vital_energy,
      cognitive_load: entry.cognitive_load,
    })
  );

  const averageScore =
    scores.reduce((sum, value) => sum + value, 0) / scores.length;

  const firstScore = scores[scores.length - 1];
  const lastScore = scores[0];

  let trend = "Stable";
  if (lastScore - firstScore >= 0.8) {
    trend = "Improving";
  } else if (firstScore - lastScore >= 0.8) {
    trend = "Declining";
  }

  const emotionalAvg =
    recent.reduce((sum, e) => sum + e.emotional_signal, 0) / recent.length;
  const energyAvg =
    recent.reduce((sum, e) => sum + e.vital_energy, 0) / recent.length;
  const loadAvg =
    recent.reduce((sum, e) => sum + e.cognitive_load, 0) / recent.length;

  const emotionalDrag = 10 - emotionalAvg;
  const energyDrag = 10 - energyAvg;
  const loadDrag = loadAvg;

  let primaryDrag = "Balanced";
  const maxDrag = Math.max(emotionalDrag, energyDrag, loadDrag);

  if (maxDrag === loadDrag) {
    primaryDrag = "Cognitive Load";
  } else if (maxDrag === energyDrag) {
    primaryDrag = "Vital Energy";
  } else if (maxDrag === emotionalDrag) {
    primaryDrag = "Emotional Signal";
  }

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

  const contexts = Object.entries(grouped).map(([context, values]) => ({
    context,
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
  }));

  contexts.sort((a, b) => a.average - b.average);

  const riskContext = contexts[0]?.context ?? "Unknown";
  const strongestContext = contexts[contexts.length - 1]?.context ?? "Unknown";

  let summary = "Your alignment signals are stabilizing.";

if (trend === "Improving") {
  summary = `Your alignment is trending upward. ${strongestContext} contexts appear to support stronger signals.`;
}

if (trend === "Declining") {
  summary = `Your alignment has weakened recently. ${riskContext} contexts may be contributing to drift.`;
}

if (primaryDrag === "Cognitive Load") {
  summary += " Elevated cognitive load appears to be the primary source of drag.";
}

if (primaryDrag === "Vital Energy") {
  summary += " Lower vital energy is currently limiting alignment.";
}

if (primaryDrag === "Emotional Signal") {
  summary += " Emotional signal softness is influencing your Compass Score.";
}

  return {
    score: averageScore,
    trend,
    primaryDrag,
    strongestContext,
    riskContext,
    summary,
  };
}

function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [latest, setLatest] = useState<Entry | null>(null);
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  useEffect(() => {
  setMounted(true);
}, []);

  

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userError || !userData.user) {
        setLoading(false);
        window.location.href = "/login";
        return;
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
if (!mounted) return;

if (userError || !userData.user) {
  setLoading(false);
  window.location.href = "/login";
  return;
}

setEmail(userData.user.email ?? null);

const displayName =
  (userData.user.user_metadata?.full_name as string | undefined) ||
  (userData.user.user_metadata?.name as string | undefined) ||
  null;

setName(displayName ?? null);

const { data, error } = await supabase
  .from("entries")
  .select("*")
  .eq("user_id", userData.user.id)
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

  const [todayLabel, setTodayLabel] = useState("");

useEffect(() => {
  setTodayLabel(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  );
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

const streakInsight = useMemo(() => detectStreakInsight(rhythmDays), [rhythmDays]);

const patternInsight = useMemo(() => detectPatternInsight(recentEntries), [recentEntries]);
const weeklyInsight = useMemo(() => detectWeeklyInsight(recentEntries), [recentEntries]);
const contextInsight = useMemo(() => detectContextInsight(recentEntries), [recentEntries]);
const noteInsight = useMemo(() => detectNoteInsight(recentEntries), [recentEntries]);
const insightMemory = useMemo(() => detectInsightMemory(recentEntries), [recentEntries]);
const driftPrediction = useMemo(() => detectDriftPrediction(recentEntries), [recentEntries]);
const driftProbability = useMemo(
  () => computeDriftProbability(recentEntries),
  [recentEntries]
);
const alignmentStability = useMemo(
  () => computeAlignmentStability(recentEntries),
  [recentEntries]
);

const dailyGuidance = useMemo(
  () => generateDailyGuidance(latest, driftProbability, alignmentStability),
  [latest, driftProbability, alignmentStability]
);

const driftTimeline = useMemo(
  () => generateDriftTimeline(recentEntries),
  [recentEntries]
);

const weeklyReview = useMemo(() => detectWeeklyReview(recentEntries), [recentEntries]);

const personalDriftTrigger = useMemo(
  () => detectPersonalDriftTrigger(recentEntries),
  [recentEntries]
);

const recoverySignal = useMemo(
  () => detectRecoverySignal(recentEntries),
  [recentEntries]
);

const contextRecoveryPattern = useMemo(
  () => detectContextRecoveryPattern(recentEntries),
  [recentEntries]
);

const alignmentCardReport = useMemo(() => {
  if (!latest || recentEntries.length === 0) {
    return null;
  }

  const currentScore = computeCompassScore({
    emotional_signal: latest.emotional_signal,
    vital_energy: latest.vital_energy,
    cognitive_load: latest.cognitive_load,
  });

  const scores = recentEntries
    .slice(0, 7)
    .map((entry) =>
      computeCompassScore({
        emotional_signal: entry.emotional_signal,
        vital_energy: entry.vital_energy,
        cognitive_load: entry.cognitive_load,
      })
    );

  const previousAvg =
    scores.length > 1
      ? scores.slice(1).reduce((sum, s) => sum + s, 0) / (scores.length - 1)
      : null;

  const trendDelta =
    previousAvg !== null ? Number((currentScore - previousAvg).toFixed(2)) : null;

  let status: "steady" | "realigning" | "slight_drift" | "off_course" = "steady";

  if (currentScore >= 8.5) status = "steady";
  else if (currentScore >= 7) status = "realigning";
  else if (currentScore >= 6) status = "slight_drift";
  else status = "off_course";

  return {
    score: Number((currentScore * 10).toFixed(0)),
    previousAverageScore: previousAvg ? Number((previousAvg * 10).toFixed(0)) : null,
    trendDelta: trendDelta ? Number((trendDelta * 10).toFixed(0)) : null,
    status,
    topPositiveSignal: patternInsight,
    topRisk: driftPrediction,
    recommendedAction: adjustment ?? "Complete tomorrow’s alignment check-in.",
    summary: weeklyInsight,
    generatedAt: new Date().toISOString(),
  };
}, [
  latest,
  recentEntries,
  patternInsight,
  driftPrediction,
  weeklyInsight,
  adjustment,
]);

  

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

      const driftRiskColor =
  driftProbability >= 75
    ? "text-red-400"
    : driftProbability >= 50
    ? "text-orange-400"
    : driftProbability >= 25
    ? "text-amber-400"
    : "text-green-400";

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

const alignmentStateCompassScore =
  score !== null && score !== undefined ? Math.round(score * 10) : 0;

const alignmentStateDriftPrediction = driftProbability;

const alignmentStateStability = alignmentStability ?? 0;

let confidenceLevel = "Early signal";
let confidenceTone = "text-white/60";

if (recentEntries.length >= 7) {
  confidenceLevel = "High";
  confidenceTone = "text-emerald-300";
} else if (recentEntries.length >= 3) {
  confidenceLevel = "Moderate";
  confidenceTone = "text-amber-200";
}

let trendLabel = "Stable";
let trendIcon = "→";
let trendTone = "text-white/60";

if (trendScores.length >= 2) {
  const latestScore = trendScores[trendScores.length - 1];
  const previousScore = trendScores[trendScores.length - 2];

  const delta = latestScore - previousScore;

  if (delta >= 0.4) {
    trendLabel = "Improving";
    trendIcon = "↑";
    trendTone = "text-emerald-300";
  } else if (delta <= -0.4) {
    trendLabel = "Declining";
    trendIcon = "↓";
    trendTone = "text-rose-300";
  }
}


if (!mounted) {
  return null;
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
          <p className="text-sm text-white/50">
  {todayLabel || "Loading date..."}
</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {welcomeName}.
          </h1>
          <p className="mt-2 text-white/65">
            {hasCheckedInToday
              ? "Today’s alignment is logged. Review your signal and return tomorrow."
              : "Alignment check for today."}
          </p>
        </div>

        <div className="mt-10 space-y-6">
  <AlignmentStateCard
  compassScore={alignmentStateCompassScore}
  driftPrediction={alignmentStateDriftPrediction}
  stability={alignmentStateStability}
  emotionalSignal={latest?.emotional_signal ?? null}
  vitalEnergy={latest?.vital_energy ?? null}
  cognitiveLoad={latest?.cognitive_load ?? null}
  context={latest?.context ?? null}
  showDriftAlert={showDriftAlert}
  scoreDrop={scoreDrop}
  confidenceLevel={confidenceLevel}
  confidenceTone={confidenceTone}
  trendLabel={trendLabel}
  trendIcon={trendIcon}
  trendTone={trendTone}
  driftForecast={driftPrediction}
/>
</div>
        

        {/* Forecast */}
        <div className="mt-10">
          <div className="text-xs tracking-wide text-white/40">FORECAST</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="text-xs tracking-wide text-white/60">DRIFT PROBABILITY</div>
  <div className={`mt-2 text-2xl font-semibold ${driftRiskColor}`}>
    {loading ? "…" : `${driftProbability}%`}
  </div>
  <div className="mt-2 text-sm text-white/70">
    {loading
      ? "Calculating probability..."
      : driftProbability >= 75
      ? "High probability of near-term drift."
      : driftProbability >= 50
      ? "Moderate probability of near-term drift."
      : driftProbability >= 25
      ? "Mild probability of near-term drift."
      : "Low probability of near-term drift."}
  </div>
</div>


  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="text-xs tracking-wide text-white/60">
    ALIGNMENT STABILITY
  </div>

  <div className="mt-2 text-2xl font-semibold text-white">
    {alignmentStability === null ? "—" : `${alignmentStability}%`}
  </div>

  <div className="mt-2 text-sm text-white/70">
    {alignmentStability === null
      ? "Not enough recent data to estimate stability."
      : alignmentStability >= 80
      ? "Your alignment signals are very stable."
      : alignmentStability >= 60
      ? "Your alignment signals are moderately stable."
      : "Your alignment signals appear volatile."}
  </div>
</div>

<div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
  <div className="text-xs tracking-wide text-white/60">DRIFT PREDICTION</div>
  <div className="mt-2 text-sm text-white/80">
    {loading ? "Estimating drift risk..." : driftPrediction}
  </div>
</div>

<div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
  <div className="text-xs tracking-wide text-white/60">DRIFT TIMELINE</div>

  <div className="mt-4 space-y-3">
    {driftTimeline.length === 0 ? (
      <div className="text-sm text-white/70">
        Not enough recent data to generate a drift timeline.
      </div>
    ) : (
      driftTimeline.map((item, index) => (
        <div
          key={`${item.day}-${index}`}
          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
        >
          <div className="min-w-[52px] text-sm font-medium text-white">
            {item.day}
          </div>
          <div className="text-sm text-white/75">{item.message}</div>
        </div>
      ))
    )}
  </div>
</div>

<div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
  <div className="text-xs tracking-wide text-white/60">WEEKLY REVIEW</div>
  <div className="mt-2 text-sm text-white/80">
    {loading ? "Compiling weekly review..." : weeklyReview}
  </div>
</div>
</div>
</div>

{/* Intelligence */}
<div className="mt-10">
  <div className="text-xs tracking-wide text-white/40">INTELLIGENCE</div>

  <div className="mt-4 grid gap-4 sm:grid-cols-2">

    {/* SIGNAL DRIVER */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">SIGNAL DRIVER</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Identifying dominant driver…" : signalDriver}
              </div>
            </div>

    {/* PERSONAL DRIFT TRIGGER */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="text-xs tracking-wide text-white/60">
    PERSONAL DRIFT TRIGGER
  </div>

  <div className="mt-2 text-sm text-white/80">
    {loading ? "Analyzing drift triggers..." : personalDriftTrigger}
  </div>
</div>

       {/* RECOVERY SIGNAL */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="text-xs tracking-wide text-white/60">
    RECOVERY SIGNAL
  </div>

  <div className="mt-2 text-sm text-white/80">
    {loading ? "Analyzing recovery patterns..." : recoverySignal}
  </div>
</div>

{/* CONTEXT RECOVERY PATTERN */}
<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
  <div className="text-xs tracking-wide text-white/60">
    CONTEXT RECOVERY PATTERN
  </div>

  <div className="mt-2 text-sm text-white/80">
    {loading
      ? "Detecting recovery pathway..."
      : contextRecoveryPattern.title}
  </div>

  <div className="mt-2 text-xs leading-relaxed text-white/50">
    {loading
      ? "Reading what tends to restore alignment..."
      : contextRecoveryPattern.description}
  </div>
</div>

    {/* WEEKLY INSIGHT */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">WEEKLY INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Analyzing weekly signal…" : weeklyInsight}
              </div>
            </div>


    {/* PATTERN INSIGHT */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">PATTERN INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Detecting patterns…" : patternInsight}
              </div>
            </div>


    {/* CONTEXT INSIGHT */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs tracking-wide text-white/60">CONTEXT INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Analyzing context patterns…" : contextInsight}
              </div>
            </div>


    {/* INSIGHT MEMORY */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <div className="text-xs tracking-wide text-white/60">INSIGHT MEMORY</div>
              <div className="mt-2 text-sm text-white/80">
              {loading ? "Reviewing repeating patterns..." : insightMemory}
          </div>
        </div>


    {/* NOTE INSIGHT */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <div className="text-xs tracking-wide text-white/60">NOTE INSIGHT</div>
              <div className="mt-2 text-sm text-white/80">
                {loading ? "Analyzing reflection notes…" : noteInsight}
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

              <div className="mt-2 text-sm text-white/80">
  {loading ? "Analyzing rhythm…" : streakInsight}
</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <div className="text-xs tracking-wide text-white/60">7-DAY TREND</div>

              <div className="mt-4 h-40 min-w-0">
                {loading ? (
                  <div className="text-white/60">Loading trend…</div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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

export default dynamic(() => Promise.resolve(DashboardPage), {
  ssr: false,
});