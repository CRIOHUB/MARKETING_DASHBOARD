import { Suspense } from 'react'
import { db } from '@/db'
import { captacion, captacionRep, vmProspeccion, visitaMedica, visitaMedicaCategoria, clinicas, prospeccionIngresos } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { PlotlyChart } from '@/components/charts/plotly-chart'
import { fmt, parseMeses, sum } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'
import { VendorFilter } from '@/components/ui/vendor-filter'

interface PageProps { searchParams: Promise<{ meses?: string; vend?: string }> }

export default async function CaptacionPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)
  const selVend = parseMeses(params.vend)

  let capt: any[] = [], captRep: any[] = [], vmProsp: any[] = [], vm: any[] = [], clin: any[] = [], prospIng: any[] = []
  try {
    const f = (t: any, c: any) => sel.length ? db.select().from(t).where(inArray(c, sel)) : db.select().from(t)
    ;[capt, captRep, vmProsp, vm, clin, prospIng] = await Promise.all([
      f(captacion, captacion.mes),
      f(captacionRep, captacionRep.mes),
      f(vmProspeccion, vmProspeccion.mes),
      f(visitaMedica, visitaMedica.mes),
      db.select().from(clinicas),
      db.select().from(prospeccionIngresos), // sin filtro de mes (comparativo offline)
    ])
  } catch {}

  // ── Prospección OFFLINE (Visitadores): comparativo por mes + detalle del último mes ──
  const MESES_ORD = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
  const offline = prospIng.filter((r: any) => r.grupo === 'Visitadores')
  const offMonths = MESES_ORD.filter(m => offline.some((r: any) => r.mes === m))
  const totOf = (m?: string) => m ? sum(offline.filter((r: any) => r.mes === m).map((r: any) => r.total ?? 0)) : 0
  const offByMonth = offMonths.map(m => ({ mes: m, total: totOf(m) }))
  const lastMes  = offMonths[offMonths.length - 1] ?? ''
  const prevMes  = offMonths[offMonths.length - 2]
  const prev2Mes = offMonths[offMonths.length - 3]
  const totLast  = totOf(lastMes)
  const deltaPct = (base?: string) => { const b = totOf(base); return b ? Math.round(((totLast - b) / b) * 1000) / 10 : null }
  const dPrev  = deltaPct(prevMes)
  const dPrev2 = deltaPct(prev2Mes)
  const offRep = offline.filter((r: any) => r.mes === lastMes)
    .map((r: any) => ({ rep: r.captador, total: r.total ?? 0 }))
    .sort((a: any, b: any) => b.total - a.total)
  const PROD = [
    { key: 'cordon',     label: 'Cordón',     color: '#0B5394' },
    { key: 'myprenatal', label: 'MyPrenatal', color: '#16A085' },
    { key: 'tamizaje',   label: 'Tamizaje',   color: '#5B9BD5' },
    { key: 'adn',        label: 'ADN',        color: '#A6A6A6' },
  ]
  const offProd = PROD.map(p => ({ ...p, val: sum(offline.filter((r: any) => r.mes === lastMes).map((r: any) => r[p.key] ?? 0)) }))

  // Filtro por rep: une los nombres de Visita Médica (exec) y Captación por Rep (rep)
  const repOptions = [...new Set([
    ...vm.map((r: any) => r.exec),
    ...captRep.map((r: any) => r.rep),
  ].filter(Boolean))].sort()
  const inRep = (name: string) => !selVend.length || selVend.includes(name)
  const vmF      = vm.filter((r: any) => inRep(r.exec))
  const captRepF = captRep.filter((r: any) => inRep(r.rep))

  const totalCapt = sum(capt.map((r: any) => r.ventas ?? 0))
  const totalVM   = sum(vmF.map((r: any) => r.visitas ?? 0))

  const captadores = [...new Set(capt.map((r: any) => r.captador))]
  const mesesCapt  = [...new Set(capt.map((r: any) => r.mes))].sort()

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>
      <Suspense><VendorFilter options={repOptions} label="Rep" /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="Captaciones Totales" value={fmt(totalCapt)} color="var(--color-primary)" />
        <KpiBox label="Visitas VM" value={fmt(totalVM)} />
        <KpiBox label="Captadores" value={String(captadores.length)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <GlassCard title="Captaciones por Canal y Mes">
          {capt.length > 0 ? (
            <Suspense fallback={<div style={{ height: 280 }} />}>
              <PlotlyChart
                height={280}
                data={captadores.map(cap => ({
                  type: 'bar', name: String(cap),
                  x: mesesCapt,
                  y: mesesCapt.map(m => {
                    const r = capt.find((d: any) => d.mes === m && d.captador === cap)
                    return r?.ventas ?? 0
                  }),
                  marker: { color: CHART_COLORS[cap as keyof typeof CHART_COLORS] },
                }))}
                layout={{ barmode: 'stack' }}
              />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>

        <GlassCard title="Visitas Médicas por Rep">
          {vmF.length > 0 ? (
            <Suspense fallback={<div style={{ height: 280 }} />}>
              <PlotlyChart
                height={280}
                data={[...new Set(vmF.map((r: any) => r.exec))].map(exec => ({
                  type: 'bar', name: String(exec),
                  x: [...new Set(vmF.map((r: any) => r.mes))].sort(),
                  y: [...new Set(vmF.map((r: any) => r.mes))].sort().map(m => {
                    const r = vmF.find((d: any) => d.mes === m && d.exec === exec)
                    return r?.visitas ?? 0
                  }),
                }))}
                layout={{ barmode: 'group' }}
              />
            </Suspense>
          ) : <EmptyState />}
        </GlassCard>
      </div>

      {/* Captación por rep table */}
      {captRepF.length > 0 && (
        <GlassCard title="Captación por Rep (Unidades por Servicio)">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Mes','Rep','Canal','UCU','Tamizaje','ADN','MyPrenatal','Total'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {captRepF.map((r: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                    <td style={td}>{r.mes}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.rep}</td>
                    <td style={td}>{r.canal}</td>
                    <td style={td}>{r.ucu}</td>
                    <td style={td}>{r.tamizaje}</td>
                    <td style={td}>{r.adn}</td>
                    <td style={td}>{r.myprenatal}</td>
                    <td style={{ ...td, fontWeight: 700, color: 'var(--color-primary)' }}>{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {offline.length > 0 && (
        <GlassCard
          title="Prospección Offline — Resumen de ingresos"
          subtitle={`Ingresos por prospección offline (Visitadores) · ${offMonths.join(' – ')}`}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ background: '#0B539414', border: '1.4px solid #0B539455', borderRadius: 'var(--r-sm)', padding: '12px 16px' }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Total ingresos {lastMes}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#0B5394' }}>{fmt(totLast)}</div>
            </div>
            {dPrev != null && <DeltaChip value={dPrev} label={`vs ${prevMes}`} />}
            {dPrev2 != null && <DeltaChip value={dPrev2} label={`vs ${prev2Mes}`} />}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Ingresos Offline por mes</div>
              <Suspense fallback={<div style={{ height: 260 }} />}>
                <PlotlyChart height={260} data={[{
                  type: 'bar', x: offByMonth.map(x => x.mes), y: offByMonth.map(x => x.total),
                  text: offByMonth.map(x => String(x.total)), textposition: 'outside',
                  marker: { color: '#0B5394' },
                }]} />
              </Suspense>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Ingresos por representante · {lastMes}</div>
              <Suspense fallback={<div style={{ height: 260 }} />}>
                <PlotlyChart height={260} data={[{
                  type: 'bar', orientation: 'h',
                  x: offRep.map(r => r.total).reverse(),
                  y: offRep.map(r => r.rep).reverse(),
                  text: offRep.map(r => `${r.total} (${totLast ? (Math.round(r.total / totLast * 1000) / 10).toFixed(1) : 0}%)`).reverse(),
                  textposition: 'outside', marker: { color: '#0B5394' },
                }]} layout={{ margin: { l: 70 } }} />
              </Suspense>
            </div>
          </div>

          <div className="eyebrow" style={{ marginBottom: 6 }}>Distribución por producto · {lastMes}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
            <Suspense fallback={<div style={{ height: 260 }} />}>
              <PlotlyChart height={260} data={[{
                type: 'pie', hole: 0.6,
                labels: offProd.map(p => p.label), values: offProd.map(p => p.val),
                marker: { colors: offProd.map(p => p.color) },
                textinfo: 'percent', textfont: { size: 12 },
              }]} layout={{ showlegend: false }} />
            </Suspense>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }}>Producto</th>
                    <th style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }}>Ingresos</th>
                    <th style={{ padding: '7px 10px', textAlign: 'right', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }}>% del total</th>
                  </tr>
                </thead>
                <tbody>
                  {offProd.map(p => (
                    <tr key={p.label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ ...td, fontWeight: 600 }}>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: p.color, marginRight: 8 }} />
                        {p.label}
                      </td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{fmt(p.val)}</td>
                      <td style={{ ...td, textAlign: 'right', color: 'var(--color-muted)' }}>{totLast ? (Math.round(p.val / totLast * 1000) / 10).toFixed(1) : '0.0'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

function EmptyState() {
  return <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: 12 }}>Sin datos</div>
}

function DeltaChip({ value, label }: { value: number; label: string }) {
  const up = value >= 0
  const color = up ? '#16A34A' : '#DC2626'
  return (
    <div style={{ background: `${color}14`, border: `1.4px solid ${color}55`, borderRadius: 'var(--r-sm)', padding: '8px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{up ? '▲ +' : '▼ '}{value.toFixed(1)}%</div>
      <div className="eyebrow">{label}</div>
    </div>
  )
}
const td: React.CSSProperties = { padding: '8px 10px', color: 'var(--color-foreground)' }
