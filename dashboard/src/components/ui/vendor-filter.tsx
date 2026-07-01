'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { VEND_COLORS } from '@/lib/constants'

const FALLBACK = '#64748B'

/**
 * Filtro por vendedor / rep. Recibe la lista de nombres disponibles (derivada
 * de los datos en la página server) y escribe la selección en `?vend=` para
 * que la página la lea y filtre sus queries. Mismo patrón que ServiceFilter.
 */
export function VendorFilter({ options, label = 'Vendedor' }: { options: string[]; label?: string }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const param    = searchParams.get('vend')
  const selected = param ? param.split(',').filter(Boolean) : [...options]
  const isAll    = selected.length === options.length

  function push(next: string[]) {
    const p = new URLSearchParams(searchParams.toString())
    if (next.length === 0 || next.length === options.length) p.delete('vend')
    else p.set('vend', next.join(','))
    router.push(`${pathname}?${p.toString()}`)
  }

  function toggle(s: string) {
    if (isAll) { push([s]); return }
    const has = selected.includes(s)
    if (has && selected.length === 1) { push([...options]); return }
    push(has ? selected.filter(x => x !== s) : [...selected, s])
  }

  if (options.length === 0) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
      <span className="eyebrow" style={{ marginRight: 4 }}>{label}</span>
      {options.map(s => {
        const active = selected.includes(s)
        const c = VEND_COLORS[s] ?? FALLBACK
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
          onClick={() => push([...options])}
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
