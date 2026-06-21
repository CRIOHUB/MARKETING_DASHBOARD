import { db } from '@/db'
import { actividades } from '@/db/schema'
import { GlassCard } from '@/components/ui/glass-card'
import { KpiBox } from '@/components/ui/kpi-box'
import { ALL_MESES } from '@/lib/constants'

export default async function CalendarioPage() {
  let acts: any[] = []
  try {
    acts = await db.select().from(actividades)
  } catch {}

  const total  = acts.length
  const hechos = acts.filter((r: any) => r.hecho).length

  const cats = [...new Set(acts.map((r: any) => r.cat))].sort()
  const CAT_COLOR: Record<string, string> = {
    MKT: '#2563EB', VM: '#D97706', MKT_DIG: '#059669', EVENTOS: '#7C3AED', ADMIN: '#64748B',
  }

  const displayMeses = ALL_MESES.slice(0, 6)

  function cellVal(meses: any, mes: string): string {
    if (!meses || typeof meses !== 'object') return ''
    return meses[mes] ?? ''
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiBox label="Total Actividades" value={String(total)} />
        <KpiBox label="Completadas" value={String(hechos)} color="var(--color-primary)" />
        <KpiBox label="Pendientes" value={String(total - hechos)} />
        {cats.map(cat => (
          <KpiBox key={cat} label={cat} value={String(acts.filter((r: any) => r.cat === cat).length)}
            color={CAT_COLOR[cat] ?? 'var(--color-muted)'} />
        ))}
      </div>

      <GlassCard title="Cronograma de Actividades 2026 (ENE–JUN)">
        {acts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ ...th, width: 48 }}>#</th>
                  <th style={{ ...th, textAlign: 'left', minWidth: 240 }}>Actividad</th>
                  <th style={{ ...th, width: 80 }}>Cat.</th>
                  <th style={{ ...th, width: 72 }}>Hecho</th>
                  {displayMeses.map(m => <th key={m} style={{ ...th, width: 68 }}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {acts.map((r: any, i: number) => {
                  const cat = r.cat ?? ''
                  const cc  = CAT_COLOR[cat] ?? '#64748B'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)', background: i % 2 ? 'rgba(255,255,255,.015)' : 'transparent' }}>
                      <td style={{ ...td, textAlign: 'center', color: 'var(--color-muted)' }}>{i + 1}</td>
                      <td style={{ ...td, fontWeight: 500 }}>{r.actividad}</td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', padding: '1px 8px',
                          borderRadius: 'var(--r-pill)',
                          background: `${cc}22`, color: cc,
                          fontWeight: 600, fontSize: 10,
                        }}>{cat}</span>
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        {r.hecho
                          ? <span style={{ color: '#5ED29C', fontWeight: 700 }}>✓</span>
                          : <span style={{ color: 'var(--color-muted)' }}>–</span>
                        }
                      </td>
                      {displayMeses.map(m => {
                        const val = cellVal(r.meses, m)
                        return (
                          <td key={m} style={{ ...td, textAlign: 'center', fontSize: 10 }}>
                            {val
                              ? <span style={{ background: `${cc}22`, color: cc, padding: '2px 5px', borderRadius: 4, fontWeight: 600 }}>{val}</span>
                              : <span style={{ color: 'var(--color-border)' }}>·</span>
                            }
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
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

const th: React.CSSProperties = { padding: '8px 10px', textAlign: 'center', color: 'var(--color-muted)', fontWeight: 600 }
const td: React.CSSProperties = { padding: '7px 10px', color: 'var(--color-foreground)' }
