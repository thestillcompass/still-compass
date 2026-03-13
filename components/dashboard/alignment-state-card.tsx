import { getAlignmentState } from "@/lib/alignment-state";

type AlignmentStateCardProps = {
  compassScore: number;
  driftPrediction: number;
  stability: number;
  emotionalSignal?: number | null;
  vitalEnergy?: number | null;
  cognitiveLoad?: number | null;
  context?: string | null;

  showDriftAlert?: boolean;
  scoreDrop?: number | null;

  confidenceLevel?: string;
  confidenceTone?: string;

  trendLabel?: string;
  trendIcon?: string;
  trendTone?: string;
  driftForecast?: string;
};

export default function AlignmentStateCard({
  compassScore,
  driftPrediction,
  stability,
  emotionalSignal,
  vitalEnergy,
  cognitiveLoad,
  context,
  showDriftAlert,
  scoreDrop,
  confidenceLevel,
  confidenceTone,
  trendLabel,
  trendIcon,
  trendTone,
  driftForecast,
}: AlignmentStateCardProps)

{
  const state = getAlignmentState({
    compassScore,
    driftPrediction,
    stability,
    emotionalSignal,
    vitalEnergy,
    cognitiveLoad,
    context,
  });

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="border-b border-white/10 px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Daily Command Center
            </p>
            <p className="mt-2 text-sm text-white/60">
              Your current alignment diagnosis
            </p>

            {trendLabel && (
  <p className={`mt-1 text-xs tracking-wide ${trendTone}`}>
    Trend: {trendLabel} {trendIcon}
  </p>
)}

            {confidenceLevel && (
  <p className={`mt-2 text-xs tracking-wide ${confidenceTone}`}>
    Confidence: {confidenceLevel}
  </p>
)}
          </div>

          <div
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${state.badgeClass}`}
          >
            <span className="mr-2">{state.emoji}</span>
            {state.label}
          </div>
        </div>
      </div>

{showDriftAlert && (
  <div className="border-b border-red-400/20 bg-red-400/10 px-6 py-4 sm:px-8">
    <p className="text-[11px] uppercase tracking-[0.2em] text-red-300">
      Drift Alert
    </p>

    <p className="mt-2 text-sm text-white/80">
      Your Compass Score dropped by{" "}
      <span className="font-semibold text-white">
        {scoreDrop?.toFixed(1)}
      </span>{" "}
      points since your previous alignment.
    </p>
  </div>
)}


      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Alignment State
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {state.label}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
            {state.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <InsightBlock
            label="Why this state"
            content={state.reason}
          />

          <InsightBlock
            label="Next best step"
            content={state.action}
            highlight
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
  <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
    Drift Forecast
  </p>

  <p className="mt-3 text-sm leading-7 text-white/78">
    {driftForecast}
  </p>
</div>


        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard
            label="Compass Score"
            value={`${Math.round(compassScore)}%`}
            tone={getTone(compassScore, false)}
          />

          <MetricCard
            label="Drift Risk"
            value={`${Math.round(driftPrediction)}%`}
            tone={getTone(driftPrediction, true)}
          />

          <MetricCard
            label="Stability"
            value={`${Math.round(stability)}%`}
            tone={getTone(stability, false)}
          />
        </div>
      </div>
    </div>
  );
}

function InsightBlock({
  label,
  content,
  highlight = false,
}: {
  label: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        highlight
          ? "border-white/15 bg-white/8"
          : "border-white/10 bg-black/20"
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/78">
        {content}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className={`mt-3 text-2xl font-semibold ${tone}`}>
        {value}
      </p>
    </div>
  );
}

function getTone(value: number, inverse: boolean) {
  if (!inverse) {
    if (value >= 75) return "text-emerald-300";
    if (value >= 55) return "text-amber-200";
    if (value >= 35) return "text-orange-200";
    return "text-rose-300";
  }

  if (value <= 35) return "text-emerald-300";
  if (value <= 55) return "text-amber-200";
  if (value <= 75) return "text-orange-200";
  return "text-rose-300";
}