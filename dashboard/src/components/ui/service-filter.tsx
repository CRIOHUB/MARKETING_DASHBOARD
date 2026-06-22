'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SERVICIOS, CHART_COLORS } from '@/lib/constants'

export function ServiceFilter() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const param    = searchParams.get('serv')
  const selected = param ? param.split(',').filter(Boolean) : [...SERVICIOS]
  const isAll    = selected.length === SERVICIOS.length

  function push(next: string[]) {
    const p = new URLSearchParams(searchParams.toString())
    if (next.length === 0 || next.length === SERVICIOS.length) p.delete('serv')
    else p.set('serv', next.join(','))
    router.push(`${pathname}?${p.toString()}`)
  }

  function toggle(s: string) {
    if (isAll) { push([s]); return }
    const has = selected.includes(s)
    if (has && selected.length === 1) { push([...SERVICIOS]); return }
    push(has ? selected.filter(x => x !== s) : [...selected, s])
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
      <span className="eyebrow" style={{ marginRight: 4 }}>Servicio</span>
      {SERVICIOS.map(s => {
        const active = selected.includes(s)
        const c = CHART_COLORS[s as keyof typeof CHART_COLORS]
        return (
          <button
            key={s}
            onClick={() => toggle(s)}
            style={{
              padding: '3px 10px', borderRadius: 'var(--r-pill)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1.4px solid ${active ? c : 'var(--color-border)'}`,
              background: active ? `${c}1f` : 'transparent',
              color: active ? c : 'var(--color-muted)',
              transition: 'all var(--t-fast)',
            }}
          >
            {s}
          </button>
        )
      })}
      {!isAll && (
        <button
          onClick={() => push([...SERVICIOS])}
          style={{
            padding: '3px 10px', borderRadius: 'var(--r-pill)', fontSize: 11, cursor: 'pointer',
            border: '1.4px solid var(--color-border)', background: 'transparent', color: 'var(--color-muted)',
          }}
        >
          Todos
        </button>
      )}
    </div>
  )
}
