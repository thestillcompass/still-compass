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
  emotionalSignal?: number | null;
  vitalEnergy?: number | null;
  cognitiveLoad?: number | null;
  context?: string | null;
};

function getAlignmentReason({
  compassScore,
  driftPrediction,
  stability,
  emotionalSignal,
  vitalEnergy,
  cognitiveLoad,
}: Inputs) {
  if (
    cognitiveLoad !== null &&
    cognitiveLoad !== undefined &&
    cognitiveLoad >= 8
  ) {
    return "High cognitive load is currently the strongest source of pressure on your alignment.";
  }

  if (
    vitalEnergy !== null &&
    vitalEnergy !== undefined &&
    vitalEnergy <= 4
  ) {
    return "Low vital energy is reducing your ability to stay centered and consistent.";
  }

  if (
    emotionalSignal !== null &&
    emotionalSignal !== undefined &&
    emotionalSignal <= 4
  ) {
    return "Your emotional signal looks muted right now, which may be softening your alignment.";
  }

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

function getContextPrefix(context?: string | null) {
  if (!context) return "";
  return `In ${context.toLowerCase()} context, `;
}

function getAlignmentAction({
  compassScore,
  driftPrediction,
  stability,
  emotionalSignal,
  vitalEnergy,
  cognitiveLoad,
  context,
}: Inputs) {
  const contextPrefix = getContextPrefix(context);

  if (
    cognitiveLoad !== null &&
    cognitiveLoad !== undefined &&
    cognitiveLoad >= 8
  ) {
    return `${contextPrefix}reduce decisions, narrow your focus to one priority, and avoid stacking more input right now.`;
  }

  if (
    vitalEnergy !== null &&
    vitalEnergy !== undefined &&
    vitalEnergy <= 4
  ) {
    return `${contextPrefix}protect recovery first and lower the intensity of your next block.`;
  }

  if (
    emotionalSignal !== null &&
    emotionalSignal !== undefined &&
    emotionalSignal <= 4
  ) {
    return `${contextPrefix}slow the pace, reduce pressure, and choose a gentler next step.`;
  }

  if (driftPrediction >= 75 && stability < 50) {
    return `${contextPrefix}reduce pressure for the next few hours and prioritize one stabilizing action before taking on more.`;
  }

  if (stability < 60 && driftPrediction >= 50) {
    return `${contextPrefix}simplify the rest of your day and create one lighter block to regain consistency.`;
  }

  if (compassScore < 55 && driftPrediction >= 50) {
    return `${contextPrefix}pause, reduce non-essential commitments, and reset around one clear priority.`;
  }

  if (compassScore >= 75 && driftPrediction <= 35 && stability >= 65) {
    return `${contextPrefix}protect your current rhythm and avoid adding unnecessary decision load today.`;
  }

  if (compassScore < 60) {
    return `${contextPrefix}choose a smaller target for the next block instead of pushing through full intensity.`;
  }

  if (stability < 60) {
    return `${contextPrefix}keep your schedule lighter than usual until your signals feel steadier.`;
  }

  if (driftPrediction > 35) {
    return `${contextPrefix}stay intentional with your next few hours so mild drift does not build momentum.`;
  }

  return `${contextPrefix}take one small stabilizing step and reassess after your next check-in.`;
}

export function getAlignmentState({
  compassScore,
  driftPrediction,
  stability,
  emotionalSignal,
  vitalEnergy,
  cognitiveLoad,
  context,
}: Inputs): AlignmentState {
  const reason = getAlignmentReason({
    compassScore,
    driftPrediction,
    stability,
    emotionalSignal,
    vitalEnergy,
    cognitiveLoad,
    context,
  });

  const action = getAlignmentAction({
    compassScore,
    driftPrediction,
    stability,
    emotionalSignal,
    vitalEnergy,
    cognitiveLoad,
    context,
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