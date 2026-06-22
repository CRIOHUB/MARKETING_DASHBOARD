import { Suspense } from 'react'
import { db } from '@/db'
import { conversionData, inversionBruta, presupuesto, vendedores } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { soles, fmt, parseMeses, sum, avg } from '@/lib/utils'

interface PageProps { searchParams: Promise<{ meses?: string }> }

export default async function ResumenPage({ searchParams }: PageProps) {
  const params    = await searchParams
  const selMeses  = parseMeses(params.meses)

  let conv:  any[] = []
  let binv:  any[] = []
  let ppto:  any[] = []
  let vend:  any[] = []

  try {
    const filter = (tbl: any, col: any) =>
      selMeses.length ? db.select().from(tbl).where(inArray(col, selMeses)) : db.select().from(tbl)

    ;[conv, binv, ppto, vend] = await Promise.all([
      filter(conversionData, conversionData.mes),
      filter(inversionBruta, inversionBruta.mes),
      filter(presupuesto, presupuesto.mes),
      filter(vendedores, vendedores.mes),
    ])
  } catch {}

  const meses      = conv.map((r: any) => r.mes)
  const invPub     = binv.map((r: any) => r.invPub ?? 0)
  const invTotal   = binv.map((r: any) => r.invTotal ?? 0)
  const pptoTotal  = binv.map((r: any) => r.pptoTotal ?? 0)
  const ventaTotal = sum(conv.map((r: any) => r.venta ?? 0))
  const invTot     = sum(invTotal)
  const avgRoas    = avg(conv.map((r: any) => r.roas ?? 0))

  // Vend online vs offline
  const ucuByMes = conv.map((r: any) => r.ventaOnline ?? 0)
  const offByMes = conv.map((r: any) => r.ventaOffline ?? 0)

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="Ventas (uds)" value={fmt(ventaTotal)} color="var(--color-primary)" subvalue="online + offline" />
        <KpiBox label="Inversión Total" value={soles(invTot, 0)} />
        <KpiBox label="Servicios" value={fmt(sum(conv.map((r: any) => r.serv ?? 0)))} />
        <KpiBox label="Leads" value={fmt(sum(conv.map((r: any) => r.ing ?? 0)))} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <GlassCard title="Inversión Publicitaria vs Total MKT vs Presupuesto (S/)">
          {binv.length > 0 ? (
            <Suspense fallback={<div style={{ height: 240 }} />}>
              <PlotlyChart
                height={240}
                data={[
                  { type: 'bar', name: 'Inv. Pub.', x: binv.map((r: any) => r.mes), y: invPub, marker: { color: '#2563EB' } },
                  { type: 'bar', name: 'Inv. Total', x: binv.map((r: any) => r.mes), y: invTotal, marker: { color: '#7C3AED' } },
                  { type: 'bar', name: 'Presupuesto', x: binv.map((r: any) => r.mes), y: pptoTotal, marker: { color: 'rgba(94,210,156,.5)' } },
                ]}
                layout={{ barmode: 'group' }}
              />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>

        <GlassCard title="Servicios Vendidos por Mes">
          {conv.length > 0 ? (
            <Suspense fallback={<div style={{ height: 240 }} />}>
              <PlotlyChart
                height={240}
                data={[{
                  type: 'bar', name: 'Servicios', x: meses, y: conv.map((r: any) => r.serv),
                  text: conv.map((r: any) => String(r.serv ?? 0)),
                  textposition: 'outside',
                  marker: { color: '#5ED29C' },
                }]}
              />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>
      </div>

      <GlassCard title="Ventas Online vs Offline (uds)">
        {conv.length > 0 ? (
          <Suspense fallback={<div style={{ height: 240 }} />}>
            <PlotlyChart
              height={240}
              data={[
                { type: 'bar', name: 'Online', x: meses, y: ucuByMes, marker: { color: '#2563EB' } },
                { type: 'bar', name: 'Offline', x: meses, y: offByMes, marker: { color: '#D97706' } },
              ]}
              layout={{ barmode: 'stack' }}
            />
          </Suspense>
        ) : <EmptyState />}
      </GlassCard>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 12 }}>
      Sin datos — configura DB y ejecuta seed
    </div>
  )
}
