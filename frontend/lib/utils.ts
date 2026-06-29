export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatDate(value?: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T00:00:00`)
  );
}

export function getAgeLabel(birthDate?: string | null) {
  if (!birthDate) return 'Unknown age';
  const birth = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();

  if (months < 1) return 'Newborn';
  if (months < 24) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths ? `${years} years ${remainingMonths} months` : `${years} years`;
}

export function toOptionalNumber(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}
