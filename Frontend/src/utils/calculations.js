/**
 * Clinical calculation and categorization utilities
 */

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function getBMICategory(bmi) {
  if (bmi === null || bmi === undefined) return null;
  if (bmi < 18.5) {
    return { label: "Underweight", color: "blue", class: "badge-info" };
  } else if (bmi < 25.0) {
    return { label: "Healthy Weight", color: "green", class: "badge-success" };
  } else if (bmi < 30.0) {
    return { label: "Overweight", color: "amber", class: "badge-warning" };
  } else {
    return { label: "Obese", color: "red", class: "badge-danger" };
  }
}

/**
 * American Heart Association (AHA) Blood Pressure Guidelines
 */
export function getBPStage(ap_hi, ap_lo) {
  if (!ap_hi || !ap_lo) return null;
  const hi = Number(ap_hi);
  const lo = Number(ap_lo);

  if (hi < 120 && lo < 80) {
    return {
      stage: "Normal Blood Pressure",
      color: "green",
      class: "badge-success",
      description: "Systolic <120 and Diastolic <80 mmHg"
    };
  } else if (hi >= 120 && hi <= 129 && lo < 80) {
    return {
      stage: "Elevated Blood Pressure",
      color: "amber",
      class: "badge-warning",
      description: "Systolic 120–129 and Diastolic <80 mmHg"
    };
  } else if ((hi >= 130 && hi <= 139) || (lo >= 80 && lo <= 89)) {
    return {
      stage: "Stage 1 Hypertension",
      color: "amber",
      class: "badge-warning",
      description: "Systolic 130–139 or Diastolic 80–89 mmHg"
    };
  } else if (hi >= 140 || lo >= 90) {
    return {
      stage: "Stage 2 Hypertension",
      color: "red",
      class: "badge-danger",
      description: "Systolic ≥140 or Diastolic ≥90 mmHg"
    };
  } else {
    return {
      stage: "Evaluation Required",
      color: "gray",
      class: "badge-neutral",
      description: "Non-standard BP reading"
    };
  }
}

export function formatPercentage(val) {
  if (val === null || val === undefined || isNaN(val)) return "N/A";
  return `${Number(val).toFixed(1)}%`;
}
