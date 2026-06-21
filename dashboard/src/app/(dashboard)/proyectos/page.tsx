import { db } from '@/db'
import { proyectos } from '@/db/schema'
import { asc } from 'drizzle-orm'
import { GlassCard } from '@/components/ui/glass-card'
import { StatusDot } from '@/components/ui/badge'
import { createProject, deleteProject } from '@/actions/proyectos'
import type { Proyecto } from '@/db/schema'

async function getProyectos(): Promise<Proyecto[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    return await db.select().from(proyectos).orderBy(asc(proyectos.id))
  } catch { return [] }
}

export default async function ProyectosPage() {
  const rows = await getProyectos()

  const byEstado = (e: string) => rows.filter(r => r.estado === e)
  const grupos = [
    { label: 'En Progreso', items: byEstado('EN_PROGRESO'), color: '#3B82F6' },
    { label: 'Pendiente',   items: byEstado('PENDIENTE'),   color: '#D97706' },
    { label: 'Finalizado',  items: byEstado('FINALIZADO'),  color: '#5ED29C' },
    { label: 'Detenido',    items: byEstado('DETENIDO'),    color: '#EF4444' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>
          Proyectos & Tareas 2026
        </h2>
        <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
          {rows.length} proyecto(s) registrados
        </p>
      </div>

      {/* ── Add form ── */}
      <GlassCard title="Nuevo Proyecto / Tarea" style={{ marginBottom: 24 }}>
        <form action={createProject}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 10, marginBottom: 10,
          }}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Nombre *</span>
              <input name="nombre" required style={inputStyle} placeholder="Nombre del proyecto" />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Responsable</span>
              <input name="resp" defaultValue="Daniel Walcheff" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Inicio</span>
              <input name="inicio" type="date" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Fin</span>
              <input name="fin" type="date" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Estado</span>
              <select name="estado" style={inputStyle}>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="DETENIDO">Detenido</option>
              </select>
            </label>
          </div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: 10 }}>
            <span style={labelTextStyle}>Notas</span>
            <textarea name="notas" rows={2} style={{ ...inputStyle, resize: 'vertical', width: '100%' }} />
          </label>
          <button type="submit" style={btnStyle}>
            + Agregar Proyecto
          </button>
        </form>
      </GlassCard>

      {/* ── Kanban-style groups ── */}
      {rows.length === 0 && (
        <div className="glass" style={{
          borderRadius: 'var(--r-md)', padding: 40,
          textAlign: 'center', color: 'var(--color-muted)',
        }}>
          No hay proyectos. Agrega uno arriba o ejecuta{' '}
          <code>npm run db:seed</code> para cargar los datos iniciales.
        </div>
      )}

      {rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {grupos.map(g => g.items.length > 0 && (
            <div key={g.label}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 10, paddingBottom: 8,
                borderBottom: `2px solid ${g.color}33`,
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: g.color, letterSpacing: '0.05em' }}>
                  {g.label.toUpperCase()}
                </span>
                <span style={{
                  marginLeft: 'auto', fontSize: 11,
                  background: `${g.color}22`, color: g.color,
                  padding: '1px 8px', borderRadius: 'var(--r-pill)', fontWeight: 600,
                }}>
                  {g.items.length}
                </span>
              </div>
              {g.items.map(p => (
                <div key={p.id} className="glass" style={{
                  borderRadius: 'var(--r-sm)', padding: '14px 16px',
                  marginBottom: 10, boxShadow: 'var(--shadow-card)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 4 }}>
                        <span style={{ color: 'var(--color-muted)', marginRight: 6 }}>{p.id}</span>
                        {p.nombre}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 6 }}>
                        {p.resp} · {p.inicio ? p.inicio : '—'} → {p.fin ? p.fin : '—'}
                      </div>
                      {p.notas && (
                        <div style={{ fontSize: 11, color: 'var(--color-subtle)', fontStyle: 'italic' }}>
                          {p.notas}
                        </div>
                      )}
                    </div>
                    {/* Delete form */}
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        title="Eliminar"
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--color-muted)', fontSize: 16, padding: '2px 4px',
                          borderRadius: 'var(--r-sm)', transition: 'color var(--t-fast)',
                        }}
                      >
                        ×
                      </button>
                    </form>
                  </div>
                  <StatusDot estado={p.estado ?? 'PENDIENTE'} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Full table view ── */}
      {rows.length > 0 && (
        <GlassCard title="Vista Completa" style={{ marginTop: 28 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['ID','Proyecto','Resp.','Inicio','Fin','Estado','Notas',''].map(h => (
                    <th key={h} style={{
                      padding: '8px 12px', textAlign: 'left',
                      color: 'var(--color-muted)', fontWeight: 600,
                      fontSize: 11, letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={p.id} style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)',
                  }}>
                    <td style={tdStyle}><code style={{ color: 'var(--color-muted)', fontSize: 11 }}>{p.id}</code></td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--color-foreground)' }}>{p.nombre}</td>
                    <td style={tdStyle}>{p.resp}</td>
                    <td style={tdStyle}>{p.inicio ?? '—'}</td>
                    <td style={tdStyle}>{p.fin ?? '—'}</td>
                    <td style={tdStyle}><StatusDot estado={p.estado ?? 'PENDIENTE'} /></td>
                    <td style={{ ...tdStyle, color: 'var(--color-muted)', fontStyle: 'italic', maxWidth: 200 }}>{p.notas}</td>
                    <td style={tdStyle}>
                      <form action={deleteProject} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" style={{
                          background: 'transparent', border: '1px solid var(--color-border)',
                          color: '#EF4444', fontSize: 11, padding: '2px 8px',
                          borderRadius: 'var(--r-sm)', cursor: 'pointer',
                        }}>
                          Eliminar
                        </button>
                      </form>
                    </td>
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

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }
const labelTextStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: 'var(--color-muted)' }
const inputStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1.4px solid var(--color-border)',
  borderRadius: 'var(--r-sm)',
  color: 'var(--color-foreground)',
  padding: '6px 10px',
  fontSize: 12,
  outline: 'none',
  fontFamily: 'inherit',
}
const btnStyle: React.CSSProperties = {
  background: 'var(--color-primary)',
  color: '#070b0a',
  border: 'none',
  borderRadius: 'var(--r-pill)',
  padding: '7px 20px',
  fontSize: 12, fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity var(--t-fast)',
}
const tdStyle: React.CSSProperties = { padding: '10px 12px', color: 'var(--color-foreground)' }
