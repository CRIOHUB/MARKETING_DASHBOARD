import { Suspense } from 'react'
import { MonthFilter } from '@/components/ui/month-filter'
import { GlassCard } from '@/components/ui/glass-card'
import { SCORECARD_DEF } from '@/lib/constants'
import { parseMeses, fmt } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ meses?: string }>
}

const REAL_MESES = SCORECARD_DEF.meses // ['ENE'..'MAY']

function valStr(v: number | undefined, f: string): string {
  if (v === undefined || v === null) return '—'
  if (f === 'pct') return v.toFixed(2) + '%'
  if (f === 'mxn') return 'MX$' + fmt(Math.round(v))
  return fmt(v)
}

function attainment(real: number, meta: number, better: string): number {
  if (!meta || real === undefined) return 0
  return better === 'lower' ? meta / real : real / meta
}

function clr(p: number): string {
  if (!p) return 'var(--color-muted)'
  return p >= 1 ? '#16A34A' : p >= 0.85 ? '#D97706' : '#DC2626'
}

export default async function KpisScoreboard({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)
  const months = sel.length ? REAL_MESES.filter(m => sel.includes(m)) : REAL_MESES
  const idxs = months.map(m => REAL_MESES.indexOf(m))

  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>
          KPIs 2026 — Scoreboard
        </h2>
        <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
          Reporte mensual a México (Meta vs Real). Meta FY ventas: 968 uds.
        </p>
      </div>

      <Suspense><MonthFilter /></Suspense>

      {SCORECARD_DEF.sections.map(sec => (
        <GlassCard key={sec.num} title={`${sec.num} ${sec.title}`} style={{ marginBottom: 14 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ ...th, textAlign: 'left', minWidth: 180 }}>KPI</th>
                  <th style={{ ...th, width: 70 }}></th>
                  {months.map(m => <th key={m} style={{ ...th, width: 72 }}>{m}</th>)}
                  <th style={{ ...th, width: 86, borderLeft: '1px solid var(--color-border)' }}>FY 2026</th>
                </tr>
              </thead>
              <tbody>
                {sec.kpis.map((kpi, ki) => {
                  const fyPct = attainment(kpi.realFy, kpi.metaFy, kpi.better)
                  const bold = 'bold' in kpi && kpi.bold
                  return (
                    <ScoreRows
                      key={ki}
                      label={kpi.label}
                      fmtType={kpi.fmt}
                      better={kpi.better}
                      bold={!!bold}
                      meta={kpi.meta as readonly number[]}
                      real={kpi.real as readonly number[]}
                      metaFy={kpi.metaFy}
                      realFy={kpi.realFy}
                      fyPct={fyPct}
                      idxs={idxs}
                      lastRow={ki === sec.kpis.length - 1}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ))}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 11, color: 'var(--color-muted)', padding: '4px 2px' }}>
        <span style={{ fontWeight: 600 }}>Semáforo:</span>
        <Legend color="#16A34A" label="≥100% Meta" />
        <Legend color="#D97706" label="85–99%" />
        <Legend color="#DC2626" label="<85%" />
      </div>
    </div>
  )
}

function ScoreRows({
  label, fmtType, better, bold, meta, real, metaFy, realFy, fyPct, idxs, lastRow,
}: {
  label: string; fmtType: string; better: string; bold: boolean
  meta: readonly number[]; real: readonly number[]; metaFy: number; realFy: number
  fyPct: number; idxs: number[]; lastRow: boolean
}) {
  const sep = lastRow ? {} : { borderBottom: '1px solid var(--color-border)' }
  const labelCell: React.CSSProperties = {
    padding: '6px 10px', verticalAlign: 'top', color: 'var(--color-foreground)',
    fontWeight: bold ? 800 : 600, fontSize: bold ? 13 : 12,
  }
  return (
    <>
      <tr>
        <td rowSpan={3} style={{ ...labelCell, ...sep }}>{label}</td>
        <td style={mutedTag}>Meta</td>
        {idxs.map(i => <td key={i} style={cellMuted}>{valStr(meta[i], fmtType)}</td>)}
        <td style={{ ...cellMuted, borderLeft: '1px solid var(--color-border)' }}>{valStr(metaFy, fmtType)}</td>
      </tr>
      <tr>
        <td style={mutedTag}>Real</td>
        {idxs.map((i, k) => <td key={k} style={cellReal}>{valStr(real[i], fmtType)}</td>)}
        <td style={{ ...cellReal, borderLeft: '1px solid var(--color-border)' }}>{valStr(realFy, fmtType)}</td>
      </tr>
      <tr style={sep}>
        <td style={mutedTag}>%</td>
        {idxs.map((i, k) => {
          const p = attainment(real[i], meta[i], better)
          return (
            <td key={k} style={{ ...cellPct, color: clr(p), background: p ? `${clr(p)}14` : 'transparent' }}>
              {p ? Math.round(p * 100) + '%' : '—'}
            </td>
          )
        })}
        <td style={{ ...cellPct, color: clr(fyPct), background: fyPct ? `${clr(fyPct)}14` : 'transparent', borderLeft: '1px solid var(--color-border)' }}>
          {fyPct ? Math.round(fyPct * 100) + '%' : '—'}
        </td>
      </tr>
    </>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />
      {label}
    </span>
  )
}

const th: React.CSSProperties = { padding: '7px 8px', textAlign: 'center', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }
const mutedTag: React.CSSProperties = { padding: '4px 8px', textAlign: 'left', color: 'var(--color-subtle)', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }
const cellMuted: React.CSSProperties = { padding: '4px 8px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 11 }
const cellReal: React.CSSProperties = { padding: '4px 8px', textAlign: 'center', color: 'var(--color-foreground)', fontWeight: 600, fontSize: 12 }
const cellPct: React.CSSProperties = { padding: '4px 8px', textAlign: 'center', fontWeight: 700, fontSize: 11, borderRadius: 4 }
