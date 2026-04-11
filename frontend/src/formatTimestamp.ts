/** SigNoz / RFC3339 타임스탬프를 `YYYY-MM-DD HH:mm:ss.SSS` 형태로 맞춘다. */
export function formatSigNozTimestamp(raw: string): string {
  const s = (raw ?? '').trim();
  if (!s) return '';

  const m = s.match(/^(\d{4}-\d{2}-\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(\.\d+)?/);
  if (m) {
    const [, date, hh, mm, ss, fracWithDot] = m;
    const fracDigits = fracWithDot ? fracWithDot.slice(1).replace(/\D/g, '') : '';
    const ms = (fracDigits + '000').slice(0, 3);
    return `${date} ${hh}:${mm}:${ss}.${ms}`;
  }

  const t = Date.parse(s);
  if (!Number.isNaN(t)) {
    const d = new Date(t);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${String(d.getUTCMilliseconds()).padStart(3, '0')}`;
  }

  return s;
}
