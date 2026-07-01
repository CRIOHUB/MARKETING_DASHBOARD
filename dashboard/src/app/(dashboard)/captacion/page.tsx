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
      f(prospeccionIngresos, prospeccionIngresos.mes),
    ])
  } catch {}

  // Prospección — ingresados por grupo/captador
  const GRUPOS = ['Visitadores', 'Comercial', 'MKT', 'Anualidades']
  const GRUPO_COLOR: Record<string, string> = { Visitadores: '#0B5394', Comercial: '#16A085', MKT: '#E67E22', Anualidades: '#8E44AD' }
  const totalIng = sum(prospIng.map((r: any) => r.total ?? 0))
  const ingByGrupo = GRUPOS.map(g => ({ g, total: sum(prospIng.filter((r: any) => r.grupo === g).map((r: any) => r.total ?? 0)) })).filter(x => x.total > 0)
  const prospRows = [...prospIng].sort((a: any, b: any) =>
    GRUPOS.indexOf(a.grupo) - GRUPOS.indexOf(b.grupo) || (b.total ?? 0) - (a.total ?? 0))
  // Canal: Digital = MKT + Comercial + Anualidades · Offline = Visitadores
  const CANAL_DE: Record<string, 'Digital' | 'Offline'> = { Visitadores: 'Offline', Comercial: 'Digital', MKT: 'Digital', Anualidades: 'Digital' }
  const ingDigital = sum(prospIng.filter((r: any) => CANAL_DE[r.grupo] === 'Digital').map((r: any) => r.total ?? 0))
  const ingOffline = sum(prospIng.filter((r: any) => CANAL_DE[r.grupo] === 'Offline').map((r: any) => r.total ?? 0))

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

      {prospIng.length > 0 && (
        <GlassCard
          title="Prospección — Ingresados por Canal"
          subtitle={`Total ingresados: ${fmt(totalIng)} · Digital = MKT + Comercial + Anualidades · Offline = Visitadores`}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div style={{ background: '#2563EB14', border: '1.4px solid #2563EB55', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Digital · MKT + Comercial + Anualidades</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#2563EB' }}>{fmt(ingDigital)}</div>
            </div>
            <div style={{ background: '#D9770614', border: '1.4px solid #D9770655', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Offline · Visitadores</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#D97706' }}>{fmt(ingOffline)}</div>
            </div>
          </div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Detalle por grupo</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 14 }}>
            {ingByGrupo.map(({ g, total }) => (
              <div key={g} style={{ background: `${GRUPO_COLOR[g]}14`, border: `1.4px solid ${GRUPO_COLOR[g]}33`, borderRadius: 'var(--r-sm)', padding: '10px 12px' }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{g}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: GRUPO_COLOR[g] }}>{fmt(total)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
            <Suspense fallback={<div style={{ height: 260 }} />}>
              <PlotlyChart
                height={260}
                data={[{
                  type: 'bar',
                  x: ingByGrupo.map(x => x.g),
                  y: ingByGrupo.map(x => x.total),
                  text: ingByGrupo.map(x => String(x.total)),
                  textposition: 'outside',
                  marker: { color: ingByGrupo.map(x => GRUPO_COLOR[x.g]) },
                }]}
              />
            </Suspense>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Grupo','Captador','Cordón','Tamizaje','ADN','MyPrenatal','Total'].map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: 10 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prospRows.map((r: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ ...td, color: GRUPO_COLOR[r.grupo], fontWeight: 600 }}>{r.grupo}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{r.captador}</td>
                      <td style={td}>{r.cordon}</td>
                      <td style={td}>{r.tamizaje}</td>
                      <td style={td}>{r.adn}</td>
                      <td style={td}>{r.myprenatal}</td>
                      <td style={{ ...td, fontWeight: 700, color: 'var(--color-primary)' }}>{r.total}</td>
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
const td: React.CSSProperties = { padding: '8px 10px', color: 'var(--color-foreground)' }
