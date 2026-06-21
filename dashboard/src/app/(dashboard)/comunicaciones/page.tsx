import { Suspense } from 'react'
import { db } from '@/db'
import { comunicaciones } from '@/db/schema'
import { inArray, asc } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { MonthFilter } from '@/components/ui/month-filter'
import { Badge } from '@/components/ui/badge'
import { parseMeses, sum } from '@/lib/utils'

interface PageProps { searchParams: Promise<{ meses?: string }> }

export default async function ComunicacionesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sel = parseMeses(params.meses)

  let comms: any[] = []
  try {
    comms = sel.length
      ? await db.select().from(comunicaciones).where(inArray(comunicaciones.mes, sel)).orderBy(asc(comunicaciones.fecha))
      : await db.select().from(comunicaciones).orderBy(asc(comunicaciones.fecha))
  } catch {}

  const total   = comms.length
  const hechos  = comms.filter((r: any) => r.hecho).length
  const pctComp = total ? Math.round(hechos / total * 100) : 0

  const canales = [...new Set(comms.map((r: any) => r.canal))].sort()
  const byCanal = canales.reduce((acc, c) => ({ ...acc, [c]: comms.filter((r: any) => r.canal === c).length }), {} as Record<string,number>)

  return (
    <div>
      <Suspense><MonthFilter /></Suspense>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="Total Acciones" value={String(total)} />
        <KpiBox label="Completadas" value={String(hechos)} color="var(--color-primary)" />
        <KpiBox label="% Completado" value={`${pctComp}%`} trend={pctComp >= 70 ? 'up' : 'down'} />
        {Object.entries(byCanal).map(([canal, count]) => (
          <KpiBox key={canal} label={canal} value={String(count)} />
        ))}
      </div>

      <GlassCard title="Plan de Comunicaciones">
        {comms.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Fecha','Mes','Canal','Audiencia','Tipo','Tema','Estado'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comms.map((r: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                    <td style={td}>{r.fecha}</td>
                    <td style={td}>{r.mes}</td>
                    <td style={td}><Badge label={r.canal} /></td>
                    <td style={td}>{r.audiencia}</td>
                    <td style={td}>{r.tipo}</td>
                    <td style={{ ...td, maxWidth: 240, fontStyle: 'italic', color: 'var(--color-muted)' }}>{r.tema}</td>
                    <td style={td}>
                      {r.hecho
                        ? <span style={{ color: '#5ED29C', fontWeight: 600, fontSize: 11 }}>✓ Hecho</span>
                        : <span style={{ color: '#D97706', fontSize: 11 }}>Pendiente</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)', fontSize: 12 }}>
            Sin datos — ejecuta <code>npm run db:seed</code>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

const td: React.CSSProperties = { padding: '8px 12px', color: 'var(--color-foreground)' }
