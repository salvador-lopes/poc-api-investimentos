export function periodValidator(date: Date): boolean {
  if (date > new Date()) return false;
  return true;
}
