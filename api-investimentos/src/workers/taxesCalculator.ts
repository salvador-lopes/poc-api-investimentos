export function taxesCalculator(
  initialInvestment: Date,
  finalDate: Date,
  value: number,
): number {
  const yearsForCalculate =
    finalDate.getFullYear() - initialInvestment.getFullYear();
  if (yearsForCalculate < 1) {
    return value * 0.225;
  } else if (yearsForCalculate >= 1 && yearsForCalculate <= 2) {
    return value * 0.185;
  } else {
    return value * 0.15;
  }
}
