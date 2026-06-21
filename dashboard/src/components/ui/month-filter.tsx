'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ALL_MESES } from '@/lib/constants'

export function MonthFilter() {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const mesParam    = searchParams.get('meses')
  const selected    = mesParam ? mesParam.split(',').filter(Boolean) : [...ALL_MESES]
  const isAll       = selected.length === ALL_MESES.length

  function push(next: string[]) {
    const p = new URLSearchParams(searchParams.toString())
    if (next.length === ALL_MESES.length) p.delete('meses')
    else p.set('meses', next.join(','))
    router.push(`${pathname}?${p.toString()}`)
  }

  function toggle(mes: string) {
    if (isAll) { push([mes]); return }
    const already = selected.includes(mes)
    if (already && selected.length === 1) { push([...ALL_MESES]); return }
    push(already ? selected.filter(m => m !== mes) : [...selected, mes])
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', padding: '10px 0' }}>
      <span className="eyebrow" style={{ marginRight: 4 }}>Período</span>
      {ALL_MESES.map(mes => {
        const active = selected.includes(mes)
        return (
          <button
            key={mes}
            onClick={() => toggle(mes)}
            style={{
              padding: '3px 10px', borderRadius: 'var(--r-pill)',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1.4px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: active ? 'var(--color-primary-glow)' : 'transparent',
              color: active ? 'var(--color-primary)' : 'var(--color-muted)',
              transition: 'all var(--t-fast)',
            }}
          >
            {mes}
          </button>
        )
      })}
      {!isAll && (
        <button
          onClick={() => push([...ALL_MESES])}
          style={{
            padding: '3px 10px', borderRadius: 'var(--r-pill)',
            fontSize: 11, cursor: 'pointer',
            border: '1.4px solid var(--color-border)',
            background: 'transparent', color: 'var(--color-muted)',
            transition: 'all var(--t-fast)',
          }}
        >
          Todos
        </button>
      )}
    </div>
  )
}
