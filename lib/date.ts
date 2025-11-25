const MONTH_MAP: Record<string, string> = {
  jan: '01',
  fev: '02',
  mar: '03',
  abr: '04',
  mai: '05',
  jun: '06',
  jul: '07',
  ago: '08',
  set: '09',
  out: '10',
  nov: '11',
  dez: '12',
};

const ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Converte datas em português para ISO (YYYY-MM-DD) aceitando variações como
// "10 Dez 2025" ou "10 de dez. de 2025".
export const normalizeDateToISO = (value: string): string => {
  if (!value) return '';
  const trimmed = value.trim();
  if (ISO_REGEX.test(trimmed)) return trimmed;

  const match = trimmed.toLowerCase().match(/(\d{1,2})\s*(?:de\s*)?([a-zç\.]+)\s*(?:de\s*)?(\d{4})/i);
  if (match) {
    const [, day, monthRaw, year] = match;
    const monthKey = monthRaw.replace('.', '').slice(0, 3);
    const month = MONTH_MAP[monthKey];
    if (month) return `${year}-${month}-${day.padStart(2, '0')}`;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  return '';
};

// Formata datas para exibição em pt-BR, aceitando entradas ISO ou já formatadas.
export const formatDateForDisplay = (value: string): string => {
  const iso = normalizeDateToISO(value);
  const date = iso ? new Date(`${iso}T00:00:00`) : new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return value || '';
};

// Retorna timestamp seguro para ordenar (recente primeiro).
export const getDateTimestamp = (value: string): number => {
  const iso = normalizeDateToISO(value);
  const date = iso ? new Date(`${iso}T00:00:00`) : new Date(value);
  return isNaN(date.getTime()) ? 0 : date.getTime();
};
