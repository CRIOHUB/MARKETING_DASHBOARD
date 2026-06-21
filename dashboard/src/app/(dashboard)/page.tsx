import { Suspense } from 'react'
import { db } from '@/db'
import { conversionData, serviceMix } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { KpiBox } from '@/components/ui/kpi-box'
import { GlassCard } from '@/components/ui/glass-card'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { fmt, soles, pct, parseMeses, avg, sum } from '@/lib/utils'
import { SCORECARD_DEF, ALL_MESES, CHART_COLORS } from '@/lib/constants'

interface PageProps {
  searchParams: Promise<{ meses?: string }>
}

async function getConvData(meses: string[]) {
  if (!process.env.DATABASE_URL) return []
  const rows = meses.length
    ? await db.select().from(conversionData).where(inArray(conversionData.mes, meses))
    : await db.select().from(conversionData)
  return rows
}

async function getMixData(meses: string[]) {
  if (!process.env.DATABASE_URL) return []
  const rows = meses.length
    ? await db.select().from(serviceMix).where(inArray(serviceMix.mes, meses))
    : await db.select().from(serviceMix)
  return rows
}

export default async function KpisPage({ searchParams }: PageProps) {
  const params  = await searchParams
  const selMeses = parseMeses(params.meses)
  const activeMeses = selMeses.length ? selMeses : [...ALL_MESES]

  let conv: Awaited<ReturnType<typeof getConvData>> = []
  let mix:  Awaited<ReturnType<typeof getMixData>>  = []
  try {
    ;[conv, mix] = await Promise.all([
      getConvData(selMeses),
      getMixData(selMeses),
    ])
  } catch {
    // DB not connected — show empty state
  }

  // ── Aggregates ───────────────────────────────────────────────
  const totalLeads   = sum(conv.map(r => r.ing ?? 0))
  const totalServ    = sum(conv.map(r => r.serv ?? 0))
  const totalVenta   = sum(conv.map(r => r.venta ?? 0))
  const totalInv     = sum(conv.map(r => r.monto ?? 0))
  const avgRoas      = avg(conv.map(r => r.roas ?? 0))
  const avgCpa       = avg(conv.map(r => r.cpa ?? 0))
  const avgCr3       = avg(conv.map(r => r.cr3 ?? 0))
  const avgCpl       = avg(conv.map(r => r.cpl ?? 0))
  const totalValidos = sum(conv.map(r => r.val ?? 0))

  // ── Chart data ───────────────────────────────────────────────
  const chartMeses = conv.map(r => r.mes)
  const convChart = {
    data: [
      { type: 'bar', name: 'Leads', x: chartMeses, y: conv.map(r => r.ing), marker: { color: '#2563EB' } },
      { type: 'bar', name: 'Válidos', x: chartMeses, y: conv.map(r => r.val), marker: { color: '#7C3AED' } },
      { type: 'bar', name: 'Servicios', x: chartMeses, y: conv.map(r => r.serv), marker: { color: '#5ED29C' } },
    ],
    layout: { barmode: 'group' },
  }

  const roasChart = {
    data: [{
      type: 'scatter', mode: 'lines+markers', name: 'ROAS',
      x: chartMeses, y: conv.map(r => r.roas),
      line: { color: '#5ED29C', width: 2.5 },
      marker: { color: '#5ED29C', size: 8 },
      fill: 'tozeroy', fillcolor: 'rgba(94,210,156,.10)',
    }],
    layout: { yaxis: { title: { text: 'x' } } },
  }

  // Scorecard hero KPIs
  const SC = SCORECARD_DEF
  const scMeses = SC.meses
  function ytd(kpi: { fmt: string; real: readonly number[]; meta_fy: number }, label = '') {
    const activeSC = scMeses.filter(m => activeMeses.includes(m))
    const indices  = activeSC.map(m => scMeses.indexOf(m)).filter(i => i >= 0)
    const vals     = indices.map(i => kpi.real[i])
    if (kpi.fmt === 'pct' || kpi.fmt === 'soles' || kpi.fmt === 'mxn') return avg(vals)
    return sum(vals)
  }

  return (
    <div>
      <Suspense>
        <MonthFilter />
      </Suspense>

      {/* ── Hero KPI row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        <KpiBox
          label="Ventas CrioCord"
          value={fmt(totalServ > 0 ? totalServ : ytd(SC.sections[4].kpis[0]))}
          subvalue={`Meta FY: ${fmt(SC.meta_fy_ventas)}`}
          trend={totalServ >= 80 ? 'up' : 'neutral'}
          color="var(--color-primary)"
        />
        <KpiBox
          label="Total Leads"
          value={compact(totalLeads)}
          subvalue="ingresados"
        />
        <KpiBox
          label="Leads Válidos"
          value={compact(totalValidos)}
        />
        <KpiBox
          label="Inversión"
          value={soles(totalInv, 0)}
          trend={totalInv > 0 ? 'neutral' : 'neutral'}
        />
        <KpiBox
          label="Venta Total"
          value={soles(totalVenta, 0)}
          color="var(--color-primary)"
          trend={totalVenta > totalInv ? 'up' : 'down'}
        />
        <KpiBox
          label="ROAS Prom."
          value={fmt(avgRoas, 2) + 'x'}
          trend={avgRoas >= 10 ? 'up' : avgRoas >= 5 ? 'neutral' : 'down'}
          trendLabel={avgRoas >= 10 ? 'Excelente' : avgRoas >= 5 ? 'Aceptable' : 'Bajo'}
        />
        <KpiBox
          label="CPA Prom."
          value={soles(avgCpa, 0)}
          subvalue="costo por adquisición"
          trend={avgCpa < 200 ? 'up' : 'down'}
        />
        <KpiBox
          label="CR Lead→Cliente"
          value={pct(avgCr3)}
          subvalue="CR3 promedio"
          trend={avgCr3 >= 4 ? 'up' : 'down'}
        />
        <KpiBox
          label="CPL Prom."
          value={soles(avgCpl, 2)}
          subvalue="costo por lead"
        />
      </div>

      {/* ── Scorecard sections ── */}
      <div style={{ marginBottom: 24 }}>
        {SC.sections.map(sec => (
          <GlassCard
            key={sec.id}
            style={{ marginBottom: 12 }}
            title={`${sec.num} ${sec.title}`}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}>
              {sec.kpis.map(kpi => {
                const real = ytd(kpi)
                const activeSC = scMeses.filter(m => activeMeses.includes(m))
                const metaYtd  = (kpi.fmt === 'pct' || kpi.fmt === 'soles')
                  ? kpi.meta_fy
                  : sum(activeSC.map(m => kpi.meta[scMeses.indexOf(m)]).filter(v => v >= 0))
                const pctVal   = metaYtd ? (kpi.fmt === 'soles' ? metaYtd / real : real / metaYtd) : 0
                const clr      = pctVal >= 1 ? '#16A34A' : pctVal >= 0.85 ? '#D97706' : '#DC2626'
                return (
                  <div key={kpi.id} style={{
                    background: `${clr}11`,
                    border: `1.4px solid ${clr}33`,
                    borderRadius: 'var(--r-sm)',
                    padding: '12px 14px',
                  }}>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>{kpi.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: clr }}>
                      {(() => {
                        if (kpi.fmt === 'pct') return pct(real * 100)
                        if (kpi.fmt === 'soles') return soles(real, 0)
                        return real >= 10000 ? (real / 1000).toFixed(1) + 'K' : fmt(Math.round(real))
                      })()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
                      {pctVal ? `${Math.round(pctVal * 100)}% de meta` : 'Sin meta'}
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Charts ── */}
      {conv.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <GlassCard title="Leads / Válidos / Servicios por Mes">
            <Suspense fallback={<div style={{ height: 300 }} />}>
              <PlotlyChart data={convChart.data} layout={convChart.layout} height={280} />
            </Suspense>
          </GlassCard>
          <GlassCard title="ROAS Mensual">
            <Suspense fallback={<div style={{ height: 300 }} />}>
              <PlotlyChart data={roasChart.data} layout={roasChart.layout} height={280} />
            </Suspense>
          </GlassCard>
        </div>
      )}

      {conv.length === 0 && (
        <div className="glass" style={{
          borderRadius: 'var(--r-md)', padding: 40,
          textAlign: 'center', color: 'var(--color-muted)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Base de datos no configurada</div>
          <div style={{ fontSize: 13 }}>
            Crea un archivo <code>.env.local</code> con <code>DATABASE_URL</code>, luego ejecuta{' '}
            <code>npm run db:push && npm run db:seed</code>
          </div>
        </div>
      )}
    </div>
  )
}

function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return fmt(Math.round(n))
}
