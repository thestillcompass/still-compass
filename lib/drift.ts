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

export function microAdjustment(score: number) {
  if (score >= 8.5) {
    return "Protect today's focus block. Avoid unnecessary context switching.";
  }

  if (score >= 7) {
    return "Reduce decision load. Choose one priority and defer the rest.";
  }

  return "Pause escalation. Take a 15 minute reset before making major decisions.";
}