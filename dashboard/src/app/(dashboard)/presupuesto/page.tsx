import { Suspense } from 'react'
import { db } from '@/db'
import { presupuesto, historialGastos } from '@/db/schema'
import { inArray, desc } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { soles, fmt, pct, parseMeses, sum, avg } from '@/lib/utils'

interface PageProps { searchParams: Promise<{ meses?: string }> }

export default async function PresupuestoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)

  let ppto: any[] = [], hist: any[] = []
  try {
    const f = (t: any, c: any) => sel.length ? db.select().from(t).where(inArray(c, sel)) : db.select().from(t)
    ;[ppto, hist] = await Promise.all([
      f(presupuesto, presupuesto.mes),
      db.select().from(historialGastos).orderBy(desc(historialGastos.fecha)),
    ])
  } catch {}

  const totalGastado   = sum(ppto.map((r: any) => r.gastado ?? 0))
  const totalPlan      = sum(ppto.map((r: any) => r.pptoPlan ?? 0))
  const avgCumpl       = avg(ppto.map((r: any) => r.cumplPct ?? 0))
  const totalOnline    = sum(ppto.map((r: any) => r.online ?? 0))
  const totalOffline   = sum(ppto.map((r: any) => r.offline ?? 0))

  const meses = ppto.map((r: any) => r.mes)

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="Gasto Total" value={soles(totalGastado, 0)} color="var(--color-primary)" />
        <KpiBox label="Presupuesto Plan" value={soles(totalPlan, 0)} />
        <KpiBox label="% Ejecución Prom." value={pct(avgCumpl)} trend={avgCumpl >= 80 ? 'up' : 'down'} />
        <KpiBox label="Online" value={soles(totalOnline, 0)} subvalue="pauta · digital" />
        <KpiBox label="Offline" value={soles(totalOffline, 0)} subvalue="actividades · materiales" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <GlassCard title="Gasto vs Presupuesto por Mes (S/)">
          {ppto.length > 0 ? (
            <Suspense fallback={<div style={{ height: 280 }} />}>
              <PlotlyChart height={280} data={[
                { type: 'bar', name: 'Gastado', x: meses, y: ppto.map((r: any) => r.gastado), marker: { color: '#2563EB' } },
                { type: 'bar', name: 'Presupuesto', x: meses, y: ppto.map((r: any) => r.pptoPlan), marker: { color: 'rgba(94,210,156,.5)' } },
              ]} layout={{ barmode: 'group' }} />
            </Suspense>
          ) : <E />}
        </GlassCard>

        <GlassCard title="Desglose Online / Offline (S/)">
          {ppto.length > 0 ? (
            <Suspense fallback={<div style={{ height: 280 }} />}>
              <PlotlyChart height={280} data={[
                { type: 'bar', name: 'Online', x: meses, y: ppto.map((r: any) => r.online), marker: { color: '#2563EB' } },
                { type: 'bar', name: 'Offline', x: meses, y: ppto.map((r: any) => r.offline), marker: { color: '#D97706' } },
              ]} layout={{ barmode: 'stack' }} />
            </Suspense>
          ) : <E />}
        </GlassCard>
      </div>

      {hist.length > 0 && (
        <GlassCard title="Historial de Gastos">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Fecha','Mes','Categoría','Descripción','Monto'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hist.map((r: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                    <td style={td}>{r.fecha}</td>
                    <td style={td}>{r.mes}</td>
                    <td style={td}>{r.categoria}</td>
                    <td style={{ ...td, maxWidth: 260 }}>{r.descripcion}</td>
                    <td style={{ ...td, fontWeight: 700, color: 'var(--color-primary)', textAlign: 'right' }}>{soles(r.monto ?? 0, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

function E() {
  return <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 12 }}>Sin datos</div>
}
const td: React.CSSProperties = { padding: '8px 12px', color: 'var(--color-foreground)' }
