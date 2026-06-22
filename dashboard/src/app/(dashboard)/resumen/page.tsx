import { Suspense } from 'react'
import { db } from '@/db'
import { conversionData, inversionBruta, presupuesto, vendedores, serviceMix } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { soles, fmt, parseMeses, sum, avg } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'

const SERVICIOS = ['UCU', 'ADN', 'Tamizaje', 'MyPrenatal', 'Seguridad Total'] as const

interface PageProps { searchParams: Promise<{ meses?: string }> }

export default async function ResumenPage({ searchParams }: PageProps) {
  const params    = await searchParams
  const selMeses  = parseMeses(params.meses)

  let conv:  any[] = []
  let binv:  any[] = []
  let ppto:  any[] = []
  let vend:  any[] = []
  let mix:   any[] = []

  try {
    const filter = (tbl: any, col: any) =>
      selMeses.length ? db.select().from(tbl).where(inArray(col, selMeses)) : db.select().from(tbl)

    ;[conv, binv, ppto, vend, mix] = await Promise.all([
      filter(conversionData, conversionData.mes),
      filter(inversionBruta, inversionBruta.mes),
      filter(presupuesto, presupuesto.mes),
      filter(vendedores, vendedores.mes),
      filter(serviceMix, serviceMix.mes),
    ])
  } catch {}

  const mesesMix = [...new Set(mix.map((r: any) => r.mes))].sort()
  const totBy = (s: string) => sum(mix.filter((r: any) => r.servicio === s).map((r: any) => r.servicios ?? 0))

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

      {/* ── Detalle por servicio ── */}
      <GlassCard title="Detalle por Servicio (uds vendidas)" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
          {SERVICIOS.map(s => {
            const c = CHART_COLORS[s as keyof typeof CHART_COLORS]
            return (
              <div key={s} style={{ background: `${c}14`, border: `1.4px solid ${c}33`, borderRadius: 'var(--r-sm)', padding: '10px 12px' }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{s}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{fmt(totBy(s))}</div>
              </div>
            )
          })}
        </div>
        {mix.length > 0 ? (
          <Suspense fallback={<div style={{ height: 240 }} />}>
            <PlotlyChart
              height={240}
              data={SERVICIOS.map(s => ({
                type: 'bar', name: s,
                x: mesesMix,
                y: mesesMix.map(m => {
                  const r = mix.find((d: any) => d.mes === m && d.servicio === s)
                  return r?.servicios ?? 0
                }),
                marker: { color: CHART_COLORS[s as keyof typeof CHART_COLORS] },
              }))}
              layout={{ barmode: 'stack' }}
            />
          </Suspense>
        ) : <EmptyState />}
      </GlassCard>

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
