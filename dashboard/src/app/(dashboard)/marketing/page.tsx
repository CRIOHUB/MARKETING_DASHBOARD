import { Suspense } from 'react'
import { db } from '@/db'
import { conversionData } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { fmt, soles, pct, parseMeses, avg, sum } from '@/lib/utils'

interface PageProps { searchParams: Promise<{ meses?: string }> }

export default async function MarketingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)

  let conv: any[] = []
  try {
    conv = sel.length
      ? await db.select().from(conversionData).where(inArray(conversionData.mes, sel))
      : await db.select().from(conversionData)
  } catch {}

  const meses = conv.map((r: any) => r.mes)
  const avgCpl  = avg(conv.map((r: any) => r.cpl ?? 0))
  const avgCpa  = avg(conv.map((r: any) => r.cpa ?? 0))
  const avgRoas = avg(conv.map((r: any) => r.roas ?? 0))
  const avgCr3  = avg(conv.map((r: any) => r.cr3 ?? 0))
  const avgCr1  = avg(conv.map((r: any) => r.cr1 ?? 0))
  const totalInv = sum(conv.map((r: any) => r.monto ?? 0))

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="CPL Prom." value={soles(avgCpl, 2)} subvalue="costo por lead" trend={avgCpl < 10 ? 'up' : 'neutral'} />
        <KpiBox label="CPA Prom." value={soles(avgCpa, 0)} subvalue="costo por adquisición" trend={avgCpa < 200 ? 'up' : 'down'} />
        <KpiBox label="CR3 Prom." value={pct(avgCr3)} subvalue="Lead → Cliente" trend={avgCr3 >= 4 ? 'up' : 'down'} />
        <KpiBox label="CR1 Prom." value={pct(avgCr1)} subvalue="Lead → Válido" />
        <KpiBox label="Inversión" value={soles(totalInv, 0)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <GlassCard title="CPL — Costo por Lead (S/)">
          {conv.length > 0 ? (
            <Suspense fallback={<div style={{ height: 260 }} />}>
              <PlotlyChart height={260} data={[{
                type: 'bar', name: 'CPL', x: meses,
                y: conv.map((r: any) => r.cpl),
                marker: { color: meses.map((_, i) => conv[i].cpl < 10 ? '#5ED29C' : '#EF4444') },
                text: conv.map((r: any) => `S/${(r.cpl ?? 0).toFixed(2)}`),
                textposition: 'outside',
              }]} />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>

        <GlassCard title="CPA — Costo por Adquisición (S/)">
          {conv.length > 0 ? (
            <Suspense fallback={<div style={{ height: 260 }} />}>
              <PlotlyChart height={260} data={[{
                type: 'bar', name: 'CPA', x: meses,
                y: conv.map((r: any) => r.cpa),
                marker: { color: '#D97706' },
              }]} />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <GlassCard title="Tasas de Conversión (%)">
          {conv.length > 0 ? (
            <Suspense fallback={<div style={{ height: 260 }} />}>
              <PlotlyChart height={260} data={[
                { type: 'scatter', mode: 'lines+markers', name: 'CR1 (Lead→Válido)', x: meses, y: conv.map((r: any) => r.cr1), line: { color: '#2563EB' } },
                { type: 'scatter', mode: 'lines+markers', name: 'CR3 (Lead→Cliente)', x: meses, y: conv.map((r: any) => r.cr3), line: { color: '#5ED29C' } },
              ]} />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>

        <GlassCard title="Ventas Online vs Offline (uds)">
          {conv.length > 0 ? (
            <Suspense fallback={<div style={{ height: 260 }} />}>
              <PlotlyChart height={260} data={[
                { type: 'bar', name: 'Online', x: meses, y: conv.map((r: any) => r.ventaOnline), marker: { color: '#2563EB' } },
                { type: 'bar', name: 'Offline', x: meses, y: conv.map((r: any) => r.ventaOffline), marker: { color: '#D97706' } },
              ]} layout={{ barmode: 'stack' }} />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>
      </div>
    </div>
  )
}

function EmptyState() {
  return <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 12 }}>Sin datos</div>
}
