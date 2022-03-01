export function gainCalculator(
  initialInvestment: Date,
  finalDate: Date,
  value: number,
): number {
  let amountOfGains: number = 0;
  const total =
    (finalDate.getFullYear() - initialInvestment.getFullYear()) * 12 +
    (finalDate.getMonth() - initialInvestment.getMonth());

  const investmentDay = initialInvestment.getDate();
  const calculationDay = new Date().getDate();
  const timeDiff = Math.abs(initialInvestment.getTime() - new Date().getTime());
  const amountOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (amountOfDays <= 27) {
    return value;
  } else if (amountOfDays <= 29 && new Date().getMonth() === 2) {
    amountOfGains = value + value * 0.0052;
  }

  for (let i = 0; i < total; i++) {
    const lastMonth = total - 1;
    if (i === lastMonth && calculationDay < investmentDay) {
      console.log('minus one');
    } else {
      amountOfGains === 0
        ? (amountOfGains = value + value * 0.0052)
        : (amountOfGains += amountOfGains * 0.0052);
    }
  }
  return Number(amountOfGains.toFixed(2));
}
