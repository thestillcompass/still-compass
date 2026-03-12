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
  reason: string;
  action: string;
  accentClass: string;
  badgeClass: string;
};

type Inputs = {
  compassScore: number;
  driftPrediction: number;
  stability: number;
};

function getAlignmentReason({
  compassScore,
  driftPrediction,
  stability,
}: Inputs) {
  if (compassScore >= 75 && driftPrediction <= 35 && stability >= 65) {
    return "Your score is strong, drift risk is low, and your recent pattern looks stable.";
  }

  if (driftPrediction >= 75 && stability < 50) {
    return "High drift risk and unstable recent signals are pulling you away from center.";
  }

  if (stability < 60 && driftPrediction >= 50) {
    return "Your recent signals look inconsistent, and drift risk is starting to rise.";
  }

  if (compassScore < 55 && driftPrediction >= 50) {
    return "Lower alignment and elevated drift risk suggest you may be moving off course.";
  }

  if (compassScore < 60) {
    return "Your current score is below your stronger alignment range.";
  }

  if (stability < 60) {
    return "Your alignment is present, but recent signals have been less steady.";
  }

  if (driftPrediction > 35) {
    return "Your alignment is holding, but drift risk is no longer minimal.";
  }

  return "Your latest signals suggest a mixed but recoverable state.";
}

function getAlignmentAction({
  compassScore,
  driftPrediction,
  stability,
}: Inputs) {
  if (compassScore >= 75 && driftPrediction <= 35 && stability >= 65) {
    return "Protect your current rhythm and avoid adding unnecessary decision load today.";
  }

  if (driftPrediction >= 75 && stability < 50) {
    return "Reduce pressure for the next few hours and prioritize one stabilizing action before taking on more.";
  }

  if (stability < 60 && driftPrediction >= 50) {
    return "Simplify the rest of your day and create one lighter block to regain consistency.";
  }

  if (compassScore < 55 && driftPrediction >= 50) {
    return "Pause, reduce non-essential commitments, and reset around one clear priority.";
  }

  if (compassScore < 60) {
    return "Choose a smaller target for the next block instead of pushing through full intensity.";
  }

  if (stability < 60) {
    return "Keep your schedule lighter than usual until your signals feel steadier.";
  }

  if (driftPrediction > 35) {
    return "Stay intentional with your next few hours so mild drift does not build momentum.";
  }

  return "Take one small stabilizing step and reassess after your next check-in.";
}

export function getAlignmentState({
  compassScore,
  driftPrediction,
  stability,
}: Inputs): AlignmentState {
  const reason = getAlignmentReason({
    compassScore,
    driftPrediction,
    stability,
  });

  const action = getAlignmentAction({
    compassScore,
    driftPrediction,
    stability,
  });

  if (compassScore >= 75 && driftPrediction <= 35 && stability >= 65) {
    return {
      key: "aligned",
      label: "Aligned",
      emoji: "🧭",
      description: "You’re moving in sync with your values and current rhythm.",
      reason,
      action,
      accentClass: "text-emerald-400",
      badgeClass:
        "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (compassScore >= 55 && driftPrediction <= 55 && stability >= 45) {
    return {
      key: "realigning",
      label: "Realigning",
      emoji: "✨",
      description: "You’re slightly off-center, but still within a recoverable range.",
      reason,
      action,
      accentClass: "text-amber-300",
      badgeClass:
        "border border-amber-500/30 bg-amber-500/10 text-amber-200",
    };
  }

  if (compassScore >= 35 && driftPrediction <= 75) {
    return {
      key: "drifting",
      label: "Drifting",
      emoji: "🌊",
      description: "Your recent pattern suggests reduced clarity or consistency.",
      reason,
      action,
      accentClass: "text-orange-300",
      badgeClass:
        "border border-orange-500/30 bg-orange-500/10 text-orange-200",
    };
  }

  return {
    key: "disconnected",
    label: "Disconnected",
    emoji: "🌑",
    description: "Your signals show distance from steadiness, intention, or direction.",
    reason,
    action,
    accentClass: "text-rose-300",
    badgeClass: "border border-rose-500/30 bg-rose-500/10 text-rose-200",
  };
}