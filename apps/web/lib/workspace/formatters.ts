export function formatLabel(value: string | null | undefined, fallback = 'Not set') {
  if (!value) return fallback;
  return value.replace(/_/g, ' ');
}

export function formatDate(value: string | null | undefined, fallback = 'Not scheduled') {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatCurrencyValue(value: number | string | null | undefined, currency = 'AED', fallback = 'Not priced') {
  if (value == null || value === '') return fallback;

  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(value));
}

export function formatMoneyRange({
  min,
  max,
  currency = 'AED',
  period,
  fallback = 'Compensation not disclosed'
}: {
  min?: number | string | null;
  max?: number | string | null;
  currency?: string | null;
  period?: string | null;
  fallback?: string;
}) {
  const normalizedCurrency = currency || 'AED';
  const hasMin = min != null && min !== '';
  const hasMax = max != null && max !== '';
  const suffix = period ? ` / ${formatLabel(period)}` : '';

  if (hasMin && hasMax) {
    return `${formatCurrencyValue(min, normalizedCurrency)} - ${formatCurrencyValue(max, normalizedCurrency)}${suffix}`;
  }

  if (hasMin) {
    return `${formatCurrencyValue(min, normalizedCurrency)} minimum${suffix}`;
  }

  if (hasMax) {
    return `Up to ${formatCurrencyValue(max, normalizedCurrency)}${suffix}`;
  }

  return fallback;
}

export function formatListSummary(values: string[] | null | undefined, fallback = 'Not defined') {
  if (!values?.length) return fallback;
  return values.map((value) => formatLabel(value)).join(', ');
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-AE', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}
