import { Suspense } from 'react'
import { db } from '@/db'
import { serviceMix } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { fmt, parseMeses, sum } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'
import { ServiceFilter } from '@/components/ui/service-filter'

interface PageProps { searchParams: Promise<{ meses?: string; serv?: string }> }

const ALL_SERVICIOS = ['UCU', 'ADN', 'Tamizaje', 'MyPrenatal', 'Seguridad Total'] as const

export default async function MixPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)
  const selServ = parseMeses(params.serv)
  const SERVICIOS = (selServ.length ? ALL_SERVICIOS.filter(s => selServ.includes(s)) : [...ALL_SERVICIOS]) as string[]

  let mix: any[] = []
  try {
    mix = sel.length
      ? await db.select().from(serviceMix).where(inArray(serviceMix.mes, sel))
      : await db.select().from(serviceMix)
  } catch {}

  const meses = [...new Set(mix.map((r: any) => r.mes))].sort()
  const totales = SERVICIOS.reduce((acc, s) => ({
    ...acc,
    [s]: sum(mix.filter((r: any) => r.servicio === s).map((r: any) => r.servicios ?? 0)),
  }), {} as Record<string, number>)
  const totalGeneral = sum(Object.values(totales))

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>
      <Suspense><ServiceFilter /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {SERVICIOS.map(s => (
          <KpiBox
            key={s} label={s} value={fmt(totales[s] ?? 0)}
            subvalue={totalGeneral ? `${Math.round((totales[s] ?? 0) / totalGeneral * 100)}%` : ''}
            color={CHART_COLORS[s as keyof typeof CHART_COLORS]}
          />
        ))}
        <KpiBox label="Total" value={fmt(totalGeneral)} color="var(--color-primary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <GlassCard title="Mix por Servicio y Mes">
          {mix.length > 0 ? (
            <Suspense fallback={<div style={{ height: 300 }} />}>
              <PlotlyChart
                height={300}
                data={SERVICIOS.map(s => ({
                  type: 'bar', name: s,
                  x: meses,
                  y: meses.map(m => {
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

        <GlassCard title="Participación Total (Pie)">
          {mix.length > 0 ? (
            <Suspense fallback={<div style={{ height: 300 }} />}>
              <PlotlyChart
                height={300}
                data={[{
                  type: 'pie',
                  labels: SERVICIOS.filter(s => totales[s] > 0),
                  values: SERVICIOS.filter(s => totales[s] > 0).map(s => totales[s]),
                  marker: {
                    colors: SERVICIOS.filter(s => totales[s] > 0)
                      .map(s => CHART_COLORS[s as keyof typeof CHART_COLORS]),
                  },
                  hole: 0.45,
                  textinfo: 'label+percent',
                  textfont: { size: 11 },
                }]}
                layout={{ showlegend: true }}
              />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>
      </div>
    </div>
  )
}

function EmptyState() {
  return <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 12 }}>Sin datos</div>
}
