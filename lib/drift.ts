export function computeDriftStatus(score: number) {
  if (score >= 8.5) {
    return {
      status: "Aligned",
      message: "Signals are stable. Maintain current rhythm."
    };
  }

  if (score >= 7) {
    return {
      status: "Early Drift",
      message: "Small signals of misalignment are appearing."
    };
  }

  return {
    status: "Drift Detected",
    message: "Your signals indicate cognitive overload or emotional drag."
  };
}

export function microAdjustment(
  score: number,
  driver: string | null
) {
  if (!driver) {
    return "Maintain a steady rhythm today. No dominant adjustment needed.";
  }

  if (driver.includes("Cognitive Load")) {
    return "Cognitive load appears elevated. Reduce decision surface and defer non-essential choices.";
  }

  if (driver.includes("Vital Energy")) {
    return "Vital energy appears to be the limiting factor. Prioritize recovery and avoid heavy cognitive work.";
  }

  if (driver.includes("Emotional Signal")) {
    return "Emotional drag may be affecting alignment. Step away from the current context and reset attention.";
  }

  if (score >= 8.5) {
    return "Signals indicate strong alignment. Maintain the current rhythm and avoid unnecessary disruptions.";
  }

  if (score >= 7) {
    return "Mild drift detected. A small reduction in cognitive load may restore clarity.";
  }

  return "Signals indicate overload. Reduce active decisions and create recovery space.";
}