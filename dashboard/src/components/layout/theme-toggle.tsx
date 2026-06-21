'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div style={{ width: 110, height: 32 }} />

  const isDark = resolvedTheme !== 'light'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 'var(--r-pill)',
        border: '1.4px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-muted)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer',
        transition: 'all var(--t-fast)',
        whiteSpace: 'nowrap',
      }}
    >
      {isDark ? <Sun size={13} /> : <Moon size={13} />}
      {isDark ? 'Modo claro' : 'Modo oscuro'}
    </button>
  )
}
