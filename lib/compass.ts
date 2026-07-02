export function computeCompassScore(args: {
  emotional_signal: number; // 1-10
  vital_energy: number;     // 1-10
  cognitive_load: number;   // 1-10 (higher = worse)
}) {
  const { emotional_signal, vital_energy, cognitive_load } = args;

  // Score is higher when emotional + energy are higher and load is lower
  const score = (emotional_signal + vital_energy + (10 - cognitive_load)) / 3;

  // Keep one decimal place for UI
  return Math.round(score * 10) / 10;
}