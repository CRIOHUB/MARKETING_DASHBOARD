import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiBoxProps {
  label: string
  value: string
  subvalue?: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  color?: string
}

const TREND_COLOR = { up: '#5ED29C', down: '#EF4444', neutral: 'var(--color-muted)' }
const TREND_ICON  = { up: TrendingUp, down: TrendingDown, neutral: Minus }

export function KpiBox({ label, value, subvalue, trend, trendLabel, color }: KpiBoxProps) {
  const tc   = trend ? TREND_COLOR[trend] : 'var(--color-muted)'
  const Icon = trend ? TREND_ICON[trend]  : null

  return (
    <div className="glass" style={{
      borderRadius: 'var(--r-md)', padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: 'var(--shadow-card)',
    }}>
      <span className="eyebrow">{label}</span>

      <div style={{
        fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
        color: color || 'var(--color-foreground)',
      }}>
        {value}
      </div>

      {(trend || subvalue) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {Icon && <Icon size={13} color={tc} style={{ flexShrink: 0 }} />}
          {trendLabel && <span style={{ fontSize: 12, color: tc, fontWeight: 500 }}>{trendLabel}</span>}
          {subvalue  && <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{subvalue}</span>}
        </div>
      )}
    </div>
  )
}
