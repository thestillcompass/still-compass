import { getAlignmentState } from "@/lib/alignment-state";

type AlignmentStateCardProps = {
  compassScore: number;
  driftPrediction: number;
  stability: number;
};

export default function AlignmentStateCard({
  compassScore,
  driftPrediction,
  stability,
}: AlignmentStateCardProps) {
  const state = getAlignmentState({
    compassScore,
    driftPrediction,
    stability,
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Alignment State
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {state.label}
          </h3>
        </div>

        <div
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${state.badgeClass}`}
        >
          <span className="mr-2">{state.emoji}</span>
          {state.label}
        </div>
      </div>

      <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
        {state.description}
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
          Why this state
        </p>
        <p className="mt-2 text-sm leading-6 text-white/75">{state.reason}</p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <MetricPill label="Compass" value={compassScore} />
        <MetricPill label="Drift" value={driftPrediction} inverse />
        <MetricPill label="Stability" value={stability} />
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const tone = getTone(value, inverse);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className={`mt-2 text-lg font-semibold ${tone}`}>
        {Math.round(value)}%
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