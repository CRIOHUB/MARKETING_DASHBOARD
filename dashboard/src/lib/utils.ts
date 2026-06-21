export function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-PE', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export function soles(n: number, d = 2): string {
  return `S/ ${fmt(n, d)}`
}

export function pct(n: number, d = 1): string {
  return `${fmt(n, d)}%`
}

export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return fmt(Math.round(n))
}

export function fmtKpi(v: number, format: string): string {
  if (v === null || v === undefined) return '—'
  if (format === 'pct') return (v * 100).toFixed(1) + '%'
  if (format === 'soles' || format === 'mxn') return soles(Math.round(v))
  v = Math.round(v)
  if (v >= 10000) return (v / 1000).toFixed(1) + 'K'
  return fmt(v)
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function avg(arr: number[]): number {
  const f = arr.filter(x => typeof x === 'number' && x > 0)
  return f.length ? sum(f) / f.length : 0
}

export function filterByMeses<T extends { mes: string }>(data: T[], meses: string[]): T[] {
  if (!meses.length) return data
  return data.filter(d => meses.includes(d.mes))
}

export function parseMeses(param: string | string[] | undefined): string[] {
  if (!param) return []
  const raw = Array.isArray(param) ? param[0] : param
  return raw.split(',').filter(Boolean)
}
