export type AssessmentResult = "Normal" | "Low" | "High" | "Abnormal";

export interface Test {
  hasFever?: "yes" | "no";
  temperature?: number; 
  hasCough?: "yes" | "no";
  coughType?: "dry" | "productive" | "none";
  duration?: number; 
  painLevel?: number; // 0 to 10
  hasFatigue?: "yes" | "no";
  contactWithSick?: "yes" | "no";
  otherSymptoms?: string; 
}

const WEIGHTS = {
  feverHigh: 3,
  feverLow: 2,
  coughDryLong: 3,
  coughProductive: 2,
  painHigh: 3,
  painModerate: 2,
  painLow: 1,
  fatigue: 1,
  contactWithSick: 2,
};

const THRESHOLDS = {
  abnormal: 7,
  high: 4,
  low: 2,
};

export function determineResult(test: Test): { result: AssessmentResult; score: number } {
  let score = 0;

  if (test.hasFever === "yes") {
    if (test.temperature !== undefined) {
      if (test.temperature > 100.4) {
        score += WEIGHTS.feverHigh;
      } else if (test.temperature > 99) {
        score += WEIGHTS.feverLow;
      }
    }
  }

  if (test.hasCough === "yes") {
    if (test.coughType === "dry" && (test.duration ?? 0) > 7) {
      score += WEIGHTS.coughDryLong;
    } else if (test.coughType === "productive") {
      score += WEIGHTS.coughProductive;
    }
  }

  if (test.painLevel !== undefined) {
    if (test.painLevel >= 7) {
      score += WEIGHTS.painHigh;
    } else if (test.painLevel >= 4) {
      score += WEIGHTS.painModerate;
    } else if (test.painLevel > 0) {
      score += WEIGHTS.painLow;
    }
  }

  if (test.hasFatigue === "yes") {
    score += WEIGHTS.fatigue;
  }

  if (test.contactWithSick === "yes") {
    score += WEIGHTS.contactWithSick;
  }

  if (score >= THRESHOLDS.abnormal) return { result: "Abnormal", score };
  if (score >= THRESHOLDS.high) return { result: "High", score };
  if (score >= THRESHOLDS.low) return { result: "Low", score };

  return { result: "Normal", score };
}
