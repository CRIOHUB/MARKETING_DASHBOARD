import { Suspense } from 'react'
import { db } from '@/db'
import { vendedores } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { fmt, parseMeses, sum } from '@/lib/utils'
import { META_VEND, VEND_COLORS } from '@/lib/constants'

interface PageProps { searchParams: Promise<{ meses?: string }> }

export default async function VentasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)

  let vend: any[] = []
  try {
    vend = sel.length
      ? await db.select().from(vendedores).where(inArray(vendedores.mes, sel))
      : await db.select().from(vendedores)
  } catch {}

  const execs  = [...new Set(vend.map((r: any) => r.exec))].sort()
  const meses  = [...new Set(vend.map((r: any) => r.mes))].sort()

  const execTotals = execs.map(exec => ({
    exec,
    ucu:       sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.ucu ?? 0)),
    adn:       sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.adn ?? 0)),
    tamizaje:  sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.tamizaje ?? 0)),
    myprenatal:sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.myprenatal ?? 0)),
    segTotal:  sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.segTotal ?? 0)),
    leads:     sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.leads ?? 0)),
    validos:   sum(vend.filter((r: any) => r.exec === exec).map((r: any) => r.validos ?? 0)),
  }))

  const grandTotal = {
    ucu:  sum(execTotals.map(e => e.ucu)),
    adn:  sum(execTotals.map(e => e.adn)),
    tam:  sum(execTotals.map(e => e.tamizaje)),
    myp:  sum(execTotals.map(e => e.myprenatal)),
    seg:  sum(execTotals.map(e => e.segTotal)),
    leads:sum(execTotals.map(e => e.leads)),
    val:  sum(execTotals.map(e => e.validos)),
  }

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="UCU" value={fmt(grandTotal.ucu)} color="#0B5394" />
        <KpiBox label="ADN" value={fmt(grandTotal.adn)} color="#16A085" />
        <KpiBox label="Tamizaje" value={fmt(grandTotal.tam)} color="#E67E22" />
        <KpiBox label="MyPrenatal" value={fmt(grandTotal.myp)} color="#8E44AD" />
        <KpiBox label="Seg. Total" value={fmt(grandTotal.seg)} color="#E74C3C" />
        <KpiBox label="Leads" value={fmt(grandTotal.leads)} />
        <KpiBox label="Válidos" value={fmt(grandTotal.val)} />
      </div>

      {/* UCU por ejecutivo stacked */}
      <GlassCard title="UCU por Ejecutivo y Mes" style={{ marginBottom: 16 }}>
        {vend.length > 0 ? (
          <Suspense fallback={<div style={{ height: 280 }} />}>
            <PlotlyChart height={280} data={execs.map(exec => ({
              type: 'bar', name: exec,
              x: meses,
              y: meses.map(m => {
                const r = vend.find((d: any) => d.exec === exec && d.mes === m)
                return r?.ucu ?? 0
              }),
              marker: { color: VEND_COLORS[exec as keyof typeof VEND_COLORS] },
            }))} layout={{ barmode: 'stack' }} />
          </Suspense>
        ) : <E />}
      </GlassCard>

      {/* Full table */}
      {vend.length > 0 && (
        <GlassCard title="Detalle por Ejecutivo">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Ejecutivo','Zona','Mes','UCU','ADN','Tamizaje','MyPrenatal','Seg.Total','Leads','Válidos'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vend.map((r: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                    <td style={{ ...td, fontWeight: 600 }}>{r.exec}</td>
                    <td style={td}>{r.zona}</td>
                    <td style={td}>{r.mes}</td>
                    <td style={{ ...td, color: '#0B5394', fontWeight: 700 }}>{r.ucu}</td>
                    <td style={{ ...td, color: '#16A085' }}>{r.adn}</td>
                    <td style={{ ...td, color: '#E67E22' }}>{r.tamizaje}</td>
                    <td style={{ ...td, color: '#8E44AD' }}>{r.myprenatal}</td>
                    <td style={{ ...td, color: '#E74C3C' }}>{r.segTotal}</td>
                    <td style={td}>{r.leads}</td>
                    <td style={td}>{r.validos}</td>
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
const td: React.CSSProperties = { padding: '7px 10px', color: 'var(--color-foreground)' }
