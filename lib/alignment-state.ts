export type AlignmentStateKey =
  | "aligned"
  | "realigning"
  | "drifting"
  | "disconnected";

export type AlignmentState = {
  key: AlignmentStateKey;
  label: string;
  emoji: string;
  description: string;
  accentClass: string;
  badgeClass: string;
};

type Inputs = {
  compassScore: number;
  driftPrediction: number;
  stability: number;
};

export function getAlignmentState({
  compassScore,
  driftPrediction,
  stability,
}: Inputs): AlignmentState {
  // Strong positive state
  if (compassScore >= 75 && driftPrediction <= 35 && stability >= 65) {
    return {
      key: "aligned",
      label: "Aligned",
      emoji: "🧭",
      description: "You’re moving in sync with your values and current rhythm.",
      accentClass: "text-emerald-400",
      badgeClass:
        "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };
  }

  // Mild instability, but still recoverable
  if (compassScore >= 55 && driftPrediction <= 55 && stability >= 45) {
    return {
      key: "realigning",
      label: "Realigning",
      emoji: "✨",
      description: "You’re slightly off-center, but trending back toward balance.",
      accentClass: "text-amber-300",
      badgeClass:
        "border border-amber-500/30 bg-amber-500/10 text-amber-200",
    };
  }

  // Noticeable drift
  if (compassScore >= 35 && driftPrediction <= 75) {
    return {
      key: "drifting",
      label: "Drifting",
      emoji: "🌊",
      description: "Your recent pattern suggests reduced clarity or consistency.",
      accentClass: "text-orange-300",
      badgeClass:
        "border border-orange-500/30 bg-orange-500/10 text-orange-200",
    };
  }

  // Low alignment / strong disconnect
  return {
    key: "disconnected",
    label: "Disconnected",
    emoji: "🌑",
    description: "Your signals show distance from steadiness, intention, or direction.",
    accentClass: "text-rose-300",
    badgeClass: "border border-rose-500/30 bg-rose-500/10 text-rose-200",
  };
}